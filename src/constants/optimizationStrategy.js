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
  'Speed': new OptimizationPlan(
    0, // health
    0, // protection
    100, // speed
    0, // crit damage
    0, // potency
    0, // tenacity
    0, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Speed, Crit, and Offense': new OptimizationPlan(
    0, // health
    0, // protection
    100, // speed
    100, // crit damage
    0, // potency
    0, // tenacity
    50, // offense
    50, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Speed, Crit, Offense, Potency': new OptimizationPlan(
    0, // health
    0, // protection
    100, // speed
    100, // crit damage
    25, // potency
    0, // tenacity
    50, // offense
    50, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Speedy debuffer': new OptimizationPlan(
    0, // health
    0, // protection
    100, // speed
    0, // crit damage
    25, // potency
    0, // tenacity
    0, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Slow Crit, Offense, Potency': new OptimizationPlan(
    0, // health
    0, // protection
    10, // speed
    100, // crit damage
    25, // potency
    0, // tenacity
    50, // offense
    50, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Speedy Chex Mix': new OptimizationPlan(
    0, // health
    0, // protection,
    50, // speed
    0, // crit damage
    0, // potency
    0, // tenacity,
    100, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Special Damage': new OptimizationPlan(
    0, // health
    0, // protection,
    100, // speed
    0, // crit damage
    0, // potency
    0, // tenacity,
    50, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  ),
  'Special Damage with Potency': new OptimizationPlan(
    0, // health
    0, // protection,
    100, // speed
    0, // crit damage
    25, // potency
    0, // tenacity,
    50, // offense
    0, // crit chance
    0, // defense
    0, // accuracy
    0 // crit avoidance
  )
};

Object.freeze(optimizationStrategy);

export default optimizationStrategy;
