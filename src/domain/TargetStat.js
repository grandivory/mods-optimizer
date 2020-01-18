export default class TargetStat {
  stat; // {String} The type of stat being targeted
  type; // {String} The operation to apply to the min and max (* or +)
  minimum; // {TargetValue} The minimum value for the stat
  maximum; // {TargetValue} The maximum value for the stat
  relativeCharacterId; // {String} A character to use as a basis for this target

  constructor(stat, type, minimum, maximum, relativeCharacterId = null) {
    this.stat = stat;
    this.type = type;
    this.minimum = minimum;
    this.maximum = maximum;
    this.relativeCharacterId = relativeCharacterId;

    Object.freeze(this);
  }
}
