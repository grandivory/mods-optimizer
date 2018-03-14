class ModSet {
  /**
   * Instantiate a new Mod set
   *
   * @param name string The name of the set
   * @param numberOfModsRequired int The number of mods of the same set required to receive the set bonus
   * @param bonus Stat the bonus that is received if the set is fulfilled
   */
  constructor(name, numberOfModsRequired, bonus) {
    this.name = name;
    this.numberOfModsRequired = numberOfModsRequired;
    this.bonus = bonus;
  }
}

export default ModSet;
