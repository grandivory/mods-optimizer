/**
 * A class to represent the base values of any stats that are modified by mods. All values should be represented as if
 * the character were capped out at 7* g12 but had no mods on.
 */
class BaseStats {
  /**
   * Constructor for the BaseStats class
   *
   * @param health The base health pool of the character
   * @param protection The base protection of the character
   * @param physDmg The physical damage of the character
   * @param specDmg The special damage of the character
   * @param physDmgPercent The percent of total offense that the character uses for physical damage (the rest is
   *  considered special damage)
   * @param speed The base speed of the character
   * @param armor The armor of the character
   * @param resistance The resistance of the character
   */
  constructor(health, protection, physDmg, specDmg, physDmgPercent, speed, armor, resistance) {
    this.health = health;
    this.protection = protection;
    this.offense = physDmg * physDmgPercent + specDmg * (1 - physDmgPercent);
    this.speed = speed;
    this.defense = (armor + resistance) / 2;

    this.physDmg = physDmg;
    this.specDmg = specDmg;
    this.physDmgPercent = physDmgPercent;

    this.armor = armor;
    this.resistance = resistance;
  }

  /**
   * Checks to see whether all required stats have valid values
   *
   * @returns boolean
   */
  isValid() {
    return this.isNumberValid(this.health) &&
      this.isNumberValid(this.protection) &&
      this.isNumberValid(this.offense) &&
      this.isNumberValid(this.speed) &&
      this.isNumberValid(this.defense) &&
      this.isNumberValid(this.physDmg) &&
      this.isNumberValid(this.specDmg) &&
      this.isNumberValid(this.physDmgPercent) &&
      this.isNumberValid(this.armor) &&
      this.isNumberValid(this.resistance);
  }

  /**
   * Check a single value to see whether it is a valid number (defined, not null, not NaN)
   *
   * @param number
   * @returns boolean
   */
  isNumberValid(number) {
    return typeof number !== 'undefined' && null !== number && !isNaN(number);
  }

  serialize() {
    let baseStatsObject = {};

    baseStatsObject.health = this.health;
    baseStatsObject.protection = this.protection;
    baseStatsObject.physDmg = this.physDmg;
    baseStatsObject.specDmg = this.specDmg;
    baseStatsObject.physDmgPercent = this.physDmgPercent;
    baseStatsObject.speed = this.speed;
    baseStatsObject.armor = this.armor;
    baseStatsObject.resistance = this.resistance;

    return baseStatsObject;
  }

  static deserialize(baseStatsJson) {
    return new BaseStats(
      baseStatsJson.health,
      baseStatsJson.protection,
      baseStatsJson.physDmg,
      baseStatsJson.specDmg,
      baseStatsJson.physDmgPercent,
      baseStatsJson.speed,
      baseStatsJson.armor,
      baseStatsJson.resistance
    );
  }
}

const NullBaseStats = new BaseStats(0, 0, 0, 0, 0, 0, 0, 0);
Object.freeze(NullBaseStats);

export default BaseStats;

export {NullBaseStats};
