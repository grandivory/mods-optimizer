// @flow

/**
 * A class to represent the base values of any stats that are modified by mods. All values should be represented as if
 * the character were capped out at 7* g12 but had no mods on.
 */
class CharacterStats {
  /**
   * Constructor for the CharacterStats class
   *
   * @param health Number
   * @param protection Number
   * @param speed Number
   * @param potency Number Character potency, as a percent (0-1)
   * @param tenacity Number Character tenacity, as a percent (0-1)
   * @param physDmg Number
   * @param physCritRating Number
   * @param armor Number
   * @param specDmg Number
   * @param specCritRating Number
   * @param resistance Number
   */
  constructor(health,
    protection,
    speed,
    potency,
    tenacity,
    physDmg,
    physCritRating,
    armor,
    specDmg,
    specCritRating,
    resistance,
    critDmg,
    critAvoid,
    accuracy
  ) {
    // General stats
    this.health = health;
    this.protection = protection;
    this.speed = speed;
    this.potency = potency * 100;
    this.tenacity = tenacity * 100;
    this.critDmg = critDmg * 100;
    this.critAvoid = critAvoid / 24;
    this.accuracy = accuracy / 12;

    // Physical stats
    this.physDmg = physDmg;
    this.physCritRating = physCritRating;
    this.armor = armor;

    // Special stats
    this.specDmg = specDmg;
    this.specCritRating = specCritRating;
    this.resistance = resistance;

    // Derived stats
    this.physCritChance = physCritRating / 24 + 10;
    this.specCritChance = specCritRating / 24 + 10;
  }

  /**
   * Checks to see whether all required stats have valid values
   *
   * @returns boolean
   */
  isValid() {
    return this.isNumberValid(this.health) &&
      this.isNumberValid(this.protection) &&
      this.isNumberValid(this.speed) &&
      this.isNumberValid(this.potency) &&
      this.isNumberValid(this.tenacity) &&
      this.isNumberValid(this.physDmg) &&
      this.isNumberValid(this.physCritRating) &&
      this.isNumberValid(this.armor) &&
      this.isNumberValid(this.specDmg) &&
      this.isNumberValid(this.specCritRating) &&
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

  /**
   * Add two CharacterStats objects together, returning the result in a new object
   * @param that CharacterStats
   */
  plus(that) {
    return new CharacterStats(
      this.health + that.health,
      this.protection + that.protection,
      this.speed + that.speed,
      (this.potency + that.potency) / 100,
      (this.tenacity + that.tenacity) / 100,
      this.physDmg + that.physDmg,
      this.physCritRating + that.physCritRating,
      this.armor + that.armor,
      this.specDmg + that.specDmg,
      this.specCritRating + that.specCritRating,
      this.resistance + that.resistance,
      (this.critDmg + that.critDmg) / 100,
      (this.critAvoid + that.critAvoid) * 24,
      (this.accuracy + that.accuracy) * 12
    )
  }

  serialize() {
    return this;
  }

  static deserialize(baseStatsJson) {
    if (baseStatsJson) {
      return new CharacterStats(
        baseStatsJson.health,
        baseStatsJson.protection,
        baseStatsJson.speed,
        baseStatsJson.potency / 100,
        baseStatsJson.tenacity / 100,
        baseStatsJson.physDmg,
        baseStatsJson.physCritRating,
        baseStatsJson.armor,
        baseStatsJson.specDmg,
        baseStatsJson.specCritRating,
        baseStatsJson.resistance,
        baseStatsJson.critDmg / 100,
        baseStatsJson.critAvoid * 24,
        baseStatsJson.accuracy * 12
      );
    } else {
      return null;
    }
  }
}

const NullCharacterStats = new CharacterStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
Object.freeze(NullCharacterStats);

export default CharacterStats;

export { NullCharacterStats };
