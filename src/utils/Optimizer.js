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

  }
}

export default Optimizer;
