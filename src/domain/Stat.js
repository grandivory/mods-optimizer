import statTypeMap from "../constants/statTypeMap";

class Stat {
  constructor(type, value) {
    this.displayModifier = type.endsWith('%') || value.endsWith('%') ? '%' : '';
    this.type = type;
    this.displayType = type.endsWith('%') ? type.substr(0, type.length - 1).trim() : type;
    this.displayValue = value.replace(/[+%]/g, '');
    this.value = +this.displayValue;
    this.isPercent = '%' === this.displayModifier && Stat.percentTypes.includes(this.displayType);
  }

  /**
   * Set a class value on this stat
   *
   * @param clazz string The class to associate with this stat
   */
  setClass(clazz) {
    this.class = clazz;
  }

  /**
   * Update the displayed value for this stat to match the value held in the stat. This is useful if the stat
   * value was updated
   */
  updateDisplayValue() {
    this.displayValue = `${this.value}`;
  }

  /**
   * Return a string that represents this stat
   */
  show() {
    return `${this.showValue()} ${this.displayType}`;
  }

  /**
   * Return only the value of this stat as a string
   * @returns {string}
   */
  showValue() {
    return `${this.displayValue}${this.displayModifier}`;
  }

  /**
   * Extract the type and value of this stat for serialization
   */
  serialize() {
    const percent = (this.isPercent || !Stat.percentTypes.includes(this.displayType)) &&
    !this.type.includes('%') ? '%' : '';

    return [this.type, `+${this.displayValue}${percent}`];
  }

  /**
   * Take the difference between this stat and that stat
   *
   * @param that Stat
   * @returns Stat with the same type and a value representing the difference
   */
  minus(that) {
    if (!(that instanceof Stat)) {
      throw new Error("Can't take the difference between a Stat and a non-Stat");
    }
    if (that.type !== this.type) {
      throw new Error("Can't take the difference between Stats of different types");
    }
    let valueDiff = this.value - that.value;
    if (valueDiff % 1) {
      valueDiff = `${valueDiff.toFixed(2)}`;
    } else {
      valueDiff = `${valueDiff}`;
    }

    return new Stat(this.type, `${valueDiff}${this.displayModifier}`)
  }

  /**
   * Get the value of this stat for optimization
   *
   * @param character
   */
  getOptimizationValue(character) {
    const statType = statTypeMap[this.displayType];
    if (this.isPercent) {
      return character.optimizationPlan[statType] * Math.floor(character.baseStats[statType] * this.value / 100);
    } else {
      return character.optimizationPlan[statType] * this.value
    }
  }
}

Stat.percentTypes = ['Health', 'Protection', 'Offense', 'Speed', 'Defense'];

export default Stat;
