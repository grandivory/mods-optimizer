// @flow
self.onmessage = function(message) {

  clearCache();
  const optimizedModsByCharacter = optimizeMods(
    message.data.mods,
    message.data.characters,
    message.data.order,
    message.data.threshold,
    message.data.previousRun
  );

  optimizationSuccessMessage(optimizedModsByCharacter);
  self.close();
};

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
  'Physical Critical Chance': ['critChance'], // read critChance from OptimizationPlan - this is used for scoring
  'Special Critical Chance': ['specCritChance'],
  'Defense': ['armor', 'resistance'],
  'Armor': ['armor'],
  'Resistance': ['resistance'],
  'Accuracy': ['accuracy'],
  'Critical Avoidance': ['critAvoid']
});

const statDisplayNames = {
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
};

const wholeStatTypes = ['Health',
  'Protection',
  'Offense',
  'Physical Damage',
  'Special Damage',
  'Speed',
  'Defense',
  'Armor',
  'Resistance'];

const modSlots = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

const setBonuses = {
  'health': {
    name: 'health',
    numberOfModsRequired: 2,
    smallBonus: {displayType: 'Health', value: 5, isPercent: true},
    maxBonus: {displayType: 'Health', value: 10, isPercent: true}
  },
  'defense': {
    name: 'defense',
    numberOfModsRequired: 2,
    smallBonus: {displayType: 'Defense', value: 12.5, isPercent: true},
    maxBonus: {displayType: 'Defense', value: 25, isPercent: true}
  },
  'critdamage': {
    name: 'critdamage',
    numberOfModsRequired: 4,
    smallBonus: {displayType: 'Critical Damage', value: 15},
    maxBonus: {displayType: 'Critical Damage', value: 30}
  },
  'critchance': {
    name: 'critchance',
    numberOfModsRequired: 2,
    smallBonus: {displayType: 'Critical Chance', value: 4},
    maxBonus: {displayType: 'Critical Chance', value: 8}
  },
  'tenacity': {
    name: 'tenacity',
    numberOfModsRequired: 2,
    smallBonus: {displayType: 'Tenacity', value: 10},
    maxBonus: {displayType: 'Tenacity', value: 20}
  },
  'offense': {
    name: 'offense',
    numberOfModsRequired: 4,
    smallBonus: {displayType: 'Offense', value: 7.5, isPercent: true},
    maxBonus: {displayType: 'Offense', value: 15, isPercent: true}
  },
  'potency': {
    name: 'potency',
    numberOfModsRequired: 2,
    smallBonus: {displayType: 'Potency', value: 7.5},
    maxBonus: {displayType: 'Potency', value: 15}
  },
  'speed': {
    name: 'speed',
    numberOfModsRequired: 4,
    smallBonus: {displayType: 'Speed', value: 5, isPercent: true},
    maxBonus: {displayType: 'Speed', value: 10, isPercent: true}
  }
};

// Map pips to maximum value at level 15 for each primary stat type
const maxStatPrimaries = {
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
};

statSlicingUpgradeFactors = {
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
};

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
};

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

