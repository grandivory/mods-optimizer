// @flow

import areObjectsEquivalent from "../utils/areObjectsEquivalent";
import TargetStat from "./TargetStat";

/**
 * A class to represent the weights that should be applied to each potential stat that a mod can have when
 * trying to optimize the mods assigned to each character. Each weight is on a scale from -100 to 100
 */
class OptimizationPlan {
  name;
  health;
  protection;
  speed;
  critDmg;
  potency;
  tenacity;
  physDmg;
  specDmg;
  critChance;
  armor;
  resistance;
  accuracy;
  critAvoid;
  upgradeMods;
  primaryStatRestrictions;
  setRestrictions;
  targetStat;

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
              critAvoid,
              upgradeMods = true,
              primaryStatRestrictions = {},
              setRestrictions = {},
              targetStat = null
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

    this.upgradeMods = upgradeMods;

    // Set the values that will actually be used for scoring based on the weights of each stat
    this.health = this.rawHealth / OptimizationPlan.statWeight.health;
    this.protection = this.rawProtection / OptimizationPlan.statWeight.protection;
    this.speed = this.rawSpeed / OptimizationPlan.statWeight.speed;
    this.critDmg = this.rawCritDmg / OptimizationPlan.statWeight.critDmg;
    this.potency = this.rawPotency / OptimizationPlan.statWeight.potency;
    this.tenacity = this.rawTenacity / OptimizationPlan.statWeight.tenacity;
    this.physDmg = this.rawPhysDmg / OptimizationPlan.statWeight.physDmg;
    this.specDmg = this.rawSpecDmg / OptimizationPlan.statWeight.specDmg;
    this.critChance = this.rawCritChance / OptimizationPlan.statWeight.critChance;
    this.armor = this.rawArmor / OptimizationPlan.statWeight.armor;
    this.resistance = this.rawResistance / OptimizationPlan.statWeight.resistance;
    this.accuracy = this.rawAccuracy / OptimizationPlan.statWeight.accuracy;
    this.critAvoid = this.rawCritAvoid / OptimizationPlan.statWeight.critAvoid;

    this.primaryStatRestrictions = primaryStatRestrictions;
    this.setRestrictions = setRestrictions;
    this.targetStat = targetStat;
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
      this.rawCritAvoid,
      this.upgradeMods,
      this.primaryStatRestrictions,
      this.setRestrictions,
      this.targetStat
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
      this.critAvoid === that.critAvoid &&
      this.upgradeMods === that.upgradeMods &&
      areObjectsEquivalent(this.primaryStatRestrictions, that.primaryStatRestrictions) &&
      areObjectsEquivalent(this.setRestrictions, that.setRestrictions) &&
      areObjectsEquivalent(this.targetStat, that.targetStat)
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
    planObject.upgradeMods = this.upgradeMods;
    planObject.primaryStatRestrictions = this.primaryStatRestrictions;
    planObject.setRestrictions = this.setRestrictions;
    planObject.targetStat = this.targetStat;

    return planObject;
  }

  /**
   * Deserialize an OptimizationPlan from JSON
   *
   * @param planJson Object
   * @returns {OptimizationPlan}
   */
  static deserialize(planJson) {
    if (planJson) {
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
        planJson.critAvoid,
        'undefined' !== typeof planJson.upgradeMods ? planJson.upgradeMods : true,
        planJson.primaryStatRestrictions || {},
        planJson.setRestrictions || {},
        planJson.targetStat ?
          new TargetStat(planJson.targetStat.stat, planJson.targetStat.minimum, planJson.targetStat.maximum) :
          null
      );
    } else {
      return null;
    }
  }
}

OptimizationPlan.statWeight = {
  'health': 2000,
  'protection': 4000,
  'speed': 20,
  'critDmg': 30,
  'potency': 15,
  'tenacity': 15,
  'physDmg': 225,
  'specDmg': 450,
  'offense': 225,
  'critChance': 10,
  'armor': 33,
  'resistance': 33,
  'accuracy': 10,
  'critAvoid': 10
};

export default OptimizationPlan;
