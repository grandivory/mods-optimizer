// @flow
/*********************************************************************************************************************
 * Messaging                                                                                                         *
 ********************************************************************************************************************/
self.onmessage = function (message) {
  const openDbRequest = indexedDB.open('ModsOptimizer', 2);
  openDbRequest.onerror = function (event) {
    throw event.target.error;
  };

  openDbRequest.onupgradeneeded = function (event) {
    const db = event.target.result;

    if (event.oldVersion < 1) {
      // Create object stores for: game data about each character, player profiles, and the last run done by each player
      db.createObjectStore('gameSettings', { keyPath: 'baseID' });
      db.createObjectStore('profiles', { keyPath: 'allyCode' });
      db.createObjectStore('lastRuns', { keyPath: 'allyCode' });
    }
    if (event.oldVersion < 2) {
      db.createObjectStore('characterTemplates', { keyPath: 'name' });
    }
  };

  openDbRequest.onsuccess = function (event) {
    const db = event.target.result;
    db.onversionchange = function (event) {
      if (!event.newVersion) {
        db.close();
      }
    };

    let profile, lastRun;

    // Get the data needed to optimize from the profile and last runs
    const getDataTransaction = db.transaction(['profiles', 'lastRuns']);

    getDataTransaction.onerror = function (event) {
      throw event.target.error;
    };

    getDataTransaction.oncomplete = function () {
      if (!profile) {
        throw new Error('Unable to read your profile for optimization. Please clear your cache and try again.');
      }
      const allMods = profile.mods.map(deserializeMod);

      const characters = {};
      const lastRunCharacters = {};

      for (let character of Object.values(profile.characters)) {
        // If there are any holdovers from previous versions, clear them out
        character.optimizerSettings.target = null;
        characters[character.baseID] = character;
      }

      if (lastRun.characters) {
        for (let character of Object.values(lastRun.characters)) {
          // If there are any holdovers from previous versions, clear them out
          character.optimizerSettings.target = null;
          lastRunCharacters[character.baseID] = character;
        }

        lastRun.characters = lastRunCharacters;
      }

      lastRun.modAssignments = profile.modAssignments;

      lastRun.selectedCharacters = lastRun.selectedCharacters instanceof Array ?
        lastRun.selectedCharacters.map(({ id, target }) => ({ id: id, target: deserializeTarget(target) })) :
        lastRun.selectedCharacters;

      const selectedCharacters = profile.selectedCharacters.map(({ id, target }) =>
        ({ id: id, target: deserializeTarget(target) })
      );

      const optimizerResults = optimizeMods(
        allMods,
        characters,
        selectedCharacters,
        profile.globalSettings,
        lastRun
      );

      optimizationSuccessMessage(optimizerResults);
      self.close();
    };

    const profileRequest = getDataTransaction.objectStore('profiles').get(message.data);
    profileRequest.onsuccess = function (event) {
      profile = event.target.result;
    };

    const lastRunRequest = getDataTransaction.objectStore('lastRuns').get(message.data);
    lastRunRequest.onsuccess = function (event) {
      const result = event.target.result;

      if (!result) {
        lastRun = {};
      } else if (result.globalSettings) {
        lastRun = result;
      } else {
        lastRun = Object.assign({}, result, {
          globalSettings: {
            modChangeThreshold: result.modChangeThreshold,
            lockUnselectedCharacters: result.lockUnselectedCharacters,
            forceCompleteSets: false
          }
        })
      }
    };
  };
};

function optimizationSuccessMessage(result) {
  postMessage({
    type: 'OptimizationSuccess',
    result: result
  });
}

function progressMessage(character, step, progress = 100) {
  postMessage({
    type: 'Progress',
    character: character,
    step: step,
    progress: progress
  });
}

/*********************************************************************************************************************
 * End of messaging section                                                                                          *
 ********************************************************************************************************************/

/*********************************************************************************************************************
 * This is a really shitty section of code where I need to copy stuff from all the other files I've already written. *
 * The reason I need to do this here is because Web Workers exist in a totally separate context - I can't load the   *
 * files that were organized in the build step, and can't load anything not accessible via the domain.               *
 ********************************************************************************************************************/
const statTypeMap = Object.freeze({
  'Health': ['health'],
  'Protection': ['protection'],
  'Speed': ['speed'],
  'Critical Damage': ['critDmg'],
  'Potency': ['potency'],
  'Tenacity': ['tenacity'],
  'Offense': ['physDmg', 'specDmg'],
  'Physical Damage': ['physDmg'],
  'Special Damage': ['specDmg'],
  'Critical Chance': ['physCritChance', 'specCritChance'],
  'Physical Critical Chance': ['physCritChance'],
  'Special Critical Chance': ['specCritChance'],
  'Defense': ['armor', 'resistance'],
  'Armor': ['armor'],
  'Resistance': ['resistance'],
  'Accuracy': ['accuracy'],
  'Critical Avoidance': ['critAvoid']
});

const statDisplayNames = Object.freeze({
  'health': 'Health',
  'protection': 'Protection',
  'speed': 'Speed',
  'critDmg': 'Critical Damage',
  'potency': 'Potency',
  'tenacity': 'Tenacity',
  'physDmg': 'Physical Damage',
  'specDmg': 'Special Damage',
  'critChance': 'Critical Chance',
  'physCritChance': 'Physical Critical Chance',
  'specCritChance': 'Special Critical Chance',
  'defense': 'Defense',
  'armor': 'Armor',
  'resistance': 'Resistance',
  'accuracy': 'Accuracy',
  'critAvoid': 'Critical Avoidance',
  'physCritAvoid': 'Physical Critical Avoidance',
  'specCritAvoid': 'Special Critical Avoidance'
});

const wholeStatTypes = Object.freeze(['Health',
  'Protection',
  'Offense',
  'Physical Damage',
  'Special Damage',
  'Speed',
  'Defense',
  'Armor',
  'Resistance']);

const modSlots = Object.freeze(['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross']);

const setBonuses = Object.freeze({
  'health': {
    name: 'health',
    numberOfModsRequired: 2,
    smallBonus: { displayType: 'Health', value: 5, isPercent: true },
    maxBonus: { displayType: 'Health', value: 10, isPercent: true }
  },
  'defense': {
    name: 'defense',
    numberOfModsRequired: 2,
    smallBonus: { displayType: 'Defense', value: 12.5, isPercent: true },
    maxBonus: { displayType: 'Defense', value: 25, isPercent: true }
  },
  'critdamage': {
    name: 'critdamage',
    numberOfModsRequired: 4,
    smallBonus: { displayType: 'Critical Damage', value: 15 },
    maxBonus: { displayType: 'Critical Damage', value: 30 }
  },
  'critchance': {
    name: 'critchance',
    numberOfModsRequired: 2,
    smallBonus: { displayType: 'Critical Chance', value: 4 },
    maxBonus: { displayType: 'Critical Chance', value: 8 }
  },
  'tenacity': {
    name: 'tenacity',
    numberOfModsRequired: 2,
    smallBonus: { displayType: 'Tenacity', value: 10 },
    maxBonus: { displayType: 'Tenacity', value: 20 }
  },
  'offense': {
    name: 'offense',
    numberOfModsRequired: 4,
    smallBonus: { displayType: 'Offense', value: 7.5, isPercent: true },
    maxBonus: { displayType: 'Offense', value: 15, isPercent: true }
  },
  'potency': {
    name: 'potency',
    numberOfModsRequired: 2,
    smallBonus: { displayType: 'Potency', value: 7.5 },
    maxBonus: { displayType: 'Potency', value: 15 }
  },
  'speed': {
    name: 'speed',
    numberOfModsRequired: 4,
    smallBonus: { displayType: 'Speed', value: 5, isPercent: true },
    maxBonus: { displayType: 'Speed', value: 10, isPercent: true }
  }
});

// Map pips to maximum value at level 15 for each primary stat type
const maxStatPrimaries = Object.freeze({
  'Offense': {
    1: 1.88,
    2: 2,
    3: 3.88,
    4: 4,
    5: 5.88,
    6: 8.50
  },
  'Defense': {
    1: 3.75,
    2: 4,
    3: 7.75,
    4: 8,
    5: 11.75,
    6: 20
  },
  'Health': {
    1: 1.88,
    2: 2,
    3: 3.88,
    4: 4,
    5: 5.88,
    6: 16
  },
  'Protection': {
    1: 7.5,
    2: 8,
    3: 15.5,
    4: 16,
    5: 23.5,
    6: 24
  },
  'Speed': {
    1: 17,
    2: 19,
    3: 21,
    4: 26,
    5: 30,
    6: 32
  },
  'Accuracy': {
    1: 7.5,
    2: 8,
    3: 8.75,
    4: 10.5,
    5: 12,
    6: 30
  },
  'Critical Avoidance': {
    1: 15,
    2: 16,
    3: 18,
    4: 21,
    5: 24,
    6: 35
  },
  'Critical Chance': {
    1: 7.50,
    2: 8,
    3: 8.75,
    4: 10.5,
    5: 12,
    6: 20
  },
  'Critical Damage': {
    1: 22.50,
    2: 24,
    3: 27,
    4: 31.5,
    5: 36,
    6: 42
  },
  'Potency': {
    1: 15,
    2: 16,
    3: 18,
    4: 21,
    5: 24,
    6: 30
  },
  'Tenacity': {
    1: 15,
    2: 16,
    3: 18,
    4: 21,
    5: 24,
    6: 35
  }
});

const statSlicingUpgradeFactors = Object.freeze({
  'Offense %': 3.02,
  'Defense %': 2.34,
  'Health %': 1.86,
  'Defense': 1.63,
  'Tenacity': 1.33,
  'Potency': 1.33,
  'Protection %': 1.33,
  'Health': 1.26,
  'Protection': 1.11,
  'Offense': 1.10,
  'Critical Chance': 1.04
});

const statWeights = Object.freeze({
  health: 2000,
  protection: 4000,
  speed: 20,
  critDmg: 30,
  potency: 15,
  tenacity: 15,
  physDmg: 225,
  specDmg: 450,
  offense: 225,
  critChance: 10,
  armor: 33,
  resistance: 33,
  accuracy: 10,
  critAvoid: 10
});

/**
 * Return the first value from an array, if one exists. Otherwise, return null.
 * @param arr {Array}
 * @returns {*}
 */
