/**
 * A class to represent the base values of any stats that are modified by mods. All values should be represented as if
 * the character were capped out at 7* g12 but had no mods on.
 */
class BaseStats {
  /**
   * Constructor for the BaseStats class
   *
   * @param speed The base speed of the character
   * @param offense The value to use as the base "offense" of the character. This should be a combination of physical
   *    damage and special damage modified by how the character's abilities are spread among the two
   * @param potency The base potency of the character
   * @param health The base health pool of the character
   * @param defense The value to use as the base "defense" of the character. This should be a combination of armor and
   *     resistance
   * @param tenacity The base tenacity of the character
   * @param protection The base protection of the character
   */
  constructor(speed, offense, potency, health, defense, tenacity, protection) {
    this.speed = speed;
    this.offense = offense;
    this.potency = potency;
    this.health = health;
    this.defense = defense;
    this.tenacity = tenacity;
    this.protection = protection;
  }
}

export default BaseStats;
