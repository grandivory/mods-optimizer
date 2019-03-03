// @flow

class SetBonus {
  /**
   * Instantiate a new Mod set
   *
   * @param name {string} The name of the set
   * @param numberOfModsRequired {number} The number of mods of the same set required to receive the set bonus
   * @param smallBonus {Stat} the bonus that is received if the set is fulfilled below level 15
   * @param maxBonus {Stat} the bonus that is received if the set is fulfilled at level 15
   */
  constructor(name, numberOfModsRequired, smallBonus, maxBonus) {
    this.name = name;
    this.numberOfModsRequired = numberOfModsRequired;
    this.smallBonus = smallBonus;
    this.maxBonus = maxBonus;
  }
}

export default SetBonus;