function firstOrNull(arr) {
  if ('undefined' !== typeof arr[0]) {
    return arr[0];
  } else {
    return null;
  }
}

function chooseFromArray(input, choices) {
  let combinations = [];

  for (let i = 0; i <= input.length - choices; i++) {
    if (1 >= choices) {
      combinations.push([input[i]]);
    } else {
      for (let subResult of chooseFromArray(input.slice(i + 1), choices - 1)) {
        combinations.push([input[i]].concat(subResult));
      }
    }
  }

  return combinations;
}

function areObjectsEquivalent(left, right) {
  // If either object is null, then Object.getOwnPropertyNames will fail. Do these checks first
  if (left === null) {
    return right === null;
  } else if (right === null) {
    return false;
  }

  // Create arrays of property names
  const leftProps = Object.getOwnPropertyNames(left);
  const rightProps = Object.getOwnPropertyNames(right);

  // If number of properties is different,
  // objects are not equivalent
  if (leftProps.length !== rightProps.length) {
    return false;
  }

  // Check that every property is equivalent
  return leftProps.every(propName => {
    if (left[propName] instanceof Object) {
      return areObjectsEquivalent(left[propName], right[propName]);
    } else {
      return left[propName] === right[propName];
    }
  });
}

function deserializeStat(type, value) {
  const displayType = type.endsWith('%') ? type.substr(0, type.length - 1).trim() : type;
  const rawValue = value.replace(/[+%]/g, '');
  const realValue = +rawValue;
  const isPercent = (type.endsWith('%') || value.endsWith('%')) && wholeStatTypes.includes(displayType);

  return {
    type: type,
    displayType: displayType,
    value: realValue,
    isPercent: isPercent
  };
}

function deserializeMod(mod) {
  const primaryStat = deserializeStat(mod.primaryBonusType, mod.primaryBonusValue);
  let secondaryStats = [];

  if ('None' !== mod.secondaryType_1 && '' !== mod.secondaryValue_1) {
    secondaryStats.push(deserializeStat(mod.secondaryType_1, mod.secondaryValue_1));
  }
  if ('None' !== mod.secondaryType_2 && '' !== mod.secondaryValue_2) {
    secondaryStats.push(deserializeStat(mod.secondaryType_2, mod.secondaryValue_2));
  }
  if ('None' !== mod.secondaryType_3 && '' !== mod.secondaryValue_3) {
    secondaryStats.push(deserializeStat(mod.secondaryType_3, mod.secondaryValue_3));
  }
  if ('None' !== mod.secondaryType_4 && '' !== mod.secondaryValue_4) {
    secondaryStats.push(deserializeStat(mod.secondaryType_4, mod.secondaryValue_4));
  }

  const setBonus = setBonuses[mod.set.toLowerCase().replace(' ', '')];

  return {
    id: mod.mod_uid,
    slot: mod.slot.toLowerCase(),
    set: setBonus,
    level: mod.level,
    pips: mod.pips,
    primaryStat: primaryStat,
    secondaryStats: secondaryStats,
    characterID: mod.characterID,
    tier: mod.tier
  };
}

function deserializeTarget(target) {
  const updatedTarget = Object.assign({}, target);

  for (let stat of Object.keys(updatedTarget)) {
    if (Object.keys(statWeights).includes(stat)) {
      updatedTarget[stat] = updatedTarget[stat] / statWeights[stat];
    }
  }

  if (!updatedTarget.targetStats) {
    updatedTarget.targetStats = target.targetStat ? [target.targetStat] : [];
    delete updatedTarget.targetStat;
  }

  // Fill in the `optimizeForTarget` value if it doesn't exist
  updatedTarget.targetStats = updatedTarget.targetStats.map(targetStat =>
    'undefined' !== targetStat.optimizeForTarget
      ? targetStat
      : {
        ...targetStat,
        optimizeForTarget: true
      }
  );

  return updatedTarget;
}

/*********************************************************************************************************************
 * End of shitty code section                                                                                        *
 ********************************************************************************************************************/

/*********************************************************************************************************************
 * Caching variables                                                                                                 *
 ********************************************************************************************************************/
let cache = {};

function clearCache() {
  cache = {
    'modScores': {},
    'modUpgrades': {},
    'modStats': {},
    'statValues': {}
  };
}

/*********************************************************************************************************************
 * End of caching variables                                                                                          *
 ********************************************************************************************************************/

/*********************************************************************************************************************
 * Utility functions                                                                                                 *
 ********************************************************************************************************************/

/**
 * Convert a set of mods into an array of absolute stat values that the set provides to a character
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {{displayType: string, value: number}[]}
 */
function getFlatStatsFromModSet(modSet, character, target) {
  const statsFromSetBonus = getSetBonusStatsFromModSet(
    modSet,
    target.upgradeMods
  );
  const statsDirectlyFromMods = [];
  const flattenedStats = [];
  const combinedStats = {};

  modSet.forEach(mod =>
    statsDirectlyFromMods.push(...cache.modStats[mod.id])
  );

  statsFromSetBonus.forEach(stat =>
    flattenedStats.push(...flattenStatValues(stat, character))
  );

  statsDirectlyFromMods.forEach(stat =>
    flattenedStats.push(...flattenStatValues(stat, character))
  );

  flattenedStats.forEach(stat => {
    const oldStat = combinedStats[stat.displayType];
    if (oldStat) {
      combinedStats[stat.displayType] = {
        displayType: stat.displayType,
        isPercent: stat.isPercent,
        value: oldStat.value + stat.value
      };
    } else {
      combinedStats[stat.displayType] = stat
    }
  });

  // Truncate any stat that can only have a whole value
  return Object.values(combinedStats).map(stat => {
    if (wholeStatTypes.includes(stat.displayType)) {
      return Object.assign(stat, {
        value: Math.trunc(stat.value)
      });
    } else {
      return stat;
    }
  });
}

/**
 * Convert a mod into an array of Stats that all have absolute values based on a given character
 * @param mod {Mod}
 * @param character {Character}
 * @param target {OptimizationPlan}
 */
function getFlatStatsFromMod(mod, character, target) {
  const cacheHit = cache.modStats[mod.id];
  if (cacheHit) {
    return cacheHit;
  }

  const flattenedStats = [];
  const workingMod = getUpgradedMod(mod, character, target);

  flattenedStats.push(...flattenStatValues(workingMod.primaryStat, character));
  workingMod.secondaryStats.forEach(stat =>
    flattenedStats.push(...flattenStatValues(stat, character))
  );

  cache.modStats[mod.id] = flattenedStats;
  return flattenedStats;
}

/**
 * Get all of the Stats that apply to the set bonuses for a given set of mods
 * @param modSet {Array<Mod>}
 * @param upgradeMods {boolean} Whether or not to treat all mods as if they are level 15
 *
 * @return {Array<Stat>}
 */
function getSetBonusStatsFromModSet(modSet, upgradeMods) {
  let setStats = [];
  const setBonusCounts = {};

  modSet.forEach(mod => {
    const setName = mod.set.name;
    const highCountValue = upgradeMods || mod.level === 15 ? 1 : 0;

    setBonusCounts[setName] = {
      setBonus: mod.set,
      lowCount: setBonusCounts[setName] ? setBonusCounts[setName].lowCount + 1 : 1,
      highCount: setBonusCounts[setName] ? setBonusCounts[setName].highCount + highCountValue : highCountValue
    }
  });

  Object.values(setBonusCounts).forEach(({ setBonus, lowCount, highCount }) => {
    const maxBonusCount = Math.floor(highCount / setBonus.numberOfModsRequired);
    const smallBonusCount =
      Math.floor((lowCount - maxBonusCount * setBonus.numberOfModsRequired) / setBonus.numberOfModsRequired);

    for (let i = 0; i < maxBonusCount; i++) {
      setStats.push(setBonus.maxBonus);
    }

    for (let i = 0; i < smallBonusCount; i++) {
      setStats.push(setBonus.smallBonus);
    }
  });

  return setStats;
}

/**
 * Take a stat that may be a percentage and return only the name and absolute values
 * of the stats it affects for a character
 * @param stat {Stat}
 * @param character {Character}
 *
 * @returns {Array<Stat>}
 */
function flattenStatValues(stat, character) {
  const cacheKey = stat.displayType + stat.isPercent + stat.value;
  const cacheHit = cache.statValues[cacheKey];

  if (cacheHit) {
    return cacheHit;
  }

  const statPropertyNames = statTypeMap[stat.displayType];

  const flattenedStats = statPropertyNames.map(statName => {
    const displayName = statDisplayNames[statName];

    if (stat.isPercent && character.playerValues.baseStats) {
      return {
        displayType: displayName,
        value: stat.value * character.playerValues.baseStats[statName] / 100
      };
    } else if (!stat.isPercent) {
      return {
        displayType: displayName,
        value: stat.value
      };
    } else {
      throw new Error(`Stat is given as a percentage, but ${character.baseID} has no base stats`);
    }
  });

  cache.statValues[cacheKey] = flattenedStats;
  return flattenedStats;
}

/**
 * Check to see if a set of mods satisfies all the restrictions a character has placed
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 */
function modSetSatisfiesCharacterRestrictions(modSet, character, target) {
  const minimumDots = character.optimizerSettings.minimumModDots;
  const modSetSlots = {};
  modSet.forEach(mod => modSetSlots[mod.slot] = mod);

  return modSet.every(mod => mod.pips >= minimumDots) &&
    (!target.primaryStatRestrictions.arrow ||
      (modSetSlots.arrow && modSetSlots.arrow.primaryStat.type === target.primaryStatRestrictions.arrow)) &&
    (!target.primaryStatRestrictions.triangle ||
      (modSetSlots.triangle && modSetSlots.triangle.primaryStat.type === target.primaryStatRestrictions.triangle)) &&
    (!target.primaryStatRestrictions.circle ||
      (modSetSlots.circle && modSetSlots.circle.primaryStat.type === target.primaryStatRestrictions.circle)) &&
    (!target.primaryStatRestrictions.cross ||
      (modSetSlots.cross && modSetSlots.cross.primaryStat.type === target.primaryStatRestrictions.cross)) &&
    (!(target.useOnlyFullSets) || modSetFulfillsFullSetRestriction(modSet)) &&
    modSetFulfillsSetRestriction(modSet, target.setRestrictions) &&
    modSetFulfillsTargetStatRestriction(modSet, character, target);
}

