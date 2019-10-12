export default class TargetStat {
  stat; // {String} The type of stat being targeted
  minimum; // {Number} The minimum value for the stat
  maximum; // {Number} The maximum value for the stat
  relativeCharacterId; // {String} A character to use as a basis for this target

  constructor(stat, minimum, maximum, relativeCharacterId = null) {
    this.stat = stat;
    this.minimum = minimum;
    this.maximum = maximum;
    this.relativeCharacterId = relativeCharacterId;

    Object.freeze(this);
  }
}
