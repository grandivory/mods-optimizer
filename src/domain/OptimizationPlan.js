/**
 * A class to represent the weights that should be applied to each potential stat that a mod can have when
 * trying to optimize the mods assigned to each character.
 */
class OptimizationPlan {
  constructor(health,
              protection,
              speed,
              critDmg,
              potency,
              tenacity,
              offense,
              critChance,
              defense,
              accuracy
  ) {
    this.health = health;
    this.protection = protection;
    this.speed = speed;
    this.critDmg = critDmg;
    this.potency = potency;
    this.tenacity = tenacity;
    this.offense = offense;
    this.critChance = critChance;
    this.defense = defense;
    this.accuracy = accuracy;
  }
}

export default OptimizationPlan;