/**
 * Find any goal stats that weren't hit and return the target and the value.
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @param goalStats {Array<TargetStat>}
 * @param target {OptimizationPlan}
 */
function getMissedGoals(modSet, character, goalStats, target) {
  const missedStats = goalStats.map(goalStat => {
    const characterValue = getStatValueForCharacterWithMods(modSet, character, goalStat.stat, target);

    if (characterValue < goalStat.minimum || characterValue > goalStat.maximum) {
      return [goalStat, characterValue];
    } else {
      return null;
    }
  });

  return missedStats.filter(x => x !== null)
}

/**
 * Checks to see if this mod set is made up of only full sets
 *
 * @param modSet {Array<Mod>}
 * @returns {Boolean}
 */
function modSetFulfillsFullSetRestriction(modSet) {
  // Count how many mods exist in each set
  const setCounts = modSet.reduce((acc, mod) => {
    return Object.assign({}, acc, {
      [mod.set.name]: (acc[mod.set.name] || 0) + 1
    })
  }, {});

  return Object.entries(setCounts).every(
    ([setName, count]) => 0 === count % setBonuses[setName].numberOfModsRequired
  );
}

/**
 * Checks to see if this mod set satisfies all of the sets listed in setDefinition
 *
 * @param modSet {Array<Mod>}
 * @param setDefinition {Object<String, Number>}
 * @returns {Boolean}
 */
function modSetFulfillsSetRestriction(modSet, setDefinition) {
  // Count how many mods exist in each set
  const setCounts = modSet.reduce((acc, mod) => {
    return Object.assign({}, acc, {
      [mod.set.name]: (acc[mod.set.name] || 0) + 1
    })
  }, {});

  // Check that each set in the setDefinition has a corresponding value at least that high in setCounts, unless
  // the given count is -1, meaning the set should be actively avoided
  return Object.entries(setDefinition).every(([setName, count]) => {
    const numberOfFullSets = Math.floor((setCounts[setName] || 0) / setBonuses[setName].numberOfModsRequired);
    return (count >= 0 && numberOfFullSets >= count) || (count < 0 && numberOfFullSets === 0);
  });
}

/**
 * Checks to see if this mod set meets the target stat
 *
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {boolean}
 */
function modSetFulfillsTargetStatRestriction(modSet, character, target) {
  const targetStats = target.targetStats;

  if (0 === targetStats.length) {
    return true;
  }

  // Check each target stat individually
  return targetStats.every(targetStat => {
    const totalValue = getStatValueForCharacterWithMods(modSet, character, targetStat.stat, target);
    return totalValue <= targetStat.maximum && totalValue >= targetStat.minimum;
  });
}

/**
 * Find the absolute value that a given stat has for a character, given a set of mods equipped on them
 *
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @param stat {String}
 * @param target {OptimizationPlan}
 */
function getStatValueForCharacterWithMods(modSet, character, stat, target) {
  if (statTypeMap[stat] && statTypeMap[stat].length > 1) {
    throw new Error(
      "Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special."
    );
  }

  if (stat === "Health+Protection") {
    const healthProperty = statTypeMap["Health"][0];
    const protProperty = statTypeMap["Protection"][0];
    const baseValue = character.playerValues.equippedStats[healthProperty] +
      character.playerValues.equippedStats[protProperty];

    const setStats = getFlatStatsFromModSet(modSet, character, target);

    const setValue = setStats.reduce((setValueSum, setStat) =>
      // Check to see if the stat is health or protection. If it is, add its value to the total.
      setStat.displayType === "Health" || setStat.displayType === "Protection" ? setValueSum + setStat.value : setValueSum
      , 0);

    return baseValue + setValue;
  } else {
    const statProperty = statTypeMap[stat][0];
    const baseValue = character.playerValues.equippedStats[statProperty];

    const setStats = getFlatStatsFromModSet(modSet, character, target);

    const setValue = setStats.reduce((setValueSum, setStat) =>
      // Check to see if the stat is the target stat. If it is, add its value to the total.
      setStat.displayType === stat ? setValueSum + setStat.value : setValueSum
      , 0);
    let returnValue = baseValue + setValue;

    // Change target stat to a percentage for Armor and Resistance
    // so Reo'Ris shuts up about it in the Discord.
    if (['armor', 'resistance'].includes(statProperty)) {
      returnValue = 100 * returnValue / (character.playerValues.level * 7.5 + returnValue);
    }

    return returnValue;
  }
}

/**
 * Given a set of mods and a definition of setRestriction, return only those mods that fit the setRestriction
 *
 * @param allMods {Array<Mod>}
 * @param setRestriction {Object}
 * @returns {Array<Mod>}
 */
function restrictMods(allMods, setRestriction) {
  const potentialSets = areSetsComplete(setRestriction) ?
    Object.entries(setRestriction).filter(([set, count]) => count > 0).map(([set]) => set) :
    Object.values(setBonuses).map(setBonus => setBonus.name);

  return allMods.filter(mod => potentialSets.includes(mod.set.name));
}

/**
 * Utility function to determine if a given sets definition covers all 6 mod slots
 *
 * @param setDefinition {Object<SetBonus, Number>}
 * @returns {Boolean}
 */
function areSetsComplete(setDefinition) {
  return 6 === Object.entries(setDefinition)
    .filter(([setName, setCount]) => -1 !== setCount)
    .reduce((filledSlots, [setName, setCount]) => filledSlots + setBonuses[setName].numberOfModsRequired * setCount, 0);
}

/**
 * Filter a set of mods based on a minimum dot level and a specified primary stat. If there aren't any mods that fit
 * the filter, then the primary stat restriction will be dropped first, followed by the minimum dot restriction.
 * Return both the filtered mods and any messages to display about changes that were made
 *
 * @param baseMods {Array<Mod>} The set of mods to filter
 * @param slot {String} The slot that the mods have to fill
 * @param minDots {Number} The minimum dot level of the mod
 * @param primaryStat {String} The primary stat that each mod needs to have
 *
 * @returns {mods, messages}
 */
function filterMods(baseMods, slot, minDots, primaryStat) {
  if (primaryStat) { // Only filter if some primary stat restriction is set
    const fullyFilteredMods =
      baseMods.filter(mod => mod.slot === slot && mod.pips >= minDots && mod.primaryStat.type === primaryStat);
    if (fullyFilteredMods.length > 0) {
      return { mods: fullyFilteredMods, messages: [] };
    }
  }

  const dotFilteredMods = baseMods.filter(mod => mod.slot === slot && mod.pips >= minDots);
  if (dotFilteredMods.length > 0) {
    return {
      mods: dotFilteredMods,
      // Only pass a message back if primaryStat was actually set
      messages: (primaryStat &&
        [`No ${primaryStat} ${slot} mods were available, so the primary stat restriction was dropped.`]) || []
    };
  }

  const slotFilteredMods = baseMods.filter(mod => mod.slot === slot);
  if (slotFilteredMods.length > 0) {
    return {
      mods: slotFilteredMods,
      messages: primaryStat ?
        [`No ${primaryStat} or ${minDots}-dot ${slot} mods were available, so both restrictions were dropped.`] :
        [`No ${minDots}-dot ${slot} mods were available, so the dots restriction was dropped.`]
    }
  } else {
    return {
      mods: [],
      messages: [`No ${slot} mods were available to use.`]
    }
  }
}

/**
 * Return a function to sort mods by their scores for a character
 *
 * @param character Character
 */
function modSort(character) {
  return (left, right) => {
    if (cache.modScores[right.id] === cache.modScores[left.id]) {
      // If mods have equal value, then favor the one that's already equipped
      if (left.characterID && character.baseID === left.characterID) {
        return -1;
      } else if (right.characterID && character.baseID === right.characterID) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return cache.modScores[right.id] - cache.modScores[left.id];
    }
  }
}

/**
 * Return how valuable a particular stat is for an Optimization Plan
 * @param stat {Stat}
 * @param target {OptimizationPlan}
 */
function scoreStat(stat, target) {
  // Because Optimization Plans treat all critical chance the same, we can't break it into physical and special crit
  // chance for scoring. Catch this edge case so that we can properly value crit chance
  const targetProperties = ['Critical Chance', 'Physical Critical Chance'].includes(stat.displayType) ? ['critChance'] : statTypeMap[stat.displayType];
  return targetProperties.reduce((acc, targetProperty) =>
    target[targetProperty] ? acc + target[targetProperty] * stat.value : acc
    , 0);
}

/**
 * Given a mod and an optimization plan, figure out the value for that mod
 *
 * @param mod {Mod}
 * @param character {Character} Character for whom the mod is being scored
 * @param target {OptimizationPlan} The plan that represents what each stat is worth
 */
function scoreMod(mod, character, target) {
  const cacheHit = cache.modScores[mod.id];
  if (cacheHit) {
    return cacheHit;
  }

  const flattenedStatValues = cache.modStats[mod.id];

  const modScore = flattenedStatValues
    .reduce((score, stat) => score + scoreStat(stat, target), 0);

  cache.modScores[mod.id] = modScore;
  return modScore;
}

/**
 * Get the stats that a mod would have were it upgraded to level 15 and/or sliced to 6E,
 * based on the optimization target of the given character
 * @param mod {Mod}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {Mod}
 */
function getUpgradedMod(mod, character, target) {
  const cacheHit = cache.modUpgrades[mod.id];
  if (cacheHit) {
    return cacheHit;
  }

  const workingMod = Object.assign({}, mod);

  // Level the mod if the target says to
  if (15 > workingMod.level && target.upgradeMods) {
    workingMod.primaryStat = {
      displayType: workingMod.primaryStat.displayType,
      isPercent: workingMod.primaryStat.isPercent,
      value: maxStatPrimaries[workingMod.primaryStat.displayType][workingMod.pips]
    };
    workingMod.level = 15;
  }

  // Slice the mod to 6E if needed
  if (15 === workingMod.level && 5 === workingMod.pips && character.optimizerSettings.sliceMods) {
    workingMod.pips = 6;
    workingMod.primaryStat = {
      displayType: workingMod.primaryStat.displayType,
      isPercent: workingMod.primaryStat.isPercent,
      value: maxStatPrimaries[workingMod.primaryStat.displayType][6]
    };
    workingMod.secondaryStats = workingMod.secondaryStats.map(stat => {
      const statName = stat.isPercent ? `${stat.displayType} %` : stat.displayType;

      return {
        displayType: stat.displayType,
        isPercent: stat.isPercent,
        value: 'Speed' === stat.displayType ? stat.value + 1 : statSlicingUpgradeFactors[statName] * stat.value
      };
    });
    workingMod.tier = 1;
  }

  cache.modUpgrades[mod.id] = workingMod;
  return workingMod;
}

