import setBonuses from "../constants/setbonuses";
import firstOrNull from "./firstOrNull";
import statTypeMap from "../constants/statTypeMap";
import chooseFromArray from "./chooseFromArray";
import ModSet from "../domain/ModSet";

class Optimizer {
  constructor(mods) {
    this.mods = mods;

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
   * @param characterList Array An array of objects with character and optimizationPlan properties
   *
   * @return Array an array of objects with character and modSet properties
   */
  optimizeMods(characterList) {
    let assignedMods = [];
    // First, filter out any mods that have already been assigned
    let considerationSet = this.mods.filter(mod => null === mod.assignTo);

    // For each character in the list, find the best mod set for that character
    for (let characterPlan of characterList) {
      let character = characterPlan.character;
      let optimizationPlan = characterPlan.optimizationPlan;
      let modSet = this.findBestModSetForCharacter(considerationSet, character, optimizationPlan);

      // Assign the character to each mod, then remove the mods from the consideration set
      // While doing this, collect the mods into an array to return
      modSet.assignTo(character);
      assignedMods.push({
        character: character,
        modSet: modSet
      });
      // for (let slot of ModSet.slots) {
      //   modSet[slot].assignTo = character;
      //   assignedMods.push(modSet[slot]);
      // }
      considerationSet = considerationSet.filter(mod => null === mod.assignTo);
    }

    return assignedMods;
  }

  /**
   * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
   * such that the values in the plan are optimized.
   *
   * @param mods The set of mods that is available to be used for this character
   * @param character A Character object that represents all of the base stats required for percentage calculations
   * @param optimizationPlan An OptimizationPlan object that gives values to all stats.
   */
  findBestModSetForCharacter(mods, character, optimizationPlan) {
    let availableMods;
    let squares, arrows, diamonds, triangles, circles, crosses;
    let modValues = new WeakMap();
    let setBonusValues = new WeakMap();
    let potentialUsedSets = [];
    let baseSets = new WeakMap();
    let setlessMods = {};
    let candidateSets = [];
    let candidateValues = new WeakMap();

    // If the optimization plan says to only use 5-dot mods, then filter out any mods with fewer dots
    if (optimizationPlan.useOnly5dotMods) {
      availableMods = mods.filter(mod => 5 === mod.pips);
    } else {
      availableMods = mods;
    }

    // Go through all mods and assign a value to them based on the optimization plan
    for (let mod of availableMods) {
      modValues.set(mod, this.scoreMod(mod, optimizationPlan, character.baseStats));
    }

    // Sort all the mods by score, then break them into sets
    availableMods.sort((left, right) => modValues.get(right) - modValues.get(left));
    squares = availableMods.filter(mod => 'square' === mod.slot);
    arrows = availableMods.filter(mod => 'arrow' === mod.slot);
    diamonds = availableMods.filter(mod => 'diamond' === mod.slot);
    triangles = availableMods.filter(mod => 'triangle' === mod.slot);
    circles = availableMods.filter(mod => 'circle' === mod.slot);
    crosses = availableMods.filter(mod => 'cross' === mod.slot);

    // Assign a value to each set bonus based on the optimization plan
    for (let setName in setBonuses) {
      if (setBonuses.hasOwnProperty(setName)) {
        let setBonus = setBonuses[setName];
        setBonusValues.set(
          setBonus,
          this.valueOfStat(setBonus.bonus, optimizationPlan, character.baseStats)
        );

        if (setBonusValues.get(setBonus) > 0) {
          potentialUsedSets.push(setBonus);
        }
      }
    }

    // Start with the highest-value mod in each slot
    setlessMods = new ModSet([
      firstOrNull(squares),
      firstOrNull(arrows),
      firstOrNull(diamonds),
      firstOrNull(triangles),
      firstOrNull(circles),
      firstOrNull(crosses)
    ]);

    // Go through each set bonus with a positive value, and find the best mod sub-sets (all possible pairs or quads)
    for (let setBonus of potentialUsedSets) {
      if (setBonusValues.get(setBonus) > 0) {
        baseSets.set(setBonus, new ModSet([
          firstOrNull(squares.filter(mod => setBonus === mod.set)),
          firstOrNull(arrows.filter(mod => setBonus === mod.set)),
          firstOrNull(diamonds.filter(mod => setBonus === mod.set)),
          firstOrNull(triangles.filter(mod => setBonus === mod.set)),
          firstOrNull(circles.filter(mod => setBonus === mod.set)),
          firstOrNull(crosses.filter(mod => setBonus === mod.set))
        ]));
      }
    }

    // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set formed
    // without taking sets into account
    candidateSets = this.getCandidateSets(potentialUsedSets, baseSets, setlessMods);
    candidateSets.push(setlessMods);

    // Choose the set with the highest value
    for (let candidateSet of candidateSets) {
      candidateValues.set(candidateSet, candidateSet.optimizationValue(optimizationPlan, character));
    }
    candidateSets.sort((left, right) => candidateValues.get(right) - candidateValues.get(left));

    return candidateSets[0];
  }

  /**
   * Given a mod and an optimization plan, figure out the value for that mod
   *
   * @param mod Mod
   * @param optimizationPlan OptimizationPlan
   * @param baseStats BaseStats the set of stats to base the score on
   */
  scoreMod(mod, optimizationPlan, baseStats) {
    let score = 0;

    score += this.valueOfStat(mod.primaryStat, optimizationPlan, baseStats);
    score += mod.secondaryStats.map(
      stat => this.valueOfStat(stat, optimizationPlan, baseStats)
    ).reduce((a, b) => a + b, 0);

    return score;
  }

  /**
   * Find the scored value for a Stat based on a given optimization plan and set of base stats
   *
   * @param stat Stat
   * @param optimizationPlan OptimizationPlan
   * @param baseStats BaseStats
   */
  valueOfStat(stat, optimizationPlan, baseStats) {
    const statType = statTypeMap[stat.displayType];
    if (stat.isPercent) {
      return optimizationPlan[statType] * Math.floor(baseStats[statType] * stat.value / 100);
    } else {
      return optimizationPlan[statType] * stat.value
    }
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

    return combinations;
  }
}

export default Optimizer;
