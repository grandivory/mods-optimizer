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
    const percent = this.isPercent && !this.type.includes('%') ? '%' : '';

    return [this.type, `+${this.displayValue}${percent}`];
  }

  /**
   * Get the value of this stat for optimization
   *
   * @param optimizationPlan
   * @param character
   */
  getOptimizationValue(optimizationPlan, character) {
    const statType = statTypeMap[this.displayType];
    if (this.isPercent) {
      return optimizationPlan[statType] * Math.floor(character.baseStats[statType] * this.value / 100);
    } else {
      return optimizationPlan[statType] * this.value
    }
  }
}

Stat.percentTypes = ['Health', 'Protection', 'Offense', 'Speed', 'Defense'];

export default Stat;