/**
 * Given a set of mods, get the value of that set for a character
 *
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 */
function scoreModSet(modSet, character, target) {
  return getFlatStatsFromModSet(modSet, character, target)
    .reduce((score, stat) => score + scoreStat(stat, target), 0);
}

/**
 * Given a set of set restrictions, systematically reduce their severity, returning an array sorted by most to least
 * restrictive
 *
 * @param setRestrictions {Object}
 * @returns {{restriction: Object, messages: Array<String>}[]}
 */
function loosenRestrictions(setRestrictions) {
  let restrictionsArray = [{
    restriction: setRestrictions,
    messages: []
  }];

  // Try without sets
  restrictionsArray.forEach(({ restriction, messages }) => {
    if (Object.entries(restriction).length) {
      restrictionsArray.push({
        restriction: {},
        messages:
          messages.concat('No mod sets could be found using the given sets, so the sets restriction was removed')
      });
    }
  });

  return restrictionsArray;
}

/*********************************************************************************************************************
 * End of utility functions                                                                                          *
 ********************************************************************************************************************/

/*********************************************************************************************************************
 * Startup code                                                                                                      *
 ********************************************************************************************************************/

// This will be used later. It's calculated here in the constructor so that it only needs to be calculated once
const fourSlotOptions = chooseFromArray(modSlots, 4);

const chooseFourOptions = [];
for (let usedSlots of fourSlotOptions) {
  chooseFourOptions.push([usedSlots, modSlots.filter(slot => !usedSlots.includes(slot))]);
}

const twoSlotOptions = chooseFromArray(modSlots, 2);
const chooseTwoOptions = [];
for (let firstSetSlots of twoSlotOptions) {
  let remainingSlots = modSlots.filter(slot => !firstSetSlots.includes(slot));
  let secondSetOptions = chooseFromArray(remainingSlots, 2);
  for (let secondSetSlots of secondSetOptions) {
    chooseTwoOptions.push([
      firstSetSlots,
      secondSetSlots,
      remainingSlots.filter(slot => !secondSetSlots.includes(slot))
    ]);
  }
}

Object.freeze(chooseFourOptions);
Object.freeze(chooseTwoOptions);

/*********************************************************************************************************************
 * End of startup code                                                                                               *
 ********************************************************************************************************************/

/*********************************************************************************************************************
 * Optimization code                                                                                                 *
 ********************************************************************************************************************/

/**
 * Find the optimum configuration for mods for a list of characters by optimizing mods for the first character,
 * optimizing mods for the second character after removing those used for the first, etc.
 *
 * @param availableMods {Array<Mod>} An array of mods that could potentially be assign to each character
 * @param characters {Object<String, Character>} A set of characters keyed by base ID that might be optimized
 * @param order {Array<Object>} The characters to optimize, in order, as {id, target}
 * @param globalSettings {Object} The settings to apply to every character being optimized
 * @param previousRun {Object} The settings from the last time the optimizer was run, used to limit expensive
 *                             recalculations for optimizing mods
 * @return {Object} An array with an entry for each item in `order`. Each entry will be of the form
 *                  {id, target, assignedMods, messages}
 */
function optimizeMods(availableMods, characters, order, globalSettings, previousRun = {}) {
  // We only want to recalculate mods if settings have changed between runs. If global settings or locked
  // characters have changed, recalculate all characters
  let recalculateMods = !previousRun.globalSettings ||
    globalSettings.modChangeThreshold !== previousRun.globalSettings.modChangeThreshold ||
    globalSettings.lockUnselectedCharacters !== previousRun.globalSettings.lockUnselectedCharacters ||
    globalSettings.forceCompleteSets !== previousRun.globalSettings.forceCompleteSets ||
    availableMods.length !== previousRun.mods.length;

  if (!recalculateMods) {
    for (let charID in characters) {
      if (!characters.hasOwnProperty(charID)) {
        continue;
      }
      if (!previousRun.characters[charID] ||
        previousRun.characters[charID].optimizerSettings.isLocked !== characters[charID].optimizerSettings.isLocked) {
        recalculateMods = true;
        break;
      }
    }
  }

  // Filter out any mods that are on locked characters, including if all unselected characters are locked
  let usableMods = availableMods.filter(mod =>
    !mod.characterID || !characters[mod.characterID].optimizerSettings.isLocked);

  if (globalSettings.lockUnselectedCharacters) {
    const selectedCharacterIds = order.map(({ id }) => id);
    usableMods = usableMods.filter(mod => !mod.characterID || selectedCharacterIds.includes(mod.characterID))
  }

  const unselectedCharacters =
    Object.keys(characters).filter(characterID => !order.map(({ id }) => id).includes(characterID))

  const lockedCharacters = Object.keys(characters)
    .filter(id => characters[id].optimizerSettings.isLocked)
    .concat(globalSettings.lockUnselectedCharacters ? unselectedCharacters : []);

  // For each not-locked character in the list, find the best mod set for that character
  const optimizerResults = order.reduce((modSuggestions, { id: characterID, target }, index) => {
    const character = characters[characterID];
    const previousCharacter = previousRun.characters ? previousRun.characters[characterID] : null;

    // If the character is locked, skip it
    if (character.optimizerSettings.isLocked) {
      modSuggestions.push(null);
      return modSuggestions;
    }

    // For each character, check if the settings for the previous run were the same, and skip the character if so
    if (
      !recalculateMods &&
      previousRun.selectedCharacters &&
      previousRun.selectedCharacters[index] &&
      characterID === previousRun.selectedCharacters[index].id &&
      previousCharacter &&
      previousCharacter.playerValues &&
      areObjectsEquivalent(character.playerValues, previousCharacter.playerValues) &&
      areObjectsEquivalent(
        target,
        previousRun.selectedCharacters[index].target
      ) &&
      previousCharacter.optimizerSettings &&
      character.optimizerSettings.minimumModDots === previousCharacter.optimizerSettings.minimumModDots &&
      character.optimizerSettings.sliceMods === previousCharacter.optimizerSettings.sliceMods &&
      character.optimizerSettings.isLocked === previousCharacter.optimizerSettings.isLocked
    ) {
      const assignedMods = previousRun.modAssignments[index].assignedMods;
      const messages = previousRun.modAssignments[index].messages;
      const missedGoals = previousRun.modAssignments[index].missedGoals || [];
      // Remove any assigned mods from the available pool
      for (let i = usableMods.length - 1; i >= 0; i--) {
        if (assignedMods.includes(usableMods[i].id)) {
          usableMods.splice(i, 1);
        }
      }

      modSuggestions.push({
        id: characterID,
        target: target,
        assignedMods: assignedMods,
        messages: messages,
        missedGoals: missedGoals
      });
      return modSuggestions;
    } else {
      recalculateMods = true;
    }

    if (globalSettings.forceCompleteSets) {
      target.useOnlyFullSets = true;
    }

    const absoluteTarget =
      changeRelativeTargetStatsToAbsolute(
        modSuggestions,
        characters,
        lockedCharacters,
        availableMods,
        target,
        character
      );

    // Extract any target stats that are set as only goals
    const goalStats = absoluteTarget.targetStats.filter(targetStat => !targetStat.optimizeForTarget);
    const filteredAbsoluteTarget = {
      ...absoluteTarget,
      targetStats: absoluteTarget.targetStats.filter(targetStat => targetStat.optimizeForTarget)
    }

    const realTarget = combineTargetStats(filteredAbsoluteTarget, character);

    const { modSet: newModSetForCharacter, messages: characterMessages } =
      findBestModSetForCharacter(usableMods, character, realTarget);

    const oldModSetForCharacter = usableMods.filter(mod => mod.characterID === character.baseID);

    const newModSetValue = scoreModSet(newModSetForCharacter, character, realTarget);
    const oldModSetValue = scoreModSet(oldModSetForCharacter, character, realTarget);

    // Assign the new mod set if any of the following are true:
    let assignedModSet, assignmentMessages = [];
    if (
      // Treat a threshold of 0 as "always change", so long as the new mod set is better than the old at all
      (globalSettings.modChangeThreshold === 0 && newModSetValue >= oldModSetValue) ||
      // If the new set is the same mods as the old set
      (newModSetForCharacter.length === oldModSetForCharacter.length &&
        oldModSetForCharacter.every(oldMod => newModSetForCharacter.find(newMod => newMod.id === oldMod.id))
      ) ||
      // If the old set doesn't satisfy the character/target restrictions, but the new set does
      (!modSetSatisfiesCharacterRestrictions(oldModSetForCharacter, character, realTarget) &&
        modSetSatisfiesCharacterRestrictions(newModSetForCharacter, character, realTarget)
      ) ||
      // If the new set is better than the old set
      (newModSetValue / oldModSetValue) * 100 - 100 > globalSettings.modChangeThreshold ||
      // If the old set now has less than 6 mods and the new set has more mods
      (oldModSetForCharacter.length < 6 &&
        newModSetForCharacter.length > oldModSetForCharacter.length)
    ) {
      assignedModSet = newModSetForCharacter;
      assignmentMessages = characterMessages;
    } else {
      assignedModSet = oldModSetForCharacter;
      if (!modSetSatisfiesCharacterRestrictions(newModSetForCharacter, character, realTarget)) {
        assignmentMessages.push(
          'Could not find a new mod set that satisfies the given restrictions. Leaving the old mods equipped.'
        )
      }
    }

    // // Check the goal stats and add any messages related to missing goals
    // assignmentMessages.push(...getMissingGoalStatMessages(newModSetForCharacter, character, goalStats, target));

    // Remove any assigned mods from the available pool
    for (let i = usableMods.length - 1; i >= 0; i--) {
      if (assignedModSet.includes(usableMods[i])) {
        usableMods.splice(i, 1);
      }
    }

    modSuggestions.push({
      id: characterID,
      target: target,
      assignedMods: assignedModSet.map(mod => mod.id),
      messages: assignmentMessages,
      missedGoals: getMissedGoals(assignedModSet, character, goalStats, target)
    });

    return modSuggestions;
  },
    []);

  // Delete any cache that we had saved
  clearCache();

  return optimizerResults;
}

