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
   * @param physDmgPercent Number The percent of total offense that the character uses for physical damage (0-1, the
   *                              rest is considered special damage)
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
              physDmgPercent
  ) {
    // General stats
    this.health = health;
    this.protection = protection;
    this.speed = speed;
    this.potency = potency * 100;
    this.tenacity = tenacity * 100;

    // Physical stats
    this.physDmg = physDmg;
    this.physCritRating = physCritRating;
    this.armor = armor;

    // Special stats
    this.specDmg = specDmg;
    this.specCritRating = specCritRating;
    this.resistance = resistance;

    // Derived stats
    this.physDmgPercent = physDmgPercent;
    this.offense = physDmg * physDmgPercent + specDmg * (1 - physDmgPercent);
    this.physCritChance = physCritRating / 24 + 10;
    this.specCritChance = specCritRating / 24 + 10;

    // Constant stats
    this.critDmg = 150;
    this.accuracy = 0;
    this.critAvoid = 0;
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
      this.isNumberValid(this.resistance) &&
      this.isNumberValid(this.physDmgPercent);
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
    baseStatsObject.speed = this.speed;
    baseStatsObject.potency = this.potency;
    baseStatsObject.tenacity = this.tenacity;
    baseStatsObject.physDmg = this.physDmg;
    baseStatsObject.physCritRating = this.physCritRating;
    baseStatsObject.armor = this.armor;
    baseStatsObject.specDmg = this.specDmg;
    baseStatsObject.specCritRating = this.specCritRating;
    baseStatsObject.resistance = this.resistance;
    baseStatsObject.physDmgPercent = this.physDmgPercent;

    return baseStatsObject;
  }

  static deserialize(baseStatsJson) {
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
      baseStatsJson.physDmgPercent
    );
  }
}

const NullCharacterStats = new CharacterStats(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
Object.freeze(NullCharacterStats);

export default CharacterStats;

export {NullCharacterStats};
