// @flow

class StatClassifier {
  classes = ['D', 'C', 'B', 'A', 'S'];

  constructor(statRanges) {
    this.statRanges = statRanges;
  }

  /**
   * Given the type and value of a stat, return a categorization class for that stat ranging from 'D' for the worst
   * values up to 'S' for the best ones
   *
   * @param Stat stat
   * @returns {string}
   */
  classify(stat) {
    const statRange = this.statRanges[stat.type];
    const step = (statRange.max - statRange.min)/this.classes.length;

    const classIndex = Math.floor((stat.value - statRange.min)/step);
    return stat.value === statRange.max ? this.classes[this.classes.length - 1] : this.classes[classIndex];
  }
}

export default StatClassifier;