function optimizationSuccessMessage(modsByCharacter) {
  postMessage({
    type: 'OptimizationSuccess',
    result: modsByCharacter
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

/**
 * Convert a set of mods into an array of absolute stat values that the set provides to a character
 * @param modSet {Array<Mod>}
 * @param character {Character}
 * @returns {{displayType: string, value: number}[]}
 */
function getFlatStatsFromModSet(modSet, character) {
  const statsFromSetBonus = getSetBonusStatsFromModSet(
    modSet,
    character.optimizerSettings.target.upgradeMods
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
 */
function getFlatStatsFromMod(mod, character) {
  const cacheHit = cache.modStats[mod.id];
  if (cacheHit) {
    return cacheHit;
  }

  const flattenedStats = [];
  const workingMod = getUpgradedMod(mod, character);

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

  Object.values(setBonusCounts).forEach(({setBonus, lowCount, highCount}) => {
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
      throw new Error(`Stat is given as a percentage, but ${character.gameSettings.name} has no base stats`);
    }
  });

  cache.statValues[cacheKey] = flattenedStats;
  return flattenedStats;
}

/**
 * Check to see if a set of mods satisfies all the restrictions a character has placed
 * @param modSet {Array<Mod>}
 * @param character {Character}
 */
function modSetSatisfiesCharacterRestrictions(modSet, character) {
  const target = character.optimizerSettings.target;
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
    modSetFulfillsSetRestriction(modSet, target.setRestrictions) &&
    modSetFulfillsTargetStatRestriction(modSet, character);
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
 * @returns {boolean}
 */
function modSetFulfillsTargetStatRestriction(modSet, character) {
  const targetStat = character.optimizerSettings.target.targetStat;

  if (!targetStat) {
    return true;
  }
  if (statTypeMap[targetStat.stat].length > 1) {
    throw new Error(
      "Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special."
    );
  }
  const statProperty = statTypeMap[targetStat.stat][0];
  const baseValue = character.playerValues.equippedStats[statProperty];

  const setStats = getFlatStatsFromModSet(modSet, character);

  const setValue = setStats.reduce((setValueSum, stat) =>
      // Check to see if the stat is the target stat. If it is, add its value to the total.
      stat.displayType === targetStat.stat ? setValueSum + stat.value : setValueSum
    , 0);

  const totalValue = baseValue + setValue;

  return totalValue >= targetStat.minimum && totalValue <= targetStat.maximum;
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
  return 6 === Object.entries(setDefinition).reduce((filledSlots, [setName, setCount]) => {
    return filledSlots + setBonuses[setName].numberOfModsRequired * setCount;
  }, 0);
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
      return {mods: fullyFilteredMods, messages: []};
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
  return {
    mods: slotFilteredMods,
    messages: primaryStat ?
      [`No ${primaryStat} or ${minDots}-dot ${slot} mods were available, so both restrictions were dropped.`] :
      [`No ${minDots}-dot ${slot} mods were available, so the dots restriction was dropped.`]
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
  const targetProperties = 'Critical Chance' === stat.displayType ? ['critChance'] : statTypeMap[stat.displayType];
  return targetProperties.reduce((acc, targetProperty) =>
      target[targetProperty] ? acc + target[targetProperty] * stat.value : acc
    , 0);
}

/**
 * Given a mod and an optimization plan, figure out the value for that mod
 *
 * @param mod Mod
 * @param character Character for whom the mod is being scored
 */
function scoreMod(mod, character) {
  const cacheHit = cache.modScores[mod.id];
  if (cacheHit) {
    return cacheHit;
  }

  const flattenedStatValues = cache.modStats[mod.id];

  const modScore = flattenedStatValues
    .reduce((score, stat) => score + scoreStat(stat, character.optimizerSettings.target), 0);

  cache.modScores[mod.id] = modScore;
  return modScore;
}

/**
 * Get the stats that a mod would have were it upgraded to level 15 and/or sliced to 6E,
 * based on the optimization target of the given character
 * @param mod {Mod}
 * @param character {Character}
 * @returns {Mod}
 */
function getUpgradedMod(mod, character) {
  const cacheHit = cache.modUpgrades[mod.id];
  if (cacheHit) {
    return cacheHit;
  }

  const workingMod = Object.assign({}, mod);

  // Level the mod if the target says to
  if (15 > workingMod.level && character.optimizerSettings.target.upgradeMods) {
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
 */
function scoreModSet(modSet, character) {
  return getFlatStatsFromModSet(modSet, character)
    .reduce((score, stat) => score + scoreStat(stat, character.optimizerSettings.target), 0);
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
  restrictionsArray.forEach(({restriction, messages}) => {
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
 * @param modsList Array[Mod] An array of mods that could potentially be assign to each character
 * @param characters {Object<String, Character>} A set of characters keyed by base ID that might be optimized
 * @param order Array[Character.baseID] The characters to optimize, in order
 * @param changeThreshold {Number} The % value that a new mod set has to improve upon the existing equipped mods
 *                                 before the optimizer will suggest changing it
 * @param previousRun {Object} The settings from the last time the optimizer was run, used to limit expensive
 *                             recalculations for optimizing mods
 * @return {Object<String, ModSet>} An optimized set of mods, keyed by character base ID
 */
function optimizeMods(modsList, characters, order, changeThreshold, previousRun = {}) {
  const assignedSets = {};
  const messages = {};
  const availableMods = modsList.filter(mod =>
    // Use any mod that isn't assigned or that is assigned to a character that isn't locked
    !mod.characterID || !characters[mod.characterID].optimizerSettings.isLocked
  );
  let optimizationChanged = false;

  // For each not-locked character in the list, find the best mod set for that character
  order.forEach((characterID, index) => {
    const character = characters[characterID];
    const previousCharacter = previousRun.characters ? previousRun.characters[characterID] : null;
    // For each character, check if the settings for the previous run were the same, and skip the character if so
    // TODO: Check if new mods exist as well
    if (
      !optimizationChanged &&
      changeThreshold === previousRun.threshold &&
      previousRun.order &&
      characterID === previousRun.order[index] &&
      previousCharacter &&
      previousCharacter.playerValues &&
      areObjectsEquivalent(character.playerValues, previousCharacter.playerValues) &&
      previousCharacter.optimizerSettings &&
      areObjectsEquivalent(
        character.optimizerSettings.target,
        previousCharacter.optimizerSettings.target
      ) &&
      character.optimizerSettings.minimumModDots === previousCharacter.optimizerSettings.minimumModDots &&
      character.optimizerSettings.sliceMods === previousCharacter.optimizerSettings.sliceMods &&
      character.optimizerSettings.isLocked === previousCharacter.optimizerSettings.isLocked
    ) {
      return;
    } else {
      optimizationChanged = true;
    }

    if (character.optimizerSettings.isLocked) {
      return;
    }

    const {modSet: newModSetForCharacter, messages: characterMessages} =
      findBestModSetForCharacter(availableMods, character);

    const oldModSetForCharacter = availableMods.filter(mod => mod.characterID === character.baseID);

    const newModSetValue = scoreModSet(newModSetForCharacter, character);
    const oldModSetValue = scoreModSet(oldModSetForCharacter, character);

    // Assign the new mod set if any of the following are true:
    let assignedModSet, assignmentMessages = [];
    if (
      // Treat a threshold of 0 as "always change", so long as the new mod set is better than the old at all
      (changeThreshold === 0 && newModSetValue >= oldModSetValue) ||
      // If the new set is the same mods as the old set
      (newModSetForCharacter.length === oldModSetForCharacter.length &&
        oldModSetForCharacter.every(oldMod => newModSetForCharacter.find(newMod => newMod.id === oldMod.id))
      ) ||
      // If the old set doesn't satisfy the character/target restrictions, but the new set does
      (!modSetSatisfiesCharacterRestrictions(oldModSetForCharacter, character) &&
        modSetSatisfiesCharacterRestrictions(newModSetForCharacter, character)
      ) ||
      // If the new set is better than the old set
      (newModSetValue / oldModSetValue) * 100 - 100 > changeThreshold ||
      // If the old set now has less than 6 mods and the new set has more mods
      (oldModSetForCharacter.length < 6 &&
        newModSetForCharacter.length > oldModSetForCharacter.length)
    ) {
      assignedModSet = newModSetForCharacter;
      assignmentMessages = characterMessages;
    } else {
      assignedModSet = oldModSetForCharacter;
      if (!modSetSatisfiesCharacterRestrictions(newModSetForCharacter, character)) {
        assignmentMessages.push(
          'Could not find a new mod set that satisfies the given restrictions. Leaving the old mods equipped.'
        )
      }
    }

    assignedSets[characterID] = assignedModSet.map(mod => mod.id);
    if (assignmentMessages.length) {
      messages[characterID] = assignmentMessages;
    }
    // Remove any assigned mods from the available pool
    for (let i = availableMods.length - 1; i >= 0; i--) {
      if (assignedModSet.includes(availableMods[i])) {
        availableMods.splice(i, 1);
      }
    }
  });

  // Delete any cache that we had saved
  clearCache();

  return {
    assignedSets: assignedSets,
    messages: messages
  };
}

/**
 * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
 * such that the values in the plan are optimized.
 *
 * @param mods The set of mods that is available to be used for this character
 * @param character A Character object that represents all of the base stats required for percentage calculations as
 *                  well as the optimization plan to use
 * @returns {{messages: Array<String>, modSet: Array<Mod>}}
 */
function findBestModSetForCharacter(mods, character) {
  const usableMods = character.playerValues.gearLevel < 12 ? mods.filter(mod => 6 > mod.pips) : mods;
  const setRestrictions = character.optimizerSettings.target.setRestrictions;
  const targetStat = character.optimizerSettings.target.targetStat;
  // Clear the cache at the start of each character
  clearCache();

  // Get the flattened stats and score every mod for this character. From that point on, only look at the cache
  // for the rest of the time processing mods for this character.
  usableMods.forEach(mod => {
    getFlatStatsFromMod(mod, character);
    scoreMod(mod, character);
  });

  // First, check to see if there is any target stat
  if (targetStat) {
    let bestModSetAndMessages = null;
    let bestSetScore = -Infinity;
    let bestUnmovedMods = null;

    // If so, create an array of potential mod sets that could fill it
    progressMessage(character, 'Calculating sets to meet target value', 0);
    const potentialModSets = getPotentialModsToSatisfyTargetStat(usableMods, character);

    for (let [mods, candidateSetRestrictions] of potentialModSets) {
      const setAndMessages = findBestModSetWithoutChangingRestrictions(mods, character, candidateSetRestrictions);
      if (setAndMessages.modSet) {
        const setScore = scoreModSet(setAndMessages.modSet, character);
        if (setScore > bestSetScore) {
          bestModSetAndMessages = setAndMessages;
          bestSetScore = setScore;
          bestUnmovedMods = null;
        } else if (setScore === bestSetScore) {
          // If both sets have the same value, choose the set that moves the fewest mods
          const unmovedMods = setAndMessages.modSet.filter(mod => mod.characterID === character.baseID).length;
          if (null === bestUnmovedMods) {
            bestUnmovedMods = bestModSetAndMessages.modSet.filter(mod => mod.characterID === character.baseID).length;
          }

          if (unmovedMods > bestUnmovedMods) {
            bestModSetAndMessages = setAndMessages;
            bestSetScore = setScore;
            bestUnmovedMods = unmovedMods;
          } else if (
            unmovedMods === bestUnmovedMods &&
            setAndMessages.modSet.length > bestModSetAndMessages.modSet.length
          ) {
            // If both sets move the same number of unmoved mods, choose the set that uses the most mods overall
            bestModSetAndMessages = setAndMessages;
            bestSetScore = setScore;
            bestUnmovedMods = unmovedMods;
          }
        }
      }
    }

    if (!bestModSetAndMessages.modSet) {
      const {modSet: fallbackSet, messages: fallbackMessages} =
        findBestModSetByLooseningSetRestrictions(usableMods, character, setRestrictions);
      return {
        modSet: fallbackSet,
        messages: ['Could not fill the target stat as given, so the target stat restriction was dropped']
          .concat(fallbackMessages)
      };
    }

    // Return the best set and set of messages
    return bestModSetAndMessages;
  } else {
    // If not, simply iterate over all levels of restrictions until a suitable set is found.
    progressMessage(character, 'Finding the best mod set');
    return findBestModSetByLooseningSetRestrictions(usableMods, character, setRestrictions);
  }
}

/**
 * Given a set of mods and a target stat, get all of the
 * @param usableMods {Array<Mod>}
 * @param character {Character}
 * @returns {Array<Array<Mod>,Object<String, Number>>} An array of potential mods that could be used to create a set
 *   that fulfills the target stat as [mods, setRestriction]
 */
function* getPotentialModsToSatisfyTargetStat(usableMods, character) {
  //TODO: Send progressMessages as we go from here, because we can no longer count the total number of combinations
  // to check completeness
  const setRestrictions = character.optimizerSettings.target.setRestrictions;
  const targetStat = character.optimizerSettings.target.targetStat;
  // A map from mod ID to the absolute value that mod provides for the target stat
  const modValues = {};
  let setValue = null;

  // First, get the base value of the stat on the character so it can be subtracted
  // from what's needed for the min and max
  const characterStatProperties = statTypeMap[targetStat.stat];
  if (1 < characterStatProperties.length) {
    throw new Error(
      "Trying to set an ambiguous target stat. Offense, Crit Chance, etc. need to be broken into physical or special."
    );
  }
  const characterValue = character.playerValues.equippedStats[characterStatProperties[0]] || 0;

  // Get the raw value for the stat from each mod in the set, and collect them into slots
  const valuesBySlot = {};
  modSlots.forEach(slot => valuesBySlot[slot] = new Set([0]));
  usableMods.forEach(mod => {
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

    const statForTarget = combinedModSummary[targetStat.stat];
    const statValue = statForTarget ? statForTarget.value : 0;

    modValues[mod.id] = statValue;
    valuesBySlot[mod.slot].add(statValue);
  });

  // Also check to see if any mod set a) provides a value for the stat and b) can be added to the set restrictions
  const modSlotsOpen = 6 - Object.entries(setRestrictions).reduce(
    (filledSlots, [setName, setCount]) => filledSlots + setBonuses[setName].numberOfModsRequired * setCount, 0
  );
  for (let setBonus of Object.values(setBonuses)) {
    // TODO: Eventually support non-max bonuses
    const setStats = flattenStatValues(setBonus.maxBonus, character);

    // This works on the assumption that only one mod set could ever fill a given stat
    const valuableStat = setStats.find(stat => stat.displayType === targetStat.stat);

    if (valuableStat) {
      setValue = {
        'set': setBonus,
        'value': valuableStat.value,
        'min': setRestrictions[setBonus.name] || 0,
        'max': (setRestrictions[setBonus.name] || 0) + Math.floor(modSlotsOpen / setBonus.numberOfModsRequired)
      };
      break;
    }
  }

  // Find any collection of values that will sum up to the target stat
  // If there is a setValue, repeat finding mods to fill the target for as many sets as can be used
  if (setValue) {
    const numIterations = setValue.max - setValue.min + 1;
    for (let numSetsUsed = setValue.min; numSetsUsed <= setValue.max; numSetsUsed++) {
      const iterationProgressStart = (numSetsUsed - setValue.min) * 100 / numIterations;
      const iterationProgressEnd = (numSetsUsed + 1 - setValue.min) * 100 / numIterations;

      const updatedSetRestriction = Object.assign({}, setRestrictions, {
        // If we want to explicitly avoid a set, use a value of -1
        [setValue.set.name]: numSetsUsed === 0 ? -1 : numSetsUsed
      });

      const nonModValue = characterValue + setValue.value * numSetsUsed;
      const potentialModValues = findStatValuesThatMeetTarget(
        valuesBySlot,
        targetStat.minimum - nonModValue,
        targetStat.maximum - nonModValue,
        iterationProgressStart,
        iterationProgressEnd,
        character
      );

      // Filter out mods into only those that have those values
      for (let potentialModValuesObject of potentialModValues) {
        const modsThatFitGivenValues = [];

        usableMods.forEach(mod => {
          if (modValues[mod.id] === potentialModValuesObject[mod.slot]) {
            modsThatFitGivenValues.push(mod);
          }
        });

        yield [modsThatFitGivenValues, updatedSetRestriction];
      }
    }
  } else {
    const potentialModValues = findStatValuesThatMeetTarget(
      valuesBySlot,
      targetStat.minimum - characterValue,
      targetStat.maximum - characterValue,
      0,
      100,
      character
    );

    // Filter out mods into only those that have those values
    for (let potentialModValuesObject of potentialModValues) {
      const modsThatFitGivenValues = [];

      usableMods.forEach(mod => {
        if (modValues[mod.id] === potentialModValuesObject[mod.slot]) {
          modsThatFitGivenValues.push(mod);
        }
      });

      yield [modsThatFitGivenValues, setRestrictions];
    }
  }
}

/**
 * Given a set of potential values in each slot, find every combination of values that fits the target criteria
 *
 * @param valuesBySlot {Object<String, Array<Number>>}
 * @param targetMin {number}
 * @param targetMax {number}
 * @param progressMin {number} The overall progress value that this function starts at, as a whole percent
 * @param progressMax {number} The overall progress value that the optimizer will hit when this function finishes,
 *                             as a whole percent
 * @param character {character} The character for which the stat values are being calculated
 * @returns {{square: number, diamond: number, arrow: number, cross: number, circle: number, triangle: number}[]}
 */
function* findStatValuesThatMeetTarget(valuesBySlot, targetMin, targetMax, progressMin, progressMax, character) {
  const totalIterations = valuesBySlot.square.size * valuesBySlot.arrow.size * valuesBySlot.diamond.size *
    valuesBySlot.triangle.size * valuesBySlot.circle.size * valuesBySlot.cross.size;
  const onePercent = Math.floor(totalIterations / (progressMax - progressMin));
  let currentIteration = 0;

  // This is essentially a fancy nested for loop iterating over each value in each slot.
  // That means this is O(n^6) for 6 mod slots (which is terrible!).
  function* slotRecursor(slots, valuesObject) {
    if (slots.length) {
      const slotsCopy = Array.from(slots);
      const currentSlot = slotsCopy.shift();
      for (let slotValue of valuesBySlot[currentSlot]) {
        yield* slotRecursor(slotsCopy, Object.assign({}, valuesObject, {[currentSlot]: slotValue}));
      }
    } else {
      if (currentIteration++ % onePercent === 0) {
        const progressPercent = progressMin + (currentIteration / totalIterations) * (progressMax - progressMin);
        progressMessage(character, 'Calculating sets to meet target value', progressPercent);
      }

      const statValue = Object.values(valuesObject).reduce((acc, value) => acc + value, 0);
      if (statValue >= targetMin && statValue <= targetMax) {
        yield valuesObject;
      }
    }
  }

  yield* slotRecursor(modSlots, {});
}

/**
 * Figure out what the best set of mods for a character are such that the values in the plan are optimized. Try to
 * satisfy the set restrictions given, but loosen them if no mod set can be found that uses them as-is.
 *
 * @param usableMods {Array<Mod>} The set of mods that is available to be used for this character
 * @param character {Character} A Character object that represents all of the base stats required for percentage
 *                              calculations as well as the optimization plan to use
 * @param setRestrictions {Object<String, Number>} An object with the number of each set to use
 * @returns {{messages: Array<String>, modSet: Array<Mod>}}
 */
function findBestModSetByLooseningSetRestrictions(usableMods, character, setRestrictions) {
  // Get a list of the restrictions to iterate over for this character, in order of most restrictive (exactly what was
  // selected) to least restrictive (the last entry will always be no restrictions).
  const possibleRestrictions = loosenRestrictions(setRestrictions);

  // Try to find a mod set using each set of restrictions until one is found
  for (let i = 0; i < possibleRestrictions.length; i++) {
    const {restriction, messages: restrictionMessages} = possibleRestrictions[i];

    // Filter the usable mods based on the given restrictions
    const restrictedMods = restrictMods(usableMods, restriction);

    // Try to optimize using this set of mods
    let {modSet: bestModSet, messages: setMessages} =
      findBestModSetWithoutChangingRestrictions(restrictedMods, character, restriction);

    if (bestModSet) {
      return {
        modSet: bestModSet,
        messages: restrictionMessages.concat(setMessages)
      };
    }
  }
}

/**
 * Find the best configuration of mods from a set of usable mods
 * @param usableMods {Array<Mod>}
 * @param character {Character}
 * @param setsToUse {Object<String, Number>} The sets to use for this mod set. This function will return null if
 *   these sets can't be used.
 * @returns {{messages: Array<String>, modSet: Array<Mod>}}
 */
function findBestModSetWithoutChangingRestrictions(usableMods, character, setsToUse) {
  const potentialUsedSets = new Set();
  const baseSets = {};
  const messages = [];
  let squares, arrows, diamonds, triangles, circles, crosses;
  let setlessMods;
  let subMessages;

  // Sort all the mods by score, then break them into sets.
  // For each slot, try to use the most restrictions possible from what has been set for that character
  usableMods.sort(modSort(character));

  ({mods: squares, messages: subMessages} = filterMods(
    usableMods,
    'square',
    character.optimizerSettings.minimumModDots,
    character.optimizerSettings.target.primaryStatRestrictions.square
  ));
  messages.push(...subMessages);
  ({mods: arrows, messages: subMessages} = filterMods(
    usableMods,
    'arrow',
    character.optimizerSettings.minimumModDots,
    character.optimizerSettings.target.primaryStatRestrictions.arrow
  ));
  messages.push(...subMessages);
  ({mods: diamonds, messages: subMessages} = filterMods(
    usableMods,
    'diamond',
    character.optimizerSettings.minimumModDots,
    character.optimizerSettings.target.primaryStatRestrictions.diamond
  ));
  messages.push(...subMessages);
  ({mods: triangles, messages: subMessages} = filterMods(
    usableMods,
    'triangle',
    character.optimizerSettings.minimumModDots,
    character.optimizerSettings.target.primaryStatRestrictions.triangle
  ));
  messages.push(...subMessages);
  ({mods: circles, messages: subMessages} = filterMods(
    usableMods,
    'circle',
    character.optimizerSettings.minimumModDots,
    character.optimizerSettings.target.primaryStatRestrictions.circle
  ));
  messages.push(...subMessages);
  ({mods: crosses, messages: subMessages} = filterMods(
    usableMods,
    'cross',
    character.optimizerSettings.minimumModDots,
    character.optimizerSettings.target.primaryStatRestrictions.cross
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
      return {modSet: modSet, messages: messages};
    } else {
      return {modSet: null, messages: []};
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

  // If sets are 100% deterministic, make potentialUsedSets only them
  const usedSets = Object.entries(setsToUse)
    .filter(([setName, count]) => count > 0).map(([setName]) => setName);

  const modSlotsOpen = 6 - Object.entries(setsToUse).reduce(
    (filledSlots, [setName, setCount]) => filledSlots + setBonuses[setName].numberOfModsRequired * setCount, 0
  );

  if (0 === modSlotsOpen) {
    for (let setName of usedSets) {
      const setBonus = setBonuses[setName];
      potentialUsedSets.add(setBonus);
    }
    setlessMods = null;
  } else {
    // Otherwise, use any set bonus with positive value that fits into the set restriction
    for (let setBonus of Object.values(setBonuses)) {
      if (setBonus.numberOfModsRequired <= modSlotsOpen &&
        scoreStat(setBonus.maxBonus, character.optimizerSettings.target) > 0
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
    const setScore = scoreModSet(set, character);
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
  const forcedSets = {4: [], 2: []};
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
   */
  function* combineSetsGenerator(firstSet, secondSet, thirdSet) {
    if ('undefined' === typeof thirdSet) {
      for (let [firstSetSlots, secondSetSlots] of chooseFourOptions) {
        for (let slot of firstSetSlots) {
          setObject[slot] = firstSet[slot];
        }
        for (let slot of secondSetSlots) {
          setObject[slot] = secondSet[slot];
        }
        yield setObjectToArray();
      }
    } else {
      for (let [firstSetSlots, secondSetSlots, thirdSetSlots] of chooseTwoOptions) {
        for (let slot of firstSetSlots) {
          setObject[slot] = firstSet[slot];
        }
        for (let slot of secondSetSlots) {
          setObject[slot] = secondSet[slot];
        }
        for (let slot of thirdSetSlots) {
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
      yield* combineSetsGenerator(firstSet, setlessMods);

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
    yield* combineSetsGenerator(setlessMods, firstSet);

    // The two-mod set plus any two two-mod sets with value
    for (let i = 0; i < twoModSets.length; i++) {
      secondSet = baseSets[twoModSets[i]];

      // The forced set plus the second set plus setless mods
      yield* combineSetsGenerator(setlessMods, firstSet, secondSet);

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
    yield* combineSetsGenerator(firstSet, secondSet, setlessMods);

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
    for (let slot of modSlots) {
      setObject[slot] = setlessMods[slot];
    }
    yield setObjectToArray();

    for (let firstSetType of fourModSets) {
      let firstSet = baseSets[firstSetType];

      // the whole set plus setless mods
      yield* combineSetsGenerator(firstSet, setlessMods);

      // the whole set plus any 2-mod set
      for (let secondSetType of twoModSets) {
        let secondSet = baseSets[secondSetType];
        yield* combineSetsGenerator(firstSet, secondSet);
      }
    }

    for (let i = 0; i < twoModSets.length; i++) {
      let firstSet = baseSets[twoModSets[i]];

      // the whole set plus setless mods
      yield* combineSetsGenerator(setlessMods, firstSet);

      // the whole set plus a set of 4 from any 2-mod sets and the base set
      for (let j = i; j < twoModSets.length; j++) {
        let secondSet = baseSets[twoModSets[j]];

        // the first set plus the second set plus setless mods
        yield* combineSetsGenerator(setlessMods, firstSet, secondSet);

        // the first set plus the second set plus another set
        for (let k = j; k < twoModSets.length; k++) {
          let thirdSet = baseSets[twoModSets[k]];

          yield* combineSetsGenerator(firstSet, secondSet, thirdSet);
        }
      }
    }
  }
}
