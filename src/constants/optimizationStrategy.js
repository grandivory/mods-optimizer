import OptimizationPlan from "../domain/OptimizationPlan";

const optimizationStrategy = {
  'Speed with survivability': new OptimizationPlan(
    'Speed with survivability',
    5, // health
    5, // protection
    100, // speed
    0, // crit damage
    0, // potency
    5, // tenacity
    0, // physical damage
    0, // special damage
    0, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  'Speed': new OptimizationPlan(
    'Speed',
    0, // health
    0, // protection
    100, // speed
    0, // crit damage
    0, // potency
    0, // tenacity
    0, // physical damage
    0, // special damage
    0, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  "Speed, Crit, and Physical Damage": new OptimizationPlan(
    'Speed, Crit, and Physical Damage',
    0, // health
    0, // protection
    100, // speed
    100, // crit damage
    0, // potency
    0, // tenacity
    50, // physical damage
    0, // special damage
    50, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  "Speed, Crit, Physical Damage, Potency": new OptimizationPlan(
    'Speed, Crit, Physical Damage, Potency',
    0, // health
    0, // protection
    100, // speed
    100, // crit damage
    25, // potency
    0, // tenacity
    50, // physical damage
    0, // special damage
    50, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  'Speedy debuffer': new OptimizationPlan(
    'Speedy debuffer',
    0, // health
    0, // protection
    100, // speed
    0, // crit damage
    25, // potency
    0, // tenacity
    0, // physical damage
    0, // special damage
    0, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  "Slow Crit, Physical Damage, Potency": new OptimizationPlan(
    'Slow Crit, Physical Damage, Potency',
    0, // health
    0, // protection
    10, // speed
    100, // crit damage
    25, // potency
    0, // tenacity
    50, // physical damage
    0, // special damage
    50, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  'Speedy Chex Mix': new OptimizationPlan(
    'Speedy Chex Mix',
    0, // health
    0, // protection,
    50, // speed
    0, // crit damage
    0, // potency
    0, // tenacity,
    100, // physical damage
    0, // special damage
    0, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  'Special Damage': new OptimizationPlan(
    'Special Damage',
    0, // health
    0, // protection,
    100, // speed
    0, // crit damage
    0, // potency
    0, // tenacity,
    0, // physical damage
    50, // special damage
    0, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  ),
  'Special Damage with Potency': new OptimizationPlan(
    'Special Damage with Potency',
    0, // health
    0, // protection,
    100, // speed
    0, // crit damage
    25, // potency
    0, // tenacity,
    0, // physical damage
    50, // special damage
    0, // crit chance
    0, // armor
    0, // resistance
    0, // accuracy
    0 // crit avoidance
  )
};

Object.freeze(optimizationStrategy);

export default optimizationStrategy;