/**
 * Given a target for a character, update any relative target stats to asbolute
 * target stats by adding the base values from the relative character
 *
 * @param modSuggestions {Array<Object>} An array of previously optimized characters
 * @param character {Object<String, Character>} A map of character IDs to character objects
 * @param lockedCharacters {Array<String>} An array containing all of the locked character IDs
 * @param allMods {Array<Mod>} An array of all mods, used to find equipped mods for a character when they are locked
 * @param target {OptimizationPlan} The target that is being changed
 * @param character {Character} The character currently being optimized
 */
function changeRelativeTargetStatsToAbsolute(modSuggestions, characters, lockedCharacters, allMods, target, character) {
  const oldTargetStats = target.targetStats;
  // Make a copy of mod suggestions so that we don't modify the original
  const currentModSuggestions = modSuggestions.slice(0);

  return {
    ...target,
    targetStats: oldTargetStats.map(targetStat => {
      if (!targetStat.relativeCharacterId) {
        return targetStat;
      }

      const relativeCharacter = characters[targetStat.relativeCharacterId];
      let characterMods;


      if (lockedCharacters.includes(targetStat.relativeCharacterId)) {
        // Get the character's mods from the set of all mods
        characterMods = allMods.filter(mod => mod.characterID === targetStat.relativeCharacterId)
      } else {
        // Find the character by searching backwards through the modSuggestions array
        const characterModsEntry =
          currentModSuggestions
            .filter(x => null !== x)
            .reverse()
            .find(({ id }) => id === targetStat.relativeCharacterId);
        if (undefined === characterModsEntry) {
          throw new Error(
            `Could not find suggested mods for ${targetStat.relativeCharacterId}.  ` +
            `Make sure they are selected above ${character.baseID}`
          )
        }

        characterMods = characterModsEntry.assignedMods.map(modId => allMods.find(mod => mod.id === modId));
      }

      // Because we so heavily rely on the cache, we need to make sure the mod values are cached here.
      clearCache();
      characterMods.forEach(mod => {
        getFlatStatsFromMod(mod, relativeCharacter, target);
      });

      const characterStatValue =
        getStatValueForCharacterWithMods(characterMods, relativeCharacter, targetStat.stat, target);

      let minimum, maximum;

      if (targetStat.type === '%') {
        minimum = characterStatValue * targetStat.minimum / 100;
        maximum = characterStatValue * targetStat.maximum / 100;
      } else {
        minimum = characterStatValue + targetStat.minimum;
        maximum = characterStatValue + targetStat.maximum;
      }

      return {
        minimum: minimum,
        maximum: maximum,
        stat: targetStat.stat,
        relativeCharacterId: null,
        type: null,
        optimizeForTarget: targetStat.optimizeForTarget
      };
    })
  };
}

/**
 * Combine multiple iterations of a target stat into a single target by taking the intersection of the
 * ranges. If there is no intersection, throw an error
 *
 * @param target {OptimizationPlan}
 * @param character {Character}
 */
function combineTargetStats(target, character) {
  const targetStatMap = {};

  target.targetStats.forEach(targetStat => {
    const statName = targetStat.stat;

    if (!targetStatMap.hasOwnProperty(statName)) {
      targetStatMap[statName] = targetStat;
      return;
    }

    const newMinimum = Math.max(targetStatMap[statName].minimum, targetStat.minimum);
    const newMaximum = Math.min(targetStatMap[statName].maximum, targetStat.maximum);

    if (newMinimum > newMaximum) {
      throw new Error(`
        The multiple ${statName} targets on ${character.baseID} don't have any solution. Please adjust the targets.
        First Target: ${targetStatMap[statName].minimum}-${targetStatMap[statName].maximum}.
        Second Target: ${targetStat.minimum}-${targetStat.maximum}.
      `.trim());
    }

    targetStatMap[statName].minimum = newMinimum;
    targetStatMap[statName].maximum = newMaximum;
  });

  return {
    ...target,
    targetStats: Object.values(targetStatMap)
  };
}

/**
 * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
 * such that the values in the plan are optimized.
 *
 * @param mods {Array<Mod>} The set of mods that is available to be used for this character
 * @param character {Character} A Character object that represents all of the base stats required
 *                              for percentage calculations
 * @param target {OptimizationPlan}
 * @returns {{messages: Array<String>, modSet: Array<Mod>}}
 */
function findBestModSetForCharacter(mods, character, target) {
  const modsToCache = character.playerValues.gearLevel < 12 ?
    mods.filter(mod => 6 > mod.pips || mod.characterID === character.baseID) :
    mods;
  const usableMods = character.playerValues.gearLevel < 12 ?
    mods.filter(mod => 6 > mod.pips || mod.characterID === character.baseID) :
    mods;
  const setRestrictions = target.setRestrictions;
  const targetStats = target.targetStats;
  // Clear the cache at the start of each character
  clearCache();

  // Get the flattened stats and score every mod for this character. From that point on, only look at the cache
  // for the rest of the time processing mods for this character.
  modsToCache.forEach(mod => {
    getFlatStatsFromMod(mod, character, target);
    scoreMod(mod, character, target);
  });

  let modSet, messages, extraMessages = []
  let mutableTarget = Object.assign({}, target)
    , reducedTarget;

  // First, check to see if there is any target stat
  switch (0 < targetStats.length) {
    case true:
      // If so, create an array of potential mod sets that could fill it
      let potentialModSets = getPotentialModsToSatisfyTargetStats(usableMods, character, mutableTarget);

      ({ modSet, messages } = findBestModSetFromPotentialMods(potentialModSets, character, mutableTarget));

      // If we couldn't find a mod set that would fulfill the target stat, but we're limiting to only full sets, then
      // try again without that limitation
      if (modSet.length === 0) {
        reducedTarget = mutableTarget.useOnlyFullSets ?
          Object.assign({}, mutableTarget, {
            useOnlyFullSets: false
          }) :
          mutableTarget;

        if (mutableTarget.useOnlyFullSets) {
          extraMessages.push('Could not fill the target stat with full sets, so the full sets restriction was dropped');

          potentialModSets = getPotentialModsToSatisfyTargetStats(usableMods, character, mutableTarget);
          ({ modSet, messages } = findBestModSetFromPotentialMods(potentialModSets, character, reducedTarget));
        }
      }

      if (modSet.length === 0) {
        ({ modSet, messages } =
          findBestModSetByLooseningSetRestrictions(usableMods, character, reducedTarget, setRestrictions));

        extraMessages.push('Could not fill the target stats as given, so the target stat restriction was dropped');
      }

      if (modSet.length) {
        // Return the best set and set of messages
        return {
          modSet: modSet,
          messages: messages.concat(extraMessages)
        };
      }

      extraMessages = ['Could not fulfill the target stat as given, so the target stat restriction was dropped'];
      mutableTarget.targetStat = null;
    // Intentional fall-through
    case false:
      // If not, simply iterate over all levels of restrictions until a suitable set is found.
      progressMessage(character, 'Finding the best mod set');
      ({ modSet, messages } =
        findBestModSetByLooseningSetRestrictions(usableMods, character, mutableTarget, setRestrictions));

      if (modSet.length === 0 && mutableTarget.useOnlyFullSets) {
        reducedTarget = Object.assign({}, mutableTarget, {
          useOnlyFullSets: false
        });
        extraMessages.push('Could not find a mod set using only full sets, so the full sets restriction was dropped');

        ({ modSet, messages } =
          findBestModSetByLooseningSetRestrictions(usableMods, character, reducedTarget, setRestrictions));
      }

      return {
        modSet: modSet,
        messages: messages.concat(extraMessages)
      };
  }
}

/**
 * Given a set of mods and a target stat, get all of the mod and set restriction combinations that will fit that target
 * @param allMods {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @returns {Array<Array<Mod>,Object<String, Number>>} An array of potential mods that could be used to create a set
 *   that fulfills the target stat as [mods, setRestriction]
 */
