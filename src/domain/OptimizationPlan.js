/**
 * A class to represent the weights that should be applied to each potential stat that a mod can have when
 * trying to optimize the mods assigned to each character. Each weight is on a scale from -100 to 100
 */
class OptimizationPlan {
  constructor(name,
              health,
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
    this.name = name;

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

  /**
   * Return a renamed version of this optimization plan
   *
   * @param name String
   */
  rename(name) {
    return new OptimizationPlan(
      name,
      this.rawHealth,
      this.rawProtection,
      this.rawSpeed,
      this.rawCritDmg,
      this.rawPotency,
      this.rawTenacity,
      this.rawOffense,
      this.rawCritChance,
      this.rawDefense,
      this.rawAccuracy,
      this.rawCritAvoid
    );
  }

  /**
   * Checks to see if two OptimizationPlans are equivalent
   * @param that
   */
  equals(that) {
    return that instanceof OptimizationPlan &&
      this.name === that.name &&
      this.health === that.health &&
      this.protection === that.protection &&
      this.speed === that.speed &&
      this.critDmg === that.critDmg &&
      this.potency === that.potency &&
      this.tenacity === that.tenacity &&
      this.offense === that.offense &&
      this.critChance === that.critChance &&
      this.defense === that.defense &&
      this.accuracy === that.accuracy &&
      this.critAvoid === that.critAvoid;
  }

  /**
   * Returns true if every raw value in this plan is an integer between -100 and 100. Otherwise, returns false
   *
   * @returns boolean
   */
  isBasic() {
    return this.valueIsBasic(this.rawHealth) &&
      this.valueIsBasic(this.rawProtection) &&
      this.valueIsBasic(this.rawSpeed) &&
      this.valueIsBasic(this.rawCritDmg) &&
      this.valueIsBasic(this.rawPotency) &&
      this.valueIsBasic(this.rawTenacity) &&
      this.valueIsBasic(this.rawOffense) &&
      this.valueIsBasic(this.rawCritChance) &&
      this.valueIsBasic(this.rawDefense) &&
      this.valueIsBasic(this.rawAccuracy) &&
      this.valueIsBasic(this.rawCritAvoid);
  }

  /**
   * Checks whether a value is an integer between -100 and 100.
   *
   * @returns boolean
   */
  valueIsBasic(val) {
    return val >= -100 && val <= 100 && Number.isInteger(val);
  }

  serialize() {
    let planObject = {};

    planObject.name = this.name;
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
      planJson.name || 'unnamed',
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
      planJson.critAvoid
    );
  }

  /**
   * Deserialize an OptimizationPlan that was serialized prior to normalization
   * @param planJson
   */
  static deserializeVersionOne(planJson) {
    return new OptimizationPlan(
      'unnamed',
      planJson.health * OptimizationPlan.statWeight.health,
      planJson.protection * OptimizationPlan.statWeight.protection,
      planJson.speed * OptimizationPlan.statWeight.speed,
      planJson.critDmg * OptimizationPlan.statWeight.critDmg,
      planJson.potency * OptimizationPlan.statWeight.potency,
      planJson.tenacity * OptimizationPlan.statWeight.tenacity,
      planJson.offense * OptimizationPlan.statWeight.offense,
      planJson.critChance * OptimizationPlan.statWeight.critChance,
      planJson.defense * OptimizationPlan.statWeight.defense,
      planJson.accuracy * OptimizationPlan.statWeight.accuracy,
      planJson.critAvoid * OptimizationPlan.statWeight.critAvoid
    )
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
