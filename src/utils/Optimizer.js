// @flow

import setBonuses from "../constants/setbonuses";
import firstOrNull from "./firstOrNull";
import chooseFromArray from "./chooseFromArray";
import ModSet from "../domain/ModSet";

class Optimizer {
  constructor() {
    // This will be used later. It's calculated here in the constructor so that it only needs to be calculated once
    let fourSlotOptions = chooseFromArray(ModSet.slots, 4);

    this.chooseFourOptions = [];
    for (let usedSlots of fourSlotOptions) {
      this.chooseFourOptions.push([usedSlots, ModSet.slots.filter(slot => !usedSlots.includes(slot))]);
    }

    let twoSlotOptions = chooseFromArray(ModSet.slots, 2);
    this.chooseTwoOptions = [];
    for (let firstSetSlots of twoSlotOptions) {
      let remainingSlots = ModSet.slots.filter(slot => !firstSetSlots.includes(slot));
      let secondSetOptions = chooseFromArray(remainingSlots, 2);
      for (let secondSetSlots of secondSetOptions) {
        this.chooseTwoOptions.push([
          firstSetSlots,
          secondSetSlots,
          remainingSlots.filter(slot => !secondSetSlots.includes(slot))
        ]);
      }
    }
  }

  /**
   * Find the optimum configuration for mods for a list of characters by optimizing mods for the first character,
   * optimizing mods for the second character after removing those used for the first, etc.
   *
   * @param modsList Array[Mod] An array of mods that could potentially be assign to each character
   * @param characters {Object<String, Character>} A set of characters keyed by base ID that might be optimized
   * @param order Array[Character.baseID] The characters to optimize, in order
   * @param changeThreshold {Number} The % value that a new mod set has to improve upon the existing equipped mods
   *                                 before the optimizer will suggest changing it
   *
   * @return {Object<String, ModSet>} An optimized set of mods, keyed by character base ID
   */
  optimizeMods(modsList, characters, order, changeThreshold) {
    const considerationSet = modsList.filter(mod =>
      // Use any mod that isn't assigned or that is assigned to a character that isn't locked
      !mod.characterID || !characters[mod.characterID].optimizerSettings.isLocked
    );

    // For each not-locked character in the list, find the best mod set for that character
    const {assignedSets, messages} = order.filter(charID => !characters[charID].optimizerSettings.isLocked)
      .reduce((accumulator, characterID) => {
        const {considerationSet: availableMods, assignedSets: completedSets, messages} = accumulator;
        const character = characters[characterID];
        const {modSet: newModSetForCharacter, messages: characterMessages} =
          this.findBestModSetForCharacter(availableMods, character);

        const oldModSetForCharacter = new ModSet(availableMods.filter(mod => mod.characterID === character.baseID));

        const newModSetValue = newModSetForCharacter.getOptimizationValue(character);
        const oldModSetValue = oldModSetForCharacter.getOptimizationValue(character);

        // Assign the new mod set if any of the following are true:
        const [assignedModSet, assignmentMessages] =
          // Treat a threshold of 0 as "always change"
          changeThreshold === 0 ||
          // If the old set doesn't satisfy the character/target restrictions, but the new set does
          (!oldModSetForCharacter.satisfiesRestrictions(
              character.optimizerSettings.minimumModDots, character.optimizerSettings.target
            ) &&
            newModSetForCharacter.satisfiesRestrictions(
              character.optimizerSettings.minimumModDots, character.optimizerSettings.target)
          ) ||
          // If the new set is better than the old set
          (newModSetValue / oldModSetValue) * 100 - 100 > changeThreshold ||
          // If the old set now has less than 6 mods and the new set has more mods
          (oldModSetForCharacter.mods().length < 6 &&
            newModSetForCharacter.mods().length > oldModSetForCharacter.mods().length)
            ?
            [newModSetForCharacter, characterMessages] :
            [oldModSetForCharacter, []];

        return {
          considerationSet: availableMods.filter(mod => !assignedModSet.contains(mod)),
          assignedSets: Object.assign(completedSets, {
            [characterID]: assignedModSet.mods().map(mod => mod.id)
          }),
          messages: assignmentMessages.length > 0 ?
            Object.assign({}, messages, {[characterID]: assignmentMessages}) :
            messages
        };
      }, {considerationSet: considerationSet, assignedSets: {}, messages: {}});

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
   * @returns {{messages: Array<String>, modSet: ModSet}}
   */
  findBestModSetForCharacter(mods, character) {
    let usableMods
      , setRestrictions = character.optimizerSettings.target.setRestrictions;

    // Characters that aren't at least gear 12 can never use 6-dot mods
    if (character.playerValues.gearLevel < 12) {
      usableMods = mods.filter(mod => 6 > mod.pips);
    } else {
      usableMods = mods;
    }

    // Get a list of the restrictions to iterate over for this character, in order of most restrictive (exactly what was
    // selected) to least restrictive (the last entry will always be no restrictions).
    const possibleRestrictions = this.loosenRestrictions(setRestrictions);

    // Try to find a mod set using each set of restrictions until one is found
    for (let i = 0; i < possibleRestrictions.length; i++) {
      const {restriction, messages: restrictionMessages} = possibleRestrictions[i];

      // Filter the usable mods based on the given restrictions
      const restrictedMods = this.restrictMods(usableMods, restriction);

      // Try to optimize using this set of mods
      let {modSet: bestModSet, messages: setMessages} = this.findBestModSet(restrictedMods, character, restriction);

      if (bestModSet) {
        return {
          modSet: bestModSet,
          messages: restrictionMessages.concat(setMessages)
        };
      }
    }
  }

  /**
   * Given a set of set restrictions, systematically reduce their severity, returning an array sorted by most to least
   * restrictive
   *
   * @param setRestrictions {Object}
   * @returns {{restriction: Object, messages: Array<String>}[]}
   */
  loosenRestrictions(setRestrictions) {
    let restrictionsArray = [{
      restriction: setRestrictions,
      messages: []
    }];

    // Try without sets
    restrictionsArray = restrictionsArray.concat(
      restrictionsArray.flatMap(({restriction, messages}) => {
        if (0 === Object.entries(restriction).length) {
          return [];
        } else {
          return [{
            restriction: {},
            messages:
              messages.concat('No mod sets could be found using the given sets, so the sets restriction was removed')
          }];
        }
      })
    );

    return restrictionsArray;
  }

  /**
   * Given a set of mods and a definition of setRestriction, return only those mods that fit the setRestriction
   *
   * @param allMods {Array<Mod>}
   * @param setRestriction {Object}
   * @returns {Array<Mod>}
   */
  restrictMods(allMods, setRestriction) {
    const potentialSets = this.areSetsComplete(setRestriction) ?
      Object.entries(setRestriction).filter(setArray => setArray[1] > 0).map(setArray => setArray[0]) :
      Object.values(setBonuses).map(setBonus => setBonus.name);

    return allMods.filter(mod => potentialSets.includes(mod.set.name));
  }

  /**
   * Utility function to determine if a given sets definition covers all 6 mod slots
   *
   * @param setDefinition {Object<SetBonus, Number>}
   * @returns {Boolean}
   */
  areSetsComplete(setDefinition) {
    return 6 === Object.entries(setDefinition).reduce((acc, setArray) => {
      return acc + setBonuses[setArray[0]].numberOfModsRequired * setArray[1];
    }, 0);
  }

  /**
   * Find the best configuration of mods from a set of usable mods
   * @param mods {Array<Mod>}
   * @param character {Character}
   * @param setRestrictions {Object} The sets to use for this mod set. This function will return null if these sets
   *                                 can't be used.
   * @returns {{messages: Array<String>, modSet: ModSet}}
   */
  findBestModSet(usableMods, character, setsToUse) {
    let squares, arrows, diamonds, triangles, circles, crosses;
    let modValues = new WeakMap();
    let setBonusValues = new WeakMap();
    let potentialUsedSets = new Set();
    let baseSets = new WeakMap();
    let setlessMods;
    let candidateSets = [];
    let candidateValues = new WeakMap();
    let messages = [], submessages;

    // Go through all mods and assign a value to them based on the optimization plan
    for (let mod of usableMods) {
      modValues.set(mod, this.scoreMod(mod, character));
    }

    // Sort all the mods by score, then break them into sets.
    // For each slot, try to use the most restrictions possible from what has been set for that character
    usableMods.sort(this.modSort(character, modValues));

    ({mods: squares, messages: submessages} = this.filterMods(
      usableMods,
      'square',
      character.optimizerSettings.minimumModDots,
      character.optimizerSettings.target.primaryStatRestrictions.square
    ));
    messages = messages.concat(submessages);
    ({mods: arrows, messages: submessages} = this.filterMods(
      usableMods,
      'arrow',
      character.optimizerSettings.minimumModDots,
      character.optimizerSettings.target.primaryStatRestrictions.arrow
    ));
    messages = messages.concat(submessages);
    ({mods: diamonds, messages: submessages} = this.filterMods(
      usableMods,
      'diamond',
      character.optimizerSettings.minimumModDots,
      character.optimizerSettings.target.primaryStatRestrictions.diamond
    ));
    messages = messages.concat(submessages);
    ({mods: triangles, messages: submessages} = this.filterMods(
      usableMods,
      'triangle',
      character.optimizerSettings.minimumModDots,
      character.optimizerSettings.target.primaryStatRestrictions.triangle
    ));
    messages = messages.concat(submessages);
    ({mods: circles, messages: submessages} = this.filterMods(
      usableMods,
      'circle',
      character.optimizerSettings.minimumModDots,
      character.optimizerSettings.target.primaryStatRestrictions.circle
    ));
    messages = messages.concat(submessages);
    ({mods: crosses, messages: submessages} = this.filterMods(
      usableMods,
      'cross',
      character.optimizerSettings.minimumModDots,
      character.optimizerSettings.target.primaryStatRestrictions.cross
    ));
    messages = messages.concat(submessages);

    /**
     * Given a sorted array of mods, return either the first mod (if it has a non-negative score) or null. This allows
     * for empty slots on characters where the mods might be better used elsewhere.
     * @param candidates Array[Mod]
     * @returns Mod
     */
    const topMod = (candidates) => {
      const mod = firstOrNull(candidates);
      if (mod && modValues.get(mod) >= 0) {
        return mod;
      } else {
        return null;
      }
    };

    // If sets are 100% deterministic, make potentialUsedSets only them
    const usedSets = Object.entries(setsToUse)
      .filter(setArray => setArray[1] > 0).map(setArray => setArray[0]);

    if (this.areSetsComplete(setsToUse)) {
      for (let setName of usedSets) {
        const setBonus = setBonuses[setName];
        setBonusValues.set(setBonus, setBonus.maxBonus.getOptimizationValue(character));
        potentialUsedSets.add(setBonus);
      }
      setlessMods = null;
    } else {
      // Otherwise, use any set bonus with positive value
      for (let setBonus of Object.values(setBonuses)) {
        setBonusValues.set(setBonus, setBonus.maxBonus.getOptimizationValue(character));

        if (setBonusValues.get(setBonus) > 0) {
          potentialUsedSets.add(setBonus);
        }
      }

      // Still make sure that any chosen sets are in the potential used sets
      for (let setName of usedSets) {
        potentialUsedSets.add(setBonuses[setName]);
      }

      // Start with the highest-value mod in each slot. If the highest-value mod has a negative value,
      // leave the slot empty
      setlessMods = new ModSet([
        topMod(squares),
        topMod(arrows),
        topMod(diamonds),
        topMod(triangles),
        topMod(circles),
        topMod(crosses)
      ]);

    }

    // Go through each set bonus with a positive value, and find the best mod sub-sets (all possible pairs or quads)
    for (let setBonus of potentialUsedSets) {
      baseSets.set(setBonus, new ModSet([
        firstOrNull(squares.filter(mod => setBonus === mod.set)),
        firstOrNull(arrows.filter(mod => setBonus === mod.set)),
        firstOrNull(diamonds.filter(mod => setBonus === mod.set)),
        firstOrNull(triangles.filter(mod => setBonus === mod.set)),
        firstOrNull(circles.filter(mod => setBonus === mod.set)),
        firstOrNull(crosses.filter(mod => setBonus === mod.set))
      ]));

      candidateSets.push(setlessMods);
    }

    // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set formed
    // without taking sets into account
    candidateSets = candidateSets.concat(this.getCandidateSets(potentialUsedSets, baseSets, setlessMods, setsToUse));

    // Choose the set with the highest value
    for (let candidateSet of candidateSets) {
      candidateValues.set(candidateSet, candidateSet.getOptimizationValue(character));
    }

    candidateSets.sort((left, right) => {
      if (candidateValues.get(left) !== candidateValues.get(right)) {
        return candidateValues.get(right) - candidateValues.get(left);
      } else {
        // If both sets have the same value, choose the set that moves the fewest mods
        const leftUnmovedMods = left.mods().filter(mod => mod.characterID === character.baseID).length;
        const rightUnmovedMods = right.mods().filter(mod => mod.characterID === character.baseID).length;

        if (leftUnmovedMods !== rightUnmovedMods) {
          return rightUnmovedMods - leftUnmovedMods;
        } else {
          // If both sets move the same number of unmoved mods, choose the set that uses the most mods overall
          return right.mods().length - left.mods().length;
        }
      }
    });

    return {
      modSet: candidateSets.length ? candidateSets[0] : null,
      messages: messages
    };
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
  filterMods(baseMods, slot, minDots, primaryStat) {
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
      messages: [`No ${primaryStat} or ${minDots}-dot ${slot} mods were available, so both restrictions were dropped.`]
    }
  }

  /**
   * Return a function to sort mods by their scores for a character
   *
   * @param character Character
   * @param modValues WeakMap A map from each Mod to a score for that mod (so that the scores don't need to constantly
   *                          be recalculated)
   */
  modSort(character, modValues) {
    return (left, right) => {
      if (modValues.get(right) === modValues.get(left)) {
        // If mods have equal value, then favor the one that's already equipped
        if (left.characterID && character.baseID === left.characterID) {
          return -1;
        } else if (right.characterID && character.baseID === right.characterID) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return modValues.get(right) - modValues.get(left);
      }
    }
  }

  /**
   * Given a mod and an optimization plan, figure out the value for that mod
   *
   * @param mod Mod
   * @param character Character for whom the mod is being scored
   */
  scoreMod(mod, character) {
    let score = 0;
    let workingMod = mod;

    // If the mod is less than level 15, then check if we need to level it and upgrade the primary stat
    if (15 > workingMod.level && character.optimizerSettings.target.upgradeMods) {
      workingMod = workingMod.levelUp();
    }
    // If the mod is 5-dot and level 15, then check if we need to slice it
    if (15 === workingMod.level && 5 === workingMod.pips && character.optimizerSettings.sliceMods) {
      workingMod = workingMod.slice();
    }

    score += workingMod.primaryStat.getOptimizationValue(character);
    score += workingMod.secondaryStats.map(
      stat => stat.getOptimizationValue(character)
    ).reduce((a, b) => a + b, 0);

    return score;
  }

  /**
   * Find all the potential combinations of mods to consider by taking into account mod sets and keeping set bonuses
   *
   * @param potentialUsedSets {Set<SetBonus>} The SetBonuses that have sets provided for use
   * @param baseSets WeakMap(SetBonus -> ModSet) The best mods available for each SetBonus in potentialUsedSets
   * @param setlessMods ModSet The best raw mod for each slot, regardless of set
   * @param setsToUse {Object<SetBonus, Number>} The sets to fulfill for every candidate set
   * @return Array[ModSet]
   */
  getCandidateSets(potentialUsedSets, baseSets, setlessMods, setsToUse) {
    /**
     * Possible sets:
     *
     * base set (already added)
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
    const fourModSets = potentialSetsArray.filter(modSet => 4 === modSet.numberOfModsRequired);
    const twoModSets = potentialSetsArray.filter(modSet => 2 === modSet.numberOfModsRequired);
    let candidateSets = [];

    for (let firstSetType of fourModSets) {
      let firstSet = baseSets.get(firstSetType);

      // the whole set plus setless mods
      if (setlessMods) {
        candidateSets = candidateSets.concat(this.combineSets(firstSet, setlessMods));
      }

      // the whole set plus any 2-mod set
      for (let secondSetType of twoModSets) {
        let secondSet = baseSets.get(secondSetType);
        candidateSets = candidateSets.concat(this.combineSets(firstSet, secondSet));
      }
    }

    for (let i = 0; i < twoModSets.length; i++) {
      let firstSet = baseSets.get(twoModSets[i]);

      // the whole set plus setless mods
      if (setlessMods) {
        candidateSets = candidateSets.concat(this.combineSets(setlessMods, firstSet));
      }

      // the whole set plus a set of 4 from any 2-mod sets and the base set
      for (let j = i; j < twoModSets.length; j++) {
        let secondSet = baseSets.get(twoModSets[j]);

        // the first set plus the second set plus setless mods
        if (setlessMods) {
          candidateSets = candidateSets.concat(this.combineSets(setlessMods, firstSet, secondSet));
        }

        // the first set plus the second set plus another set
        for (let k = j; k < twoModSets.length; k++) {
          let thirdSet = baseSets.get(twoModSets[k]);

          candidateSets = candidateSets.concat(this.combineSets(firstSet, secondSet, thirdSet));
        }
      }
    }

    return candidateSets.filter(modSet => modSet.fulfillsSetRestriction(setsToUse));
  }

  /**
   * Given 2 or 3 sets of mods, find all possible combinations of those mods that maintain set bonuses. In order to do
   * this simply, the first set given is assumed to require 4 mods if only 2 sets are given, and 2 mods if 3 are given.
   * All other sets are assumed to require 2 mods.
   *
   * @param firstSet ModSet
   * @param secondSet ModSet
   * @param [thirdSet] ModSet
   *
   * @return Array[ModSet]
   */
  combineSets(firstSet, secondSet, thirdSet) {
    let combinations = [];

    /* eslint-disable no-unused-vars */
    if ('undefined' === typeof thirdSet) {
      for (let [firstSetSlots, secondSetSlots] of this.chooseFourOptions) {
        let set = firstSet.copy();
        combinations.push(set.replaceSlots(secondSetSlots, secondSet));
      }
    } else {
      for (let [firstSetSlots, secondSetSlots, thirdSetSlots] of this.chooseTwoOptions) {
        let set = firstSet.copy();
        combinations.push(set.replaceSlots(secondSetSlots, secondSet).replaceSlots(thirdSetSlots, thirdSet));
      }
    }
    /* eslint-enable no-unused-vars */

    return combinations;
  }
}

export default Optimizer;
