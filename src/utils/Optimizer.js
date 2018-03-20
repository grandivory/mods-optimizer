import modSets from "../constants/sets";
import {SQUARE, ARROW, DIAMOND, TRIANGLE, CIRCLE, CROSS} from "../constants/slots";
import firstOrNull from "./firstOrNull";

class Optimizer {
  constructor(mods) {
    this.mods = mods;
  }

  /**
   * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
   * such that the values in the plan are optimized.
   *
   * @param mods The set of mods that is available to be used for this character
   * @param character A Character object that represents all of the base stats required for percentage calculations
   * @param optimizationPlan An OptimizationPlan object that gives values to all stats.
   */
  findBestModSetForCharacter(mods, character, optimizationPlan){
    let modValues = new WeakMap();
    let setValues = new WeakMap();
    let candidateValues = new WeakMap();
    let squares, arrows, diamonds, triangles, circles, crosses;
    let candidateSets = [];

    // Go through all mods and assign a value to them based on the optimization plan
    for (let i = 0; i < mods.length; i++) {
      modValues.set(mods[i], this.scoreMod(mods[i], optimizationPlan, character.baseStats));
    }

    // Sort all the mods by score, then break them into sets
    mods.sort((left, right) => modValues.get(right) - modValues.get(left));
    squares = mods.filter(mod => 'square' === mod.slot);
    arrows = mods.filter(mod => 'arrow' === mod.slot);
    diamonds = mods.filter(mod => 'diamond' === mod.slot);
    triangles = mods.filter(mod => 'triangle' === mod.slot);
    circles = mods.filter(mod => 'circle' === mod.slot);
    crosses = mods.filter(mod => 'cross' === mod.slot);

    // Assign a value to each set bonus based on the optimization plan
    for (let setName in modSets) {
      if (modSets.hasOwnProperty(setName)) {
        setValues.set(
          modSets[setName],
          this.valueOfStat(modSets[setName].bonus, optimizationPlan, character.baseStats)
        );
      }
    }

    // Start with the highest-value mod in each slot
    candidateSets.push({
      SQUARE: firstOrNull(squares),
      ARROW: firstOrNull(arrows),
      DIAMOND: firstOrNull(diamonds),
      TRIANGLE: firstOrNull(triangles),
      CIRCLE: firstOrNull(circles),
      CROSS: firstOrNull(crosses)
    });

    // Go through each set bonus with a positive value, and find the best mod sub-sets (all possible pairs or quads)
    // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set
    // Choose the set with the highest value
    for (let i = 0; i < candidateSets.length; i++) {
      candidateValues.set(candidateSets[i], this.valueOfSet(candidateSets[i], modValues));
    }
    candidateSets.sort((left, right) => candidateSets.get(right) - candidateSets.get(left));

    console.log(candidateSets);
    console.log(modValues);
    console.log(candidateValues.get(candidateSets[0]));
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
    ).reduce((a, b) => a + b);

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
    const statType = Optimizer.statTypeMap[stat.displayType];
    if (stat.isPercent) {
      return optimizationPlan[statType] * Math.floor(baseStats[statType] * stat.value / 100);
    } else {
      return optimizationPlan[statType] * stat.value
    }
  }

  /**
   * Given a set of already scored mods, tabulate the total value of the set
   *
   * @param set Object an object containing mods under each of the keys in sets.js
   * @param modValues WeakMap A Weakmap containing the scores for each mod
   */
  valueOfSet(set, modValues) {
    return (modValues.get(set.SQUARE) || 0) +
      (modValues.get(set.ARROW) || 0) +
      (modValues.get(set.DIAMOND) || 0) +
      (modValues.get(set.TRIANGLE) || 0) +
      (modValues.get(set.CIRCLE) || 0) +
      (modValues.get(set.CROSS) || 0);
  }

}

Optimizer.statTypeMap = {
  'Health': 'health',
  'Protection': 'protection',
  'Speed': 'speed',
  'Critical Damage': 'critDmg',
  'Potency': 'potency',
  'Tenacity': 'tenacity',
  'Offense': 'offense',
  'Critical Chance': 'critChance',
  'Defense': 'defense',
  'Accuracy': 'accuracy'
};

export default Optimizer;
