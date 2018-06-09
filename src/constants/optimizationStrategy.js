import OptimizationPlan from "../domain/OptimizationPlan";

const optimizationStrategy = {
  'Speed with survivability': new OptimizationPlan(
    5, // health
    5, // protection
    100, // speed
    0, // crit damage
    0, // potency
    5, // tenacity
    0, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  '': new OptimizationPlan(
    10, // health
    0, // protection
    100, // speed
    0, // crit damage
    10, // potency
    20, // tenacity
    0, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance, \n0 // crit avoidance
  ),
};

Object.freeze(optimizationStrategy);

export default optimizationStrategy;
