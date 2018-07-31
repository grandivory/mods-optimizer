import statTypeMap from "../constants/statTypeMap";

class Stat {
  constructor(type, value) {
    this.displayModifier = type.endsWith('%') || value.endsWith('%') ? '%' : '';
    this.type = type;
    this.displayType = type.endsWith('%') ? type.substr(0, type.length - 1).trim() : type;
    this.displayValue = value.replace(/[+%]/g, '');
    this.value = +this.displayValue;
    this.isPercent = '%' === this.displayModifier && Stat.mixedTypes.includes(this.displayType);
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
    this.displayValue = `${this.value % 1 ? Math.round(this.value * 100) / 100 : this.value}`;
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
    const percent = (this.isPercent || !Stat.mixedTypes.includes(this.displayType)) &&
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
    const statTypes = statTypeMap[this.displayType];

    if (this.isPercent) {
      return statTypes.map(statType =>
        character.optimizationPlan[statType] * Math.floor(character.baseStats[statType] * this.value / 100)
      ).reduce((a, b) => a + b, 0);
    } else {
      return statTypes.map(statType =>
        character.optimizationPlan[statType] * this.value
      ).reduce((a, b) => a + b, 0);
    }
  }
}

// A list of stat types that can be either a flat value or a percent
Stat.mixedTypes = ['Health',
  'Protection',
  'Offense',
  'Physical Damage',
  'Special Damage',
  'Speed',
  'Defense',
  'Armor',
  'Resistance'];

// A map from the internal name to a more human-friendly name for each stat type
Stat.displayNames = {
  'health': 'Health',
  'protection': 'Protection',
  'speed': 'Speed',
  'critDmg': 'Critical Damage',
  'potency': 'Potency',
  'tenacity': 'Tenacity',
  'physDmg': 'Physical Damage',
  'specDmg': 'Special Damage',
  'critChance': 'Critical Chance',
  'physCritChance': 'Physical Critical Chance',
  'specCritChance': 'Special Critical Chance',
  'defense': 'Defense',
  'armor': 'Armor',
  'resistance': 'Resistance',
  'accuracy': 'Accuracy',
  'critAvoid': 'Critical Avoidance',
  'physCritAvoid': 'Physical Critical Avoidance',
  'specCritAvoid': 'Special Critical Avoidance'
};

export default Stat;
