export default class TargetStat {
  stat; // {String} The type of stat being targeted
  minimum; // {Number} The minimum value for the stat
  maximum; // {Number} The maximum value for the stat

  constructor(stat, minimum, maximum) {
    this.stat = stat;
    this.minimum = minimum;
    this.maximum = maximum;

    Object.freeze(this);
  }
}
