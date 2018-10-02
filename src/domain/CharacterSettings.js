/**
 * A class to hold static settings for each character that the optimizer knows about.
 */
class CharacterSettings {
  /**
   * @param targets Array(OptimizationPlan) A default list of optimization targets to apply to a character. The first
   *                                        target is the default selected target when loading a character for the first
   *                                        time.
   * @param extraTags Array(String) A list of tags that are searchable for a character, even though they are not listed
   *                                in-game.
   * @param damageType DamageType The type of damage done by this character. This is only used to convert very old
   *                              optimization targets to a more recent format.
   */
  constructor(targets = [], extraTags = [], damageType = DamageType.physical) {
    this.targets = targets;
    this.extraTags = extraTags;
    this.damageType = damageType;
  }
}

const DamageType = {
  'physical': 1,
  'special': 0,
  'mixed': .5
};

Object.freeze(DamageType);

export default CharacterSettings;

export {DamageType};