// TODO: Refactor this function
// * Create a new function that will loop over each target stat
// * At each iteration, run the equivalent of this function on every mod set from the previous iteration
// * Then, filter out any that are empty
function* getPotentialModsToSatisfyTargetStats(allMods, character, target) {
  const setRestrictions = target.setRestrictions;
  const targetStats = target.targetStats.slice(0);
  const statNames = targetStats.map(targetStat => targetStat.stat);
  // A map from the set name to the value the set provides for a target stat
  // {statName: {set, value}}
  const setValues = getSetBonusesThatHaveValueForStats(statNames, character, setRestrictions);

  // First, get the base values of each stat on the character so they can be subtracted
  // from what's needed for the min and max
  // {statName: value}
  const characterValues = getStatValuesForCharacter(character, statNames);

  // Determine the sets of values for each target stat that will satisfy it
  // {statName: {setCount: [{slot: slotValue}]}}
  const modConfigurationsByStat = {};
  const totalModSlotsOpen = 6 - Object.entries(setRestrictions).filter(([setName, setCount]) => -1 !== setCount).reduce(
    (filledSlots, [setName, setCount]) => filledSlots + setBonuses[setName].numberOfModsRequired * setCount, 0
  );

  // Filter out any mods that don't meet primary or set restrictions. This can vastly speed up this process
  const usableMods =
    filterOutUnusableMods(allMods, target, totalModSlotsOpen, character.optimizerSettings.minimumModDots)

  const [modValues, valuesBySlot] = collectModValuesBySlot(usableMods, statNames);

  targetStats.forEach(targetStat => {
    const setValue = setValues[targetStat.stat];

    if (setValue) {
      modConfigurationsByStat[targetStat.stat] = {};
      const minSets = setRestrictions[setValue.set.name] || 0;
      const maxSets = (setRestrictions[setValue.set.name] || 0) +
        Math.floor(totalModSlotsOpen / setValue.set.numberOfModsRequired)

      for (let numSetsUsed = minSets; numSetsUsed <= maxSets; numSetsUsed++) {
        const nonModValue = characterValues[targetStat.stat] + setValue.value * numSetsUsed;

        const progressMin = (numSetsUsed - minSets) / (maxSets - minSets + 1) * 100;
        const progressMax = (numSetsUsed - minSets + 1) / (maxSets - minSets + 1) * 100;

        modConfigurationsByStat[targetStat.stat][numSetsUsed] = findStatValuesThatMeetTarget(
          valuesBySlot[targetStat.stat],
          targetStat.minimum - nonModValue,
          targetStat.maximum - nonModValue,
          progressMin,
          progressMax,
          character
        );
      }
    } else {
      modConfigurationsByStat[targetStat.stat] = {
        0: findStatValuesThatMeetTarget(
          valuesBySlot[targetStat.stat],
          targetStat.minimum - characterValues[targetStat.stat],
          targetStat.maximum - characterValues[targetStat.stat],
          0,
          100,
          character
        )
      }
    }
  });

  /**
   * Given a set of mods, return only those mods that might be used with the current target. Filter out any mods
   * that don't have the correct primary stat, don't have enough dots, or aren't in the right sets, if all slots are
   * taken by the pre-selected sets
   *
   * @param mods {Array<Mod>}
   * @param target {OptimizationPlan}
   * @param modSlotsOpen {Integer}
   * @returns {Array<Mod>}
   */
  function filterOutUnusableMods(mods, target, modSlotsOpen, minimumDots) {
    const modsInSets = modSlotsOpen > 0 ?
      mods :
      mods.filter(mod => Object.keys(target.setRestrictions).includes(mod.set.name))

    const modsWithPrimaries = modsInSets.filter(mod =>
      !target.primaryStatRestrictions[mod.slot] ||
      mod.primaryStat.type === target.primaryStatRestrictions[mod.slot]
    )

    return modsWithPrimaries.filter(mod => mod.pips >= minimumDots)
  }

  /**
   * Iterate over groups of mods, breaking them into sub-groups that satisfy the target stats
   *
   * @param modGroup {Array<[Mods, SetRestrictions]>} A set of mods and set restrictions that satisfy all target stats
   *                                                  so far.
   * @param targetStats {Array<TargetStat>} The target stats that still have to be processed
   * @param topLevel {Boolean} An indicator if this is the first level of mod break-down (for progress reporting)
   * @returns {Array<Array<Mod>,Object<String, Number>>} An array of potential mods that could be used to create a set
   *                                                     that fulfills the target stat as [mods, setRestriction]
   */
  function* targetStatRecursor(modGroup, targetStats, topLevel) {
    if (0 === targetStats.length) {
      if (6 > modGroup[0].length) {
        // If we don't have enough mods to fill out a set, don't even both checking
        return;
      } else {
        yield modGroup;
      }
    } else {
      const updatedTargetStats = targetStats.slice(0);
      const currentTarget = updatedTargetStats.pop();
      const [mods, setRestrictions] = modGroup;
      const setValue = setValues[currentTarget.stat];

      progressMessage(character, 'Step 2/2: Calculating mod sets to meet target value', 0);

      // Find any collection of values that will sum up to the target stat
      // If there is a setValue, repeat finding mods to fill the target for as many sets as can be used
      if (setValue) {
        // Also check to see if any mod set a) provides a value for the stats and b) can be added to the set restrictions
        const modSlotsOpen = 6 - Object.entries(setRestrictions).filter(([setName, setCount]) => -1 !== setCount).reduce(
          (filledSlots, [setName, setCount]) => filledSlots + setBonuses[setName].numberOfModsRequired * setCount, 0
        );

        const minSets = setRestrictions[setValue.set.name] || 0;
        const maxSets = (setRestrictions[setValue.set.name] || 0) +
          Math.floor(modSlotsOpen / setValue.set.numberOfModsRequired)

        const numConfigurations = Object.values(modConfigurationsByStat[currentTarget.stat])
          .reduce((totalConfigurations, configuration) => totalConfigurations + configuration.length, 0);
        const onePercent = Math.floor(numConfigurations / 100);
        let currentIteration = 0;

        for (let numSetsUsed = minSets; numSetsUsed <= maxSets; numSetsUsed++) {
          const updatedSetRestriction = Object.assign({}, setRestrictions, {
            // If we want to explicitly avoid a set, use a value of -1
            [setValue.set.name]: numSetsUsed === 0 ? -1 : numSetsUsed
          });

          const potentialModValues = modConfigurationsByStat[currentTarget.stat][numSetsUsed];

          // Filter out mods into only those that have those values
          for (let potentialModValuesObject of potentialModValues) {
            const modsThatFitGivenValues = [];

            mods.forEach(mod => {
              if (modValues[currentTarget.stat][mod.id] === potentialModValuesObject[mod.slot]) {
                modsThatFitGivenValues.push(mod);
              }
            });

            // Send progress messages as we iterate over the possible values
            if (++currentIteration % onePercent === 0) {
              const progressPercent = (currentIteration / numConfigurations) * 100;
              progressMessage(character, 'Step 2/2: Calculating mod sets to meet target value', progressPercent);
            }

            yield* targetStatRecursor([modsThatFitGivenValues, updatedSetRestriction], updatedTargetStats, false);
          }
        }
      } else {
        const potentialModValues = modConfigurationsByStat[currentTarget.stat][0];
        const numConfigurations = potentialModValues.length;
        const onePercent = Math.floor(numConfigurations / 100);
        let currentIteration = 0;

        // Filter out mods into only those that have those values
        for (let potentialModValuesObject of potentialModValues) {
          const modsThatFitGivenValues = [];

          mods.forEach(mod => {
            if (modValues[currentTarget.stat][mod.id] === potentialModValuesObject[mod.slot]) {
              modsThatFitGivenValues.push(mod);
            }
          });

          // Send progress messages as we iterate over the possible values
          if (currentIteration++ % onePercent === 0) {
            const progressPercent = (currentIteration / numConfigurations) * 100;
            progressMessage(character, 'Step 2/2: Calculating mod sets to meet target value', progressPercent);
          }

          yield* targetStatRecursor([modsThatFitGivenValues, setRestrictions], updatedTargetStats, false);
        }
      }
    }
  }

  yield* targetStatRecursor([allMods, setRestrictions], targetStats, true);
}

/**
 * Given a character and a list of stats, return an object with the character's value for that stat from level, stars,
 * and gear.
 *
 * @param character {Character}
 * @param stats {Array<Stat>}
 */
function getStatValuesForCharacter(character, stats) {
  const characterValues = {};
  stats.forEach(stat => {
    const characterStatProperties = statTypeMap[stat];
    if (stat === "Health+Protection") {
      throw new Error(
        "Cannot optimize Health+Protection. Use as Report Only."
      );
    } else if (1 < characterStatProperties.length) {
      throw new Error(
        "Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special."
      );
    } else {
      characterValues[stat] =
        character.playerValues.equippedStats[characterStatProperties[0]] || 0;
    }
  })

  return characterValues;
}

/**
 * Find all the set bonuses that provide value to the given stats
 *
 * @param stats {Array<String>}
 * @param character {Character}
 * @param setRestrictions {Object<String, Integer>} An object that maps set names to how many of that set must be used.
 *
 * @returns {Object<String, Object>} A map from stat name to an object showing the set and its value
 */
function getSetBonusesThatHaveValueForStats(stats, character, setRestrictions) {
  const setValues = {};

  // Figure out any sets that are valuable towards each stat
  for (let setBonus of Object.values(setBonuses)) {
    // Don't use any sets that are restricted
    if (-1 == setRestrictions[setBonus.name]) {
      continue;
    }

    // TODO: Eventually support non-max bonuses
    const setStats = flattenStatValues(setBonus.maxBonus, character);

    stats.forEach(stat => {
      // This works on the assumption that only one mod set could ever fill a given stat
      const valuableStat = setStats.find(setStat => setStat.displayType === stat);

      if (valuableStat) {
        // If the set is one that uses only whole-number values, then take the floor
        // of the stat to get its real value
        const workingValue = ['health', 'defense', 'offense', 'speed'].includes(setBonus.name) ?
          Math.floor(valuableStat.value) :
          valuableStat.value;

        setValues[stat] = {
          'set': setBonus,
          'value': workingValue
        };
      }
    });
  }

  return setValues;
}

/**
 * For a list of mods, create two objects: The first will map stat names to mod ID => value for that stat. The second
 * will map stat names to slot => Set(values), collecting the unique values of all mods for that stat
 *
 * @param mods {Array<Mod>}
 * @param stats {Array<String>}
 *
 * @returns {Array<Object>} [{statName: {modID => value}}, {statName: {slot => Set(values)}}]
 */
function collectModValuesBySlot(mods, stats) {
  const modValues = {}
    , valuesBySlot = {};

  // Initialize the sub-objects in each of the above
  stats.forEach(stat => {
    const slotValuesForTarget = {};
    modSlots.forEach(slot => {
      slotValuesForTarget[slot] = new Set([0]);
    });
    valuesBySlot[stat] = slotValuesForTarget;
    modValues[stat] = {};
  });

  // Iterate through all the mods, filling out the objects as we go
  mods.forEach(mod => {
    const modSummary = cache.modStats[mod.id];
    const combinedModSummary = {};
    modSummary.forEach(stat => {
      const oldStat = combinedModSummary[stat.displayType];
      if (oldStat) {
        combinedModSummary[stat.displayType] = {
          displayType: stat.displayType,
          isPercent: stat.isPercent,
          value: oldStat.value + stat.value
        };
      } else {
        combinedModSummary[stat.displayType] = stat
      }
    });

    stats.forEach(stat => {
      const statForTarget = combinedModSummary[stat];
      const statValue = statForTarget ? statForTarget.value : 0;

      modValues[stat][mod.id] = statValue;
      valuesBySlot[stat][mod.slot].add(statValue);
    });
  });

  return [modValues, valuesBySlot];
}

/**
 * Given a set of potential values in each slot, find every combination of values that fits the target criteria
 *
 * @param valuesBySlot {Object<String, Set<Number>>}
 * @param targetMin {number}
 * @param targetMax {number}
 * @param progressMin {Number} How far along the overall process is before starting this funciton
 * @param progressMax {Number} How far along the overall process will be after this function completes
 * @param character {Character} The character the values are being calculated for
 * @returns {{square: number, diamond: number, arrow: number, cross: number, circle: number, triangle: number}[]}
 */
