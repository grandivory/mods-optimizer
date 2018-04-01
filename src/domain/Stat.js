class Stat {
  constructor(type, value) {
    this.displayModifier = type.endsWith('%') || value.endsWith('%') ? '%' : '';
    this.type = type;
    this.displayType = type.endsWith('%') ? type.substr(0, type.length - 1).trim() : type;
    this.value = +value.replace(/[+%]/g, '');
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
    return `${this.value}${this.displayModifier}`;
  }
}

Stat.percentTypes = ['Health', 'Protection', 'Offense', 'Speed', 'Defense'];

export default Stat;
