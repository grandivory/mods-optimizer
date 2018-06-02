/**
 * A class to represent the weights that should be applied to each potential stat that a mod can have when
 * trying to optimize the mods assigned to each character. Each weight is on a scale from -100 to 100
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
              critAvoid
  ) {
    // Set raw values based on exactly what the user entered
    this.rawHealth = health || 0;
    this.rawProtection = protection || 0;
    this.rawSpeed = speed || 0;
    this.rawCritDmg = critDmg || 0;
    this.rawPotency = potency || 0;
    this.rawTenacity = tenacity || 0;
    this.rawOffense = offense || 0;
    this.rawCritChance = critChance || 0;
    this.rawDefense = defense || 0;
    this.rawAccuracy = accuracy || 0;
    this.rawCritAvoid = critAvoid || 0;


    // Set the values that will actually be used for scoring based on the weights of each stat
    this.health = this.rawHealth / OptimizationPlan.statWeight.health;
    this.protection =  this.rawProtection / OptimizationPlan.statWeight.protection;
    this.speed = this.rawSpeed / OptimizationPlan.statWeight.speed;
    this.critDmg =  this.rawCritDmg / OptimizationPlan.statWeight.critDmg;
    this.potency = this.rawPotency / OptimizationPlan.statWeight.potency;
    this.tenacity = this.rawTenacity / OptimizationPlan.statWeight.tenacity;
    this.offense = this.rawOffense / OptimizationPlan.statWeight.offense;
    this.critChance = this.rawCritChance / OptimizationPlan.statWeight.critChance;
    this.defense = this.rawDefense / OptimizationPlan.statWeight.defense;
    this.accuracy = this.rawAccuracy/ OptimizationPlan.statWeight.accuracy;
    this.critAvoid = this.rawCritAvoid / OptimizationPlan.statWeight.critAvoid;
  }

  serialize() {
    let planObject = {};

    planObject.health = this.rawHealth;
    planObject.protection = this.rawProtection;
    planObject.speed = this.rawSpeed;
    planObject.critDmg = this.rawCritDmg;
    planObject.potency = this.rawPotency;
    planObject.tenacity = this.rawTenacity;
    planObject.offense = this.rawOffense;
    planObject.critChance = this.rawCritChance;
    planObject.defense = this.rawDefense;
    planObject.accuracy = this.rawAccuracy;
    planObject.critAvoid = this.rawCritAvoid;

    return planObject;
  }

  static deserialize(planJson) {
    return new OptimizationPlan(
      planJson.health,
      planJson.protection,
      planJson.speed,
      planJson.critDmg,
      planJson.potency,
      planJson.tenacity,
      planJson.offense,
      planJson.critChance,
      planJson.defense,
      planJson.accuracy,
      planJson.critAvoid,
    );
  }
}

OptimizationPlan.statWeight = {
  'health': 2000,
  'protection': 4000,
  'speed': 20,
  'critDmg': 40,
  'potency': 10,
  'tenacity': 10,
  'offense': 150,
  'critChance': 10,
  'defense': 33,
  'accuracy': 50,
  'critAvoid': 25
};

export default OptimizationPlan;