function findStatValuesThatMeetTarget(valuesBySlot, targetMin, targetMax, progressMin, progressMax, character) {
  const onePercent = Math.floor((
    valuesBySlot['square'].size *
    valuesBySlot['arrow'].size *
    valuesBySlot['diamond'].size *
    valuesBySlot['triangle'].size *
    valuesBySlot['circle'].size *
    valuesBySlot['cross'].size) /
    (progressMax - progressMin));
  let iterations = 0;

  progressMessage(character, 'Step 1/2: Finding stat values to meet targets', progressMin);

  // This is essentially a fancy nested for loop iterating over each value in each slot.
  // That means this is O(n^6) for 6 mod slots (which is terrible!).
  function* slotRecursor(slots, valuesObject) {
    if (slots.length) {
      const slotsCopy = slots.slice(0);
      const currentSlot = slotsCopy.shift();
      for (let slotValue of valuesBySlot[currentSlot]) {
        yield* slotRecursor(slotsCopy, Object.assign({}, valuesObject, { [currentSlot]: slotValue }));
      }
    } else {
      if (iterations++ % onePercent === 0) {
        progressMessage(character, 'Step 1/2: Finding stat values to meet targets', progressMin + iterations / onePercent);
      }

      const statValue = Object.values(valuesObject).reduce((acc, value) => acc + value, 0);
      if (statValue >= targetMin && statValue <= targetMax) {
        yield valuesObject;
      }
    }
  }

  return Array.from(slotRecursor(modSlots, {}));
}

function findBestModSetFromPotentialMods(potentialModSets, character, target) {
  let bestModSetAndMessages = { modSet: [], messages: [] }
    , bestSetScore = -Infinity
    , bestUnmovedMods = 0;

  function updateBestSet(setAndMessages, score, unmovedMods) {
    bestModSetAndMessages = setAndMessages;
    bestSetScore = score;
    bestUnmovedMods = unmovedMods;
  }

  for (let [mods, candidateSetRestrictions] of potentialModSets) {
    const setAndMessages =
      findBestModSetWithoutChangingRestrictions(mods, character, target, candidateSetRestrictions);
    if (setAndMessages.modSet) {
      const setScore = scoreModSet(setAndMessages.modSet, character, target);

      // If this set of mods couldn't fulfill all of the character restrictions, then it can only be used if
      // we don't already have a set of mods that does
      if (
        !modSetSatisfiesCharacterRestrictions(setAndMessages.modSet, character, target) &&
        bestModSetAndMessages &&
        modSetSatisfiesCharacterRestrictions(bestModSetAndMessages.modSet, character, target)
      ) {
        continue;
      }

      // We'll accept a new set if it is better than the existing set OR if the existing set doesn't fulfill all of the
      // restrictions and the new set does
      if (setScore > bestSetScore ||
        (setScore > 0 &&
          !modSetSatisfiesCharacterRestrictions(bestModSetAndMessages.modSet, character, target) &&
          modSetSatisfiesCharacterRestrictions(setAndMessages.modSet, character, target)
        )
      ) {
        updateBestSet(setAndMessages, setScore, null);
      } else if (setScore === bestSetScore) {
        // If both sets have the same value, choose the set that moves the fewest mods
        const unmovedMods = setAndMessages.modSet.filter(mod => mod.characterID === character.baseID).length;
        if (null === bestUnmovedMods) {
          bestUnmovedMods = bestModSetAndMessages.modSet.filter(mod => mod.characterID === character.baseID).length;
        }

        if (unmovedMods > bestUnmovedMods) {
          updateBestSet(setAndMessages, setScore, unmovedMods);
        } else if (
          unmovedMods === bestUnmovedMods &&
          setAndMessages.modSet.length > bestModSetAndMessages.modSet.length
        ) {
          // If both sets move the same number of unmoved mods, choose the set that uses the most mods overall
          updateBestSet(setAndMessages, setScore, unmovedMods);
        }
      }
    }
  }

  return bestModSetAndMessages;
}

/**
 * Figure out what the best set of mods for a character are such that the values in the plan are optimized. Try to
 * satisfy the set restrictions given, but loosen them if no mod set can be found that uses them as-is.
 *
 * @param usableMods {Array<Mod>} The set of mods that is available to be used for this character
 * @param character {Character} A Character object that represents all of the base stats required for percentage
 *                              calculations as well as the optimization plan to use
 * @param target {OptimizationPlan} The optimization plan to use as the basis for the best mod set
 * @param setRestrictions {Object<String, Number>} An object with the number of each set to use
 * @returns {{messages: Array<String>, modSet: Array<Mod>}}
 */
function findBestModSetByLooseningSetRestrictions(usableMods, character, target, setRestrictions) {
  // Get a list of the restrictions to iterate over for this character, in order of most restrictive (exactly what was
  // selected) to least restrictive (the last entry will always be no restrictions).
  const possibleRestrictions = loosenRestrictions(setRestrictions);

  // Try to find a mod set using each set of restrictions until one is found
  for (let i = 0; i < possibleRestrictions.length; i++) {
    const { restriction, messages: restrictionMessages } = possibleRestrictions[i];

    // Filter the usable mods based on the given restrictions
    const restrictedMods = restrictMods(usableMods, restriction);

    // Try to optimize using this set of mods
    let { modSet: bestModSet, messages: setMessages } =
      findBestModSetWithoutChangingRestrictions(restrictedMods, character, target, restriction);

    if (bestModSet) {
      return {
        modSet: bestModSet,
        messages: restrictionMessages.concat(setMessages)
      };
    }
  }

  return {
    modSet: [],
    messages: [`No mod sets could be found for ${character.baseID}`]
  }
}

/**
 * Find the best configuration of mods from a set of usable mods
 * @param usableMods {Array<Mod>}
 * @param character {Character}
 * @param target {OptimizationPlan}
 * @param setsToUse {Object<String, Number>} The sets to use for this mod set. This function will return null if
 *   these sets can't be used.
 * @returns {{messages: Array<String>, modSet: Array<Mod>}}
 */
function findBestModSetWithoutChangingRestrictions(usableMods, character, target, setsToUse) {
  const potentialUsedSets = new Set();
  const baseSets = {};
  const messages = [];
  let squares, arrows, diamonds, triangles, circles, crosses;
  let setlessMods;
  let subMessages;

  // Sort all the mods by score, then break them into sets.
  // For each slot, try to use the most restrictions possible from what has been set for that character
  usableMods.sort(modSort(character));

  ({ mods: squares, messages: subMessages } = filterMods(
    usableMods,
    'square',
    character.optimizerSettings.minimumModDots,
    target.primaryStatRestrictions.square
  ));
  messages.push(...subMessages);
  ({ mods: arrows, messages: subMessages } = filterMods(
    usableMods,
    'arrow',
    character.optimizerSettings.minimumModDots,
    target.primaryStatRestrictions.arrow
  ));
  messages.push(...subMessages);
  ({ mods: diamonds, messages: subMessages } = filterMods(
    usableMods,
    'diamond',
    character.optimizerSettings.minimumModDots,
    target.primaryStatRestrictions.diamond
  ));
  messages.push(...subMessages);
  ({ mods: triangles, messages: subMessages } = filterMods(
    usableMods,
    'triangle',
    character.optimizerSettings.minimumModDots,
    target.primaryStatRestrictions.triangle
  ));
  messages.push(...subMessages);
  ({ mods: circles, messages: subMessages } = filterMods(
    usableMods,
    'circle',
    character.optimizerSettings.minimumModDots,
    target.primaryStatRestrictions.circle
  ));
  messages.push(...subMessages);
  ({ mods: crosses, messages: subMessages } = filterMods(
    usableMods,
    'cross',
    character.optimizerSettings.minimumModDots,
    target.primaryStatRestrictions.cross
  ));
  messages.push(...subMessages);

  if (
    squares.length === 1 &&
    arrows.length === 1 &&
    diamonds.length === 1 &&
    triangles.length === 1 &&
    circles.length === 1 &&
    crosses.length === 1
  ) {
    const modSet = [squares[0], arrows[0], diamonds[0], triangles[0], circles[0], crosses[0]];
    if (modSetFulfillsSetRestriction(modSet, setsToUse)) {
      return { modSet: modSet, messages: messages };
    } else {
      return { modSet: null, messages: [] };
    }
  }

  /**
   * Given a sorted array of mods, return either the first mod (if it has a non-negative score) or null. This allows
   * for empty slots on characters where the mods might be better used elsewhere.
   * @param candidates Array[Mod]
   * @returns Mod
   */
  const topMod = (candidates) => {
    const mod = firstOrNull(candidates);
    if (mod && cache.modScores[mod.id] >= 0) {
      return mod;
    } else {
      return null;
    }
  };

  const usedSets = Object.entries(setsToUse)
    .filter(([setName, count]) => count > 0).map(([setName]) => setName);

  const modSlotsOpen = 6 - Object.entries(setsToUse).filter(([setName, setCount]) => -1 !== setCount).reduce(
    (filledSlots, [setName, setCount]) => filledSlots + setBonuses[setName].numberOfModsRequired * setCount, 0
  );

  if (0 === modSlotsOpen) {
    // If sets are 100% deterministic, make potentialUsedSets only them
    for (let setName of usedSets) {
      const setBonus = setBonuses[setName];
      potentialUsedSets.add(setBonus);
    }
    setlessMods = null;
  } else if (target.useOnlyFullSets) {
    // If we're only allowed to use full sets, then add every set to potentialUsedSets, but leave setlessMods null
    for (let setName in setBonuses) {
      const setBonus = setBonuses[setName];
      potentialUsedSets.add(setBonus);
    }
    setlessMods = null;
  } else {
    // Otherwise, use any set bonus with positive value that fits into the set restriction
    for (let setBonus of Object.values(setBonuses)) {
      if (setBonus.numberOfModsRequired <= modSlotsOpen &&
        scoreStat(setBonus.maxBonus, target) > 0
      ) {
        potentialUsedSets.add(setBonus);
      }
    }

    // Still make sure that any chosen sets are in the potential used sets
    for (let setName of usedSets) {
      potentialUsedSets.add(setBonuses[setName]);
    }

    // Start with the highest-value mod in each slot. If the highest-value mod has a negative value,
    // leave the slot empty
    setlessMods = {
      square: topMod(squares),
      arrow: topMod(arrows),
      diamond: topMod(diamonds),
      triangle: topMod(triangles),
      circle: topMod(circles),
      cross: topMod(crosses)
    }
  }

  // Go through each set bonus with a positive value, and find the best mod sub-sets
  for (let setBonus of potentialUsedSets) {
    baseSets[setBonus.name] = {
      square: firstOrNull(squares.filter(mod => setBonus.name === mod.set.name)),
      arrow: firstOrNull(arrows.filter(mod => setBonus.name === mod.set.name)),
      diamond: firstOrNull(diamonds.filter(mod => setBonus.name === mod.set.name)),
      triangle: firstOrNull(triangles.filter(mod => setBonus.name === mod.set.name)),
      circle: firstOrNull(circles.filter(mod => setBonus.name === mod.set.name)),
      cross: firstOrNull(crosses.filter(mod => setBonus.name === mod.set.name))
    };
  }

  // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set formed
  // without taking sets into account
  const candidateSets = getCandidateSetsGenerator(potentialUsedSets, baseSets, setlessMods, setsToUse);

  let bestModSet = null;
  let bestSetScore = -Infinity;
  let bestUnmovedMods = null;

  for (let set of candidateSets) {
    const setScore = scoreModSet(set, character, target);
    if (setScore > bestSetScore) {
      bestModSet = set;
      bestSetScore = setScore;
      bestUnmovedMods = null;
    } else if (setScore === bestSetScore) {
      // If both sets have the same value, choose the set that moves the fewest mods
      const unmovedMods = set.filter(mod => mod.characterID === character.baseID).length;
      if (null === bestUnmovedMods) {
        bestUnmovedMods = bestModSet.filter(mod => mod.characterID === character.baseID).length;
      }

      if (unmovedMods > bestUnmovedMods) {
        bestModSet = set;
        bestSetScore = setScore;
        bestUnmovedMods = unmovedMods;
      } else if (unmovedMods === bestUnmovedMods && set.length > bestModSet.length) {
        // If both sets move the same number of unmoved mods, choose the set that uses the most mods overall
        bestModSet = set;
        bestSetScore = setScore;
        bestUnmovedMods = unmovedMods;
      }
    }
  }

  return {
    modSet: bestModSet,
    messages: messages
  };
}

