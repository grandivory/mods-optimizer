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
   * @param characters {Character.baseID => Character} A set of characters that might be optimized
   * @param order Array[Character.baseID] The characters to optimize, in order
   *
   * @return {character.baseID => ModSet}
   */
  optimizeMods(modsList, characters, order) {
    const considerationSet = modsList.filter(mod =>
      // Use any mod that isn't assigned or that is assigned to a character that isn't locked
      !mod.characterID || !characters[mod.characterID].optimizerSettings.isLocked
    );

    // For each character in the list, find the best mod set for that character
    const {assignedSets} = order.reduce((accumulator, characterID) => {
      const {considerationSet: availableMods, assignedSets: completedSets} = accumulator;
      const character = characters[characterID];

      const modSetForCharacter = this.findBestModSetForCharacter(availableMods, character);
      return {
        considerationSet: availableMods.filter(mod => !modSetForCharacter.contains(mod)),
        assignedSets: Object.assign(completedSets, {
          [characterID]: modSetForCharacter
        })
      };
    }, {considerationSet: considerationSet, assignedSets: {}});

    return assignedSets;
    // for (let character of characters) {
    //   let modSet = this.findBestModSetForCharacter(considerationSet, character);
    //
    //   // Assign the character to each mod, then remove the mods from the consideration set
    //   // While assigning the character to each mod, remove them from any other mods in the set
    //   // While doing this, collect the mods into an array to return
    //   considerationSet.filter(mod => character === mod.assignTo).forEach(mod => mod.assignTo = null);
    //   modSet.assignTo(character);
    //   considerationSet = considerationSet.filter(mod => !modSet.contains(mod));
    //   assignedModSets.push({
    //     character: character,
    //     modSet: modSet
    //   });
    // }
    //
    // return assignedModSets;
  }

  /**
   * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
   * such that the values in the plan are optimized.
   *
   * @param mods The set of mods that is available to be used for this character
   * @param character A Character object that represents all of the base stats required for percentage calculations as
   *                  well as the optimization plan to use
   */
  findBestModSetForCharacter(mods, character) {
    let availableMods, usableMods;
    let squares, arrows, diamonds, triangles, circles, crosses;
    let modValues = new WeakMap();
    let setBonusValues = new WeakMap();
    let potentialUsedSets = [];
    let baseSets = new WeakMap();
    let setlessMods;
    let candidateSets;
    let candidateValues = new WeakMap();

    // If the character is less than gear 12, remove any mods that are tier 6 or higher
    if (character.playerValues.gearLevel < 12) {
      usableMods = mods.filter(mod => 6 > mod.pips);
    } else {
      usableMods = mods;
    }

    // If the optimization plan says to only use 5-dot mods, then filter out any mods with fewer dots
    if (character.optimizerSettings.useOnly5DotMods) {
      availableMods = usableMods.filter(mod => 5 <= mod.pips);
    } else {
      availableMods = usableMods;
    }

    // Go through all mods and assign a value to them based on the optimization plan
    for (let mod of mods) {
      modValues.set(mod, this.scoreMod(mod, character));
    }

    // Sort all the mods by score, then break them into sets
    availableMods.sort(this.modSort(character, modValues));
    usableMods.sort(this.modSort(character, modValues));

    // Get the set of all possible mods to use for this character
    squares = availableMods.filter(mod => 'square' === mod.slot);
    if (0 === squares.length) {
      squares = usableMods.filter(mod => 'square' === mod.slot);
    }
    arrows = availableMods.filter(mod => 'arrow' === mod.slot);
    if (0 === arrows.length) {
      arrows = usableMods.filter(mod => 'arrow' === mod.slot);
    }
    diamonds = availableMods.filter(mod => 'diamond' === mod.slot);
    if (0 === diamonds.length) {
      diamonds = usableMods.filter(mod => 'diamond' === mod.slot);
    }
    triangles = availableMods.filter(mod => 'triangle' === mod.slot);
    if (0 === triangles.length) {
      triangles = usableMods.filter(mod => 'triangle' === mod.slot);
    }
    circles = availableMods.filter(mod => 'circle' === mod.slot);
    if (0 === circles.length) {
      circles = usableMods.filter(mod => 'circle' === mod.slot);
    }
    crosses = availableMods.filter(mod => 'cross' === mod.slot);
    if (0 === crosses.length) {
      crosses = usableMods.filter(mod => 'cross' === mod.slot);
    }

    // Assign a value to each set bonus based on the optimization plan
    for (let setName in setBonuses) {
      if (setBonuses.hasOwnProperty(setName)) {
        let setBonus = setBonuses[setName];
        setBonusValues.set(setBonus, setBonus.maxBonus.getOptimizationValue(character));

        if (setBonusValues.get(setBonus) > 0) {
          potentialUsedSets.push(setBonus);
        }
      }
    }

    /**
     * Given a sorted array of mods, return either the first mod (if it has a positive score or the character wants to
     * use only 5-dot mods) or null. This allows for empty slots on characters where the mods might be better used
     * elsewhere, or where mods have negative values.
     * @param candidates Array[Mod]
     * @returns Mod
     */
    const topMod = (candidates) => {
      const mod = firstOrNull(candidates);
      // If we've already limited a character to using only 5-dot mods, then having any mod is likely worth something,
      // so allow for 0-value mods.
      if (mod &&
        (modValues.get(mod) > 0 || (modValues.get(mod) === 0 && character.optimizerSettings.useOnly5DotMods))
      ) {
        return mod;
      } else {
        return null;
      }
    };

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
    }

    // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set formed
    // without taking sets into account
    candidateSets = this.getCandidateSets(potentialUsedSets, baseSets, setlessMods);
    candidateSets.push(setlessMods);

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

    return candidateSets[0];
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

    const primaryStat = character.optimizerSettings.target.upgradeMods ?
      mod.primaryStat.upgradePrimary(mod.pips) :
      mod.primaryStat;

    score += primaryStat.getOptimizationValue(character);
    score += mod.secondaryStats.map(
      stat => stat.getOptimizationValue(character)
    ).reduce((a, b) => a + b, 0);

    return score;
  }

  /**
   * Find all the potential combinations of mods to consider by taking into account mod sets and keeping set bonuses
   *
   * @param potentialUsedSets Array[SetBonus] The SetBonuses that have sets provided for use
   * @param baseSets WeakMap(SetBonus -> ModSet) The best mods available for each SetBonus in potentialUsedSets
   * @param setlessMods ModSet The best raw mod for each slot, regardless of set
   *
   * @return Array[ModSet]
   */
  getCandidateSets(potentialUsedSets, baseSets, setlessMods) {
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
    let fourModSets = potentialUsedSets.filter(modSet => 4 === modSet.numberOfModsRequired);
    let twoModSets = potentialUsedSets.filter(modSet => 2 === modSet.numberOfModsRequired);
    let candidateSets = [];

    for (let firstSetType of fourModSets) {
      let firstSet = baseSets.get(firstSetType);

      // the whole set plus setless mods
      candidateSets = candidateSets.concat(this.combineSets(firstSet, setlessMods));

      // the whole set plus any 2-mod set
      for (let secondSetType of twoModSets) {
        let secondSet = baseSets.get(secondSetType);
        candidateSets = candidateSets.concat(this.combineSets(firstSet, secondSet));
      }
    }

    for (let i = 0; i < twoModSets.length; i++) {
      let firstSet = baseSets.get(twoModSets[i]);

      // the whole set plus setless mods
      candidateSets = candidateSets.concat(this.combineSets(setlessMods, firstSet));

      // the whole set plus a set of 4 from any 2-mod sets and the base set
      for (let j = i; j < twoModSets.length; j++) {
        let secondSet = baseSets.get(twoModSets[j]);

        // the first set plus the second set plus setless mods
        candidateSets = candidateSets.concat(this.combineSets(setlessMods, firstSet, secondSet));

        // the first set plus the second set plus another set
        for (let k = j; k < twoModSets.length; k++) {
          let thirdSet = baseSets.get(twoModSets[k]);

          candidateSets = candidateSets.concat(this.combineSets(firstSet, secondSet, thirdSet));
        }
      }
    }

    return candidateSets;
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
