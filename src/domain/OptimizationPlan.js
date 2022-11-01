// @flow

import areObjectsEquivalent from "../utils/areObjectsEquivalent";
import TargetStat from "./TargetStat";
import Stat from "./Stat";

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
  targetStats;
  useOnlyFullSets;

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
    targetStats = [],
    useOnlyFullSets = false
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
    this.targetStats = targetStats;
    this.useOnlyFullSets = useOnlyFullSets;
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
      this.targetStats,
      this.useOnlyFullSets
    );
  }

  withUpgradeMods(upgradeMods) {
    return new OptimizationPlan(
      this.name,
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
      upgradeMods,
      this.primaryStatRestrictions,
      this.setRestrictions,
      this.targetStats,
      this.useOnlyFullSets
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
      areObjectsEquivalent(this.targetStats, that.targetStats) &&
      this.useOnlyFullSets === that.useOnlyFullSets
  }

  /**
   * Returns true if any stat weight is negative
   *
   * @returns {boolean}
   */
  hasNegativeWeights() {
    return this.health < 0 ||
      this.protection < 0 ||
      this.speed < 0 ||
      this.critDmg < 0 ||
      this.potency < 0 ||
      this.tenacity < 0 ||
      this.physDmg < 0 ||
      this.specDmg < 0 ||
      this.critChance < 0 ||
      this.armor < 0 ||
      this.resistance < 0 ||
      this.accuracy < 0 ||
      this.critAvoid < 0;
  }

  /**
   * Returns true if every stat has a weight of 0
   *
   * @returns {boolean}
   */
  isBlank() {
    return this.health === 0 &&
      this.protection === 0 &&
      this.speed === 0 &&
      this.critDmg === 0 &&
      this.potency === 0 &&
      this.tenacity === 0 &&
      this.physDmg === 0 &&
      this.specDmg === 0 &&
      this.critChance === 0 &&
      this.armor === 0 &&
      this.resistance === 0 &&
      this.accuracy === 0 &&
      this.critAvoid === 0;
  }

  /**
   * Returns true if this plan includes either primary stat or set restrictions
   *
   * @returns {boolean}
   */
  hasRestrictions() {
    return Object.values(this.primaryStatRestrictions).filter(primary => !!primary).length ||
      !areObjectsEquivalent({}, this.setRestrictions);
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

  static shouldUpgradeMods(target) {
    return target.upgradeMods || target.targetStats.length > 0;
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
    planObject.targetStats = this.targetStats;
    planObject.useOnlyFullSets = this.useOnlyFullSets;

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
      let targetStats;

      if (planJson.targetStats) {
        if (Array.isArray(planJson.targetStats)) {
          targetStats = planJson.targetStats.map(targetStat =>
            new TargetStat(
              targetStat.stat,
              targetStat.type || '+',
              targetStat.minimum,
              targetStat.maximum,
              targetStat.relativeCharacterId || null,
              targetStat.optimizeForTarget
            )
          );
        } else {
          targetStats = [new TargetStat(
            planJson.targetStats.stat,
            planJson.targetStats.type || '+',
            planJson.targetStats.minimum,
            planJson.targetStats.maximum,
            planJson.targetStats.relativeCharacterId || null
          )];
        }
      } else if (planJson.targetStat) {
        targetStats = [new TargetStat(
          planJson.targetStat.stat,
          '+',
          planJson.targetStat.minimum,
          planJson.targetStat.maximum
        )];
      } else {
        targetStats = [];
      }

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
        targetStats,
        planJson.useOnlyFullSets || false
      );
    } else {
      return null;
    }
  }

  /**
   * Generate the priority order string
   *
   * @returns {String} String representing the priority order
   */
  priorityOrderStr() {
    // order name / value (not null)
    const priorityOrder = Object.entries(this)
      .filter(o => o[0].startsWith('raw') && o[1] > 0)  // Filter on "raw****" not null values
      .sort(([,a],[,b]) => b-a)  // ordering by values
      .map(o => [Stat.displayNames[o[0][3].toLowerCase() + o[0].substring(4)], o[1]]) // Get human-friendly name and values

    // Add '>' or '='
    let lastValue = 0;
    let result = [];
    for(const [name, value] of priorityOrder) {
      if (lastValue) {
        result.push(lastValue > value ? '>' : '=');
      }
      lastValue = value;
      result.push(name);
    }

    return result.join(' ');
  }
}

OptimizationPlan.statWeight = {
  'health': 2000,
  'protection': 4000,
  'speed': 20,
  'critDmg': 30,
  'potency': 15,
  'tenacity': 15,
  'physDmg': 300,
  'specDmg': 600,
  'offense': 300,
  'critChance': 10,
  'armor': 33,
  'resistance': 33,
  'accuracy': 10,
  'critAvoid': 10
};

export default OptimizationPlan;
