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
    // Go through all mods and assign a value to them based on the optimization plan
    let modValues = new WeakMap();
    let setValues = {};

    for (let i = 0; i < mods.length; i++) {
      modValues.set(mods[i], this.scoreMod(mods[i], optimizationPlan, character.baseStats))
    }
    // Assign a value to each set bonus based on the optimization plan

    // Start with the highest-value mod in each slot
    // Go through each set bonus with a positive value, and find the best mod sub-sets (all possible pairs or quads)
    // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set
    // Choose the set with the highest value
    console.log(modValues);
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
    const statType = Optimizer.statTypeMap[stat.displayType]
    if (stat.isPercent) {
      return optimizationPlan[statType] * baseStats[statType] * stat.value / 100;
    } else {
      return optimizationPlan[statType] * stat.value
    }
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
