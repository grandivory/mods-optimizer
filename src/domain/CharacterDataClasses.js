/**
 * A class to hold static settings for each character that the optimizer knows about.
 */
import {mapObject} from "../utils/mapObject";

class CharacterSettings {
  targets;
  extraTags;
  damageType;

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

  serialize() {
    return {
      targets: mapObject(this.targets, target => target.serialize()),
      extraTags: this.extraTags,
      damageType: this.damageType
    };
  }
}

/**
 * Class to hold Character information that doesn't change, except with a game update.
 */
class GameSettings {
  name;
  avatarUrl;
  tags;
  description;

  constructor(name, avatarUrl, tags, description) {
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.tags = tags;
    this.description = description;
  }

  serialize() {
    return this;
  }
}

const DamageType = {
  'physical': 1,
  'special': 0,
  'mixed': .5
};

Object.freeze(DamageType);

class PlayerValues {
  level;
  stars;
  gearLevel;
  gearPieces;
  galacticPower;
  baseStats;
  equippedStats;

  /**
   * @param level int
   * @param stars int
   * @param gearLevel int
   * @param gearPieces Array
   * @param galacticPower int
   * @param baseStats CharacterStats
   * @param equippedStats CharacterStats
   */
  constructor(level, stars, gearLevel, gearPieces, galacticPower, baseStats = null, equippedStats = null) {
    this.level = level;
    this.stars = stars;
    this.gearLevel = gearLevel;
    this.gearPieces = gearPieces;
    this.galacticPower = galacticPower;
    this.baseStats = baseStats;
    this.equippedStats = equippedStats;
  }

  serialize() {
    return this;
  }
}

class OptimizerSettings {
  target;
  targets;
  useOnly5DotMods;
  isLocked;

  /**
   * @param target OptimizationPlan
   * @param targets Array[OptimizationPlan]
   * @param useOnly5DotMods Boolean
   * @param isLocked Boolean
   */
  constructor(target, targets, useOnly5DotMods, isLocked) {
    this.target = target;
    this.targets = targets;
    this.useOnly5DotMods = useOnly5DotMods;
    this.isLocked = isLocked;
  }

  serialize() {
    return {
      target: this.target.serialize(),
      targets: this.targets.map(target => target.serialize()),
      useOnly5DotMods: this.useOnly5DotMods,
      isLocked: this.isLocked
    };
  }
}

export {CharacterSettings, GameSettings, PlayerValues, OptimizerSettings, DamageType};