/**
 * Find all the potential combinations of mods to consider by taking into account mod sets and keeping set bonuses
 *
 * @param potentialUsedSets {Set<SetBonus>} The SetBonuses that have sets provided for use
 * @param baseSets {Object<String, Object<String, Mod>>} The best mods available for each SetBonus in potentialUsedSets
 * @param setlessMods {Object<string, Mod>} The best raw mod for each slot, regardless of set
 * @param setsToUse {Object<String, Number>} The sets to fulfill for every candidate set
 * @return {Array<Array<Mod>>}
 */
function* getCandidateSetsGenerator(potentialUsedSets, baseSets, setlessMods, setsToUse) {
  /**
   * Possible sets:
   *
   * base set
   *
   * 4-mod sets
   * Set(4) + base set
   * Set(4) + Set(2)
   *
   * 2-mod sets
   * Set(2) + base set
   * Set(2 * 2) + base set
   * Set(2 * 3)
   * Set(2) + Set(2) + base set
   * Set(2 * 2) + Set(2)
   * Set(2) + Set(2) + Set(2)
   */
  const potentialSetsArray = Array.from(potentialUsedSets.values());
  const fourModSets = potentialSetsArray
    .filter(modSet => 4 === modSet.numberOfModsRequired)
    .map(set => set.name);
  const twoModSets = potentialSetsArray
    .filter(modSet => 2 === modSet.numberOfModsRequired)
    .map(set => set.name);
  const forcedSets = { 4: [], 2: [] };
  for (let setName in setsToUse) {
    for (let i = 0; i < setsToUse[setName]; i++) {
      forcedSets[setBonuses[setName].numberOfModsRequired].push(setName);
    }
  }
  Object.freeze(forcedSets);
  const setObject = {};

  /**
   * Convert nextSetObject from Object(slot: mod) format to Array<Mod> format, storing the result in nextSet
   */
  function setObjectToArray() {
    const modArray = [];
    for (let slot of modSlots) {
      if (setObject[slot]) {
        modArray.push(setObject[slot]);
      }
    }

    return modArray;
  }

  /**
   * Combine up to 3 sets of mods in every way possible that maintains set bonuses, running each combination through a
   * check function. In order to do this simply, the first set given is assumed to require 4 mods if only 2 sets are
   * given, and 2 mods if 3 are given. All other sets are assumed to require 2 mods.
   * @param firstSet {Object<String, Mod>}
   * @param secondSet {Object<String, Mod>}
   * @param thirdSet {Object<String, Mod>}
   * @param allowFirstSetNulls {boolean} Whether to allow null values in the first set
   * @param allowSecondSetNulls {boolean} Whether to allow null values in the second set
   */
  function* combineSetsGenerator(firstSet,
    secondSet,
    thirdSet,
    allowFirstSetNulls = false,
    allowSecondSetNulls = false
  ) {
    if (!firstSet || !secondSet) {
      return;
    }
    if (!thirdSet) {
      generateSets:
      for (let [firstSetSlots, secondSetSlots] of chooseFourOptions) {
        for (let slot of firstSetSlots) {
          if (!allowFirstSetNulls && null === firstSet[slot]) {
            continue generateSets;
          }
          setObject[slot] = firstSet[slot];
        }
        for (let slot of secondSetSlots) {
          if (!allowSecondSetNulls && null === secondSet[slot]) {
            continue generateSets;
          }
          setObject[slot] = secondSet[slot];
        }
        yield setObjectToArray();
      }
    } else {
      generateSets:
      for (let [firstSetSlots, secondSetSlots, thirdSetSlots] of chooseTwoOptions) {
        for (let slot of firstSetSlots) {
          if (!allowFirstSetNulls && null === firstSet[slot]) {
            continue generateSets;
          }
          setObject[slot] = firstSet[slot];
        }
        for (let slot of secondSetSlots) {
          if (!allowSecondSetNulls && null === secondSet[slot]) {
            continue generateSets;
          }
          setObject[slot] = secondSet[slot];
        }
        for (let slot of thirdSetSlots) {
          if (null === thirdSet[slot]) {
            continue generateSets;
          }
          setObject[slot] = thirdSet[slot];
        }
        yield setObjectToArray();
      }
    }
  }

  let firstSet, secondSet, thirdSet;

  // If there's a forced 4-mod set
  if (forcedSets[4].length > 0) {
    firstSet = baseSets[forcedSets[4][0]];

    if (forcedSets[2].length > 0) {
      // Every set is completely deterministic. Combine the first and second sets in every way possible
      secondSet = baseSets[forcedSets[2][0]];
      yield* combineSetsGenerator(firstSet, secondSet);
    } else {
      // The sets aren't completely deterministic. We need to check...
      // The four-mod set plus setless mods
      yield* combineSetsGenerator(firstSet, setlessMods, null, false, true);

      // The four-mod set plus any two-mod sets with value
      for (let secondSetType of twoModSets) {
        secondSet = baseSets[secondSetType];
        yield* combineSetsGenerator(firstSet, secondSet);
      }
    }
  } else if (1 === forcedSets[2].length) {
    // If there's exactly one forced 2-mod set, there should be 4 slots open
    firstSet = baseSets[forcedSets[2][0]];

    // The two-mod set plus setless mods
    yield* combineSetsGenerator(setlessMods, firstSet, null, true);

    // The two-mod set plus any two two-mod sets with value
    for (let i = 0; i < twoModSets.length; i++) {
      secondSet = baseSets[twoModSets[i]];

      // The forced set plus the second set plus setless mods
      yield* combineSetsGenerator(setlessMods, firstSet, secondSet, true);

      for (let j = i; j < twoModSets.length; j++) {
        thirdSet = baseSets[twoModSets[j]];

        // The forced set plus the two other sets
        yield* combineSetsGenerator(firstSet, secondSet, thirdSet);
      }
    }
  } else if (2 === forcedSets[2].length) {
    // With 2 forced 2-mod sets, there should be 2 slots open
    firstSet = baseSets[forcedSets[2][0]];
    secondSet = baseSets[forcedSets[2][1]];

    // The two sets plus setless mods
    yield* combineSetsGenerator(setlessMods, firstSet, secondSet, true);

    // The two sets plus any two-mod sets with value
    for (let thirdSetType of twoModSets) {
      thirdSet = baseSets[thirdSetType];
      yield* combineSetsGenerator(firstSet, secondSet, thirdSet);
    }
  } else if (3 === forcedSets[2].length) {
    // Every set is deterministic
    firstSet = baseSets[forcedSets[2][0]];
    secondSet = baseSets[forcedSets[2][1]];
    thirdSet = baseSets[forcedSets[2][2]];
    yield* combineSetsGenerator(firstSet, secondSet, thirdSet);
  } else {
    // If no sets are forced, we can check every possible combination
    // The base set
    if (setlessMods) {
      for (let slot of modSlots) {
        setObject[slot] = setlessMods[slot];
      }
      yield setObjectToArray();
    }

    for (let firstSetType of fourModSets) {
      let firstSet = baseSets[firstSetType];

      // the whole set plus setless mods
      yield* combineSetsGenerator(firstSet, setlessMods, null, false, true);

      // the whole set plus any 2-mod set
      for (let secondSetType of twoModSets) {
        let secondSet = baseSets[secondSetType];
        yield* combineSetsGenerator(firstSet, secondSet);
      }
    }

    for (let i = 0; i < twoModSets.length; i++) {
      let firstSet = baseSets[twoModSets[i]];

      // the whole set plus setless mods
      yield* combineSetsGenerator(setlessMods, firstSet, null, true);

      // the whole set plus a set of 4 from any 2-mod sets and the base set
      for (let j = i; j < twoModSets.length; j++) {
        let secondSet = baseSets[twoModSets[j]];

        // the first set plus the second set plus setless mods
        yield* combineSetsGenerator(setlessMods, firstSet, secondSet, true);

        // the first set plus the second set plus another set
        for (let k = j; k < twoModSets.length; k++) {
          let thirdSet = baseSets[twoModSets[k]];

          yield* combineSetsGenerator(firstSet, secondSet, thirdSet);
        }
      }
    }
  }
}
