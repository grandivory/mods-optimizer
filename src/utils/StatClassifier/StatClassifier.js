class StatClassifier {
  classes = ['D', 'C', 'B', 'A', 'S'];

  constructor(statRanges) {
    this.statRanges = statRanges;
  }

  /**
   * Given the type and value of a stat, return a categorization class for that stat ranging from 'D' for the worst
   * values up to 'S' for the best ones
   *
   * @param value string
   * @param type string
   * @returns {string}
   */
  classify(value, type) {
    if ('' === value) {
      return '';
    }

    const statRange = this.statRanges[type];
    const step = (statRange.max - statRange.min)/this.classes.length;
    const statValue = +value.replace(/[+%]/g, '');

    const classIndex = Math.floor((statValue - statRange.min)/step);
    return statValue === statRange.max ? this.classes[this.classes.length - 1] : this.classes[classIndex];
  }
}

export default StatClassifier;
