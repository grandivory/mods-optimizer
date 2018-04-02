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
              accuracy,
              critAvoid,
              useOnly5dotMods
  ) {
    this.health = health || 0;
    this.protection = protection || 0;
    this.speed = speed || 0;
    this.critDmg = critDmg || 0;
    this.potency = potency || 0;
    this.tenacity = tenacity || 0;
    this.offense = offense || 0;
    this.critChance = critChance || 0;
    this.defense = defense || 0;
    this.accuracy = accuracy || 0;
    this.critAvoid = critAvoid || 0;
    this.useOnly5dotMods = useOnly5dotMods || false;
  }
}

export default OptimizationPlan;
