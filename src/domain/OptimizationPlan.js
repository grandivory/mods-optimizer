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
              physDmg,
              specDmg,
              critChance,
              armor,
              resistance,
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
    this.rawPhysDmg = physDmg || 0;
    this.rawSpecDmg = specDmg || 0;
    this.rawCritChance = critChance || 0;
    this.rawArmor = armor || 0;
    this.rawResistance = resistance || 0;
    this.rawAccuracy = accuracy || 0;
    this.rawCritAvoid = critAvoid || 0;


    // Set the values that will actually be used for scoring based on the weights of each stat
    this.health = this.rawHealth / OptimizationPlan.statWeight.health;
    this.protection =  this.rawProtection / OptimizationPlan.statWeight.protection;
    this.speed = this.rawSpeed / OptimizationPlan.statWeight.speed;
    this.critDmg =  this.rawCritDmg / OptimizationPlan.statWeight.critDmg;
    this.potency = this.rawPotency / OptimizationPlan.statWeight.potency;
    this.tenacity = this.rawTenacity / OptimizationPlan.statWeight.tenacity;
    this.physDmg = this.rawPhysDmg / OptimizationPlan.statWeight.physDmg;
    this.specDmg = this.rawSpecDmg / OptimizationPlan.statWeight.specDmg;
    this.critChance = this.rawCritChance / OptimizationPlan.statWeight.critChance;
    this.armor = this.rawArmor / OptimizationPlan.statWeight.armor;
    this.resistance = this.rawResistance / OptimizationPlan.statWeight.resistance;
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
      this.rawPhysDmg,
      this.rawSpecDmg,
      this.rawCritChance,
      this.rawArmor,
      this.rawResistance,
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
      this.physDmg === that.physDmg &&
      this.specDmg === that.specDmg &&
      this.critChance === that.critChance &&
      this.armor === that.armor &&
      this.resistance === that.resistance &&
      this.accuracy === that.accuracy &&
      this.critAvoid === that.critAvoid;
  }

  /**
   * Returns true if every raw value in this plan is an integer between -100 and 100. Otherwise, returns false
   *
   * @returns boolean
   */
  isBasic() {
    return OptimizationPlan.valueIsBasic(this.rawHealth) &&
      OptimizationPlan.valueIsBasic(this.rawProtection) &&
      OptimizationPlan.valueIsBasic(this.rawSpeed) &&
      OptimizationPlan.valueIsBasic(this.rawCritDmg) &&
      OptimizationPlan.valueIsBasic(this.rawPotency) &&
      OptimizationPlan.valueIsBasic(this.rawTenacity) &&
      OptimizationPlan.valueIsBasic(this.rawPhysDmg) &&
      OptimizationPlan.valueIsBasic(this.rawSpecDmg) &&
      OptimizationPlan.valueIsBasic(this.rawCritChance) &&
      OptimizationPlan.valueIsBasic(this.rawArmor + this.rawResistance) &&
      this.rawArmor === this.rawResistance &&
      OptimizationPlan.valueIsBasic(this.rawAccuracy) &&
      OptimizationPlan.valueIsBasic(this.rawCritAvoid);
  }

  /**
   * Checks whether a value is an integer between -100 and 100.
   *
   * @returns boolean
   */
  static valueIsBasic(val) {
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
    planObject.physDmg = this.rawPhysDmg;
    planObject.specDmg = this.rawSpecDmg;
    planObject.critChance = this.rawCritChance;
    planObject.armor = this.rawArmor;
    planObject.resistance = this.rawResistance;
    planObject.accuracy = this.rawAccuracy;
    planObject.critAvoid = this.rawCritAvoid;

    return planObject;
  }

  /**
   * Deserialize an OptimizationPlan from JSON
   *
   * @param planJson Object
   * @returns {OptimizationPlan}
   */
  /* eslint-disable no-unused-vars */
  static deserialize(planJson, physDmgPct) {
    return new OptimizationPlan(
      planJson.name || 'unnamed',
      planJson.health,
      planJson.protection,
      planJson.speed,
      planJson.critDmg,
      planJson.potency,
      planJson.tenacity,
      planJson.physDmg,
      planJson.specDmg,
      planJson.critChance,
      planJson.armor,
      planJson.resistance,
      planJson.accuracy,
      planJson.critAvoid
    );
  }
  /* eslint-enable no-unused-vars */

  /**
   * Deserialize an OptimizationPlan that was serialized by version 1.1.*
   * @param planJson Object
   * @param physDmgPct Number The amount of offense to attribute to physical damage (the rest goes to special damage)
   */
  static deserializeVersionOneOne(planJson, physDmgPct) {
    return new OptimizationPlan(
      planJson.name || 'unnamed',
      planJson.health,
      planJson.protection,
      planJson.speed,
      planJson.critDmg,
      planJson.potency,
      planJson.tenacity,
      planJson.offense * physDmgPct,
      planJson.offense * (1 - physDmgPct),
      planJson.critChance,
      planJson.defense / 2,
      planJson.defense / 2,
      planJson.accuracy,
      planJson.critAvoid
    );
  }

  /**
   * Deserialize an OptimizationPlan that was serialized prior to normalization
   * @param planJson Object
   * @param physDmgPct Number The amount of offense to attribute to physical damage (the rest goes to special damage)
   */
  static deserializeVersionOne(planJson, physDmgPct) {
    return new OptimizationPlan(
      'unnamed',
      planJson.health * OptimizationPlan.statWeight.health,
      planJson.protection * OptimizationPlan.statWeight.protection,
      planJson.speed * OptimizationPlan.statWeight.speed,
      planJson.critDmg * OptimizationPlan.statWeight.critDmg,
      planJson.potency * OptimizationPlan.statWeight.potency,
      planJson.tenacity * OptimizationPlan.statWeight.tenacity,
      planJson.offense * OptimizationPlan.statWeight.physDmg * physDmgPct,
      planJson.offense * OptimizationPlan.statWeight.specDmg * (1 - physDmgPct),
      planJson.critChance * OptimizationPlan.statWeight.critChance,
      (planJson.defense * OptimizationPlan.statWeight.armor) / 2,
      (planJson.defense * OptimizationPlan.statWeight.resistance) / 2,
      planJson.accuracy * OptimizationPlan.statWeight.accuracy,
      planJson.critAvoid * OptimizationPlan.statWeight.critAvoid
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
  'physDmg': 150,
  'specDmg': 300,
  'offense': 150,
  'critChance': 10,
  'armor': 33,
  'resistance': 33,
  'accuracy': 50,
  'critAvoid': 25
};

export default OptimizationPlan;
