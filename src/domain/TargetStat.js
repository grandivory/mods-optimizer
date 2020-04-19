export default class TargetStat {
  stat; // {String} The type of stat being targeted
  type; // {String} The operation to apply to the min and max (* or +)
  minimum; // {TargetValue} The minimum value for the stat
  maximum; // {TargetValue} The maximum value for the stat
  relativeCharacterId; // {String} A character to use as a basis for this target

  /**
   * {Boolean} Whether to run the optimization against this target (true) or
   *           only report against it in results (false)
   */
  optimizeForTarget;


  constructor(stat, type, minimum, maximum, relativeCharacterId = null, optimizeForTarget = true) {
    this.stat = stat;
    this.type = type;
    this.minimum = minimum;
    this.maximum = maximum;
    this.relativeCharacterId = relativeCharacterId;
    this.optimizeForTarget = optimizeForTarget;

    Object.freeze(this);
  }
}
