class Optimizer {
  constructor(mods) {
    this.mods = mods;
  }

  /**
   * Given a specific character and an optimization plan, figure out what the best set of mods for that character are
   * such that the values in the plan are optimized.
   *
   * @param character A Character object that represents all of the base stats required for percentage calculations
   * @param optimizationPlan An OptimizationPlan object that gives values to all stats.
   */
  findBestModSetForCharacter(character, optimizationPlan){
    // Filter out any mods that aren't usable
    // Go through all mods and assign a value to them based on the optimization plan
    // Assign a value to each set bonus based on the optimization plan
    // Start with the highest-value mod in each slot
    // Go through each set bonus with a positive value, and find the best mod sub-sets (all possible pairs or quads)
    // Make each possible set of 6 from the sub-sets found above, including filling in with the "base" set
    // Choose the set with the highest value
  }
}

export default Optimizer;
