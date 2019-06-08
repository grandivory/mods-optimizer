/**
 * A class to hold static settings for each character that the optimizer knows about.
 */
import OptimizationPlan from "./OptimizationPlan";
import CharacterStats from "./CharacterStats";
import groupByKey from "../utils/groupByKey";

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
    Object.freeze(this);
  }

  serialize() {
    return {
      targets: this.targets.map(target => target.serialize()),
      extraTags: this.extraTags,
      damageType: this.damageType
    };
  }

  static deserialize(settingsJson) {
    if (settingsJson) {
      return new CharacterSettings(
        settingsJson.targets.map(target => OptimizationPlan.deserialize(target, settingsJson.damageType)),
        settingsJson.extraTags,
        settingsJson.damageType
      );
    } else {
      return null;
    }
  }
}

/**
 * Class to hold Character information that doesn't change, except with a game update.
 */
class GameSettings {
  baseID;
  name;
  avatarUrl;
  tags;
  description;

  constructor(baseID,
              name,
              avatarUrl = 'https://swgoh.gg/static/img/assets/blank-character.png',
              tags = [],
              description = ''
  ) {
    this.baseID = baseID;
    this.name = name;
    if (avatarUrl.startsWith('/')) {
      this.avatarUrl = `https://swgoh.gg${avatarUrl}`;
    } else {
      this.avatarUrl = avatarUrl;
    }
    this.tags = tags;
    this.description = description;
    Object.freeze(this);
  }

  serialize() {
    return this;
  }

  static deserialize(settingsJson) {
    if (settingsJson) {
      return new GameSettings(
        settingsJson.baseID,
        settingsJson.name,
        settingsJson.avatarUrl,
        settingsJson.tags,
        settingsJson.description
      );
    } else {
      return null;
    }
  }
}

GameSettings.defaultAvatarUrl = '//swgoh.gg/static/img/assets/blank-character.png';

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
    Object.freeze(this);
  }

  withBaseStats(baseStats) {
    if (baseStats) {
      return new PlayerValues(
        this.level,
        this.stars,
        this.gearLevel,
        this.gearPieces,
        this.galacticPower,
        baseStats,
        this.equippedStats
      );
    } else {
      return this;
    }
  }

  withEquippedStats(equippedStats) {
    if (equippedStats) {
      return new PlayerValues(
        this.level,
        this.stars,
        this.gearLevel,
        this.gearPieces,
        this.galacticPower,
        this.baseStats,
        equippedStats
      );
    } else {
      return this;
    }
  }

  serialize() {
    const baseStats = this.baseStats ? this.baseStats.serialize() : null;
    const equippedStats = this.equippedStats ? this.equippedStats.serialize() : null;

    return {
      level: this.level,
      stars: this.stars,
      gearLevel: this.gearLevel,
      gearPieces: this.gearPieces,
      galacticPower: this.galacticPower,
      baseStats: baseStats,
      equippedStats: equippedStats
    };
  }

  /**
   * Deserialize a PlayerValues object from an swgoh.help API response
   * @param valuesJson {{}}
   * @returns {PlayerValues}
   */
  static fromSwgohHelp(valuesJson) {
    return new PlayerValues(
      valuesJson.level,
      valuesJson.rarity,
      valuesJson.gear,
      valuesJson.equipped.map(gear => ({equipmentId: gear.equipmentId})),
      valuesJson.gp
    );
  }

  static deserialize(valuesJson) {
    if (valuesJson) {
      return new PlayerValues(
        valuesJson.level,
        valuesJson.stars,
        valuesJson.gearLevel,
        valuesJson.gearPieces,
        valuesJson.galacticPower,
        CharacterStats.deserialize(valuesJson.baseStats),
        CharacterStats.deserialize(valuesJson.equippedStats)
      );
    } else {
      return null;
    }
  }
}

class OptimizerSettings {
  target;
  targets;
  minimumModDots;
  sliceMods;
  isLocked;

  /**
   * @param target OptimizationPlan
   * @param targets Array[OptimizationPlan]
   * @param minimumModDots Integer
   * @param sliceMods Boolean
   * @param isLocked Boolean
   */
  constructor(target, targets, minimumModDots, sliceMods, isLocked) {
    this.target = target;
    this.targets = targets;
    this.minimumModDots = minimumModDots;
    this.sliceMods = sliceMods;
    this.isLocked = isLocked;
    Object.freeze(this);
  }

  /**
   * Return a new OptimizerSettings object that matches this one with the target overridden. If the target also exists
   * in the array of targets, then modify it there as well.
   * @param target OptimizationPlan
   */
  withTarget(target) {
    if (!target) {
      return this;
    }

    const targetsObject = groupByKey(this.targets, target => target.name);
    const newTargetsObject = ['lock', 'custom'].includes(target.name) ?
      this.targets :
      Object.assign({}, targetsObject, {[target.name]: target});

    return new OptimizerSettings(
      target,
      Object.values(newTargetsObject),
      this.minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  /**
   * Return a new OptimizerSettings object that matches this one, but with the targets overridden with the passed-in
   * targets. Any targets that match in name will be replaced, and those that don't will be unchanged.
   * @param targets Array[OptimizationPlan]
   */
  withTargetOverrides(targets) {
    const oldTargetsObject = groupByKey(this.targets, target => target.name);
    const newTargetsObject = groupByKey(targets, target => target.name);
    const newTarget = newTargetsObject.hasOwnProperty(this.target.name) ?
      newTargetsObject[this.target.name] :
      this.target;

    return new OptimizerSettings(
      newTarget,
      Object.values(Object.assign({}, oldTargetsObject, newTargetsObject)),
      this.minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  /**
   * Return a new OptimizerSettings object that matches this one, but with the current target deleted, and the next
   * target in the set of targets selected
   */
  withDeletedTarget() {
    const newTargets = this.targets.slice();
    const targetIndex = newTargets.findIndex(target => target.name === this.target.name);
    if (-1 !== targetIndex) {
      newTargets.splice(targetIndex, 1);
    }

    return new OptimizerSettings(
      null,
      newTargets,
      this.minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  lock() {
    return new OptimizerSettings(
      this.target,
      this.targets,
      this.minimumModDots,
      this.sliceMods,
      true
    );
  }

  unlock() {
    return new OptimizerSettings(
      this.target,
      this.targets,
      this.minimumModDots,
      this.sliceMods,
      false
    );
  }

  withMinimumModDots(minimumModDots) {
    return new OptimizerSettings(
      this.target,
      this.targets,
      minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  withModSlicing(sliceMods) {
    return new OptimizerSettings(
      this.target,
      this.targets,
      this.minimumModDots,
      sliceMods,
      this.isLocked
    );
  }

  serialize() {
    return {
      target: this.target.serialize(),
      targets: this.targets.map(target => target.serialize()),
      minimumModDots: this.minimumModDots,
      sliceMods: this.sliceMods,
      isLocked: this.isLocked
    };
  }

  static deserialize(settingsJson) {
    if (settingsJson) {
      let minimumModDots;

      if (settingsJson.minimumModDots) {
        minimumModDots = settingsJson.minimumModDots;
      } else if (settingsJson.useOnly5DotMods) {
        minimumModDots = 5;
      } else {
        minimumModDots = 1;
      }

      return new OptimizerSettings(
        OptimizationPlan.deserialize(settingsJson.target),
        settingsJson.targets.map(OptimizationPlan.deserialize),
        minimumModDots,
        settingsJson.sliceMods || false,
        settingsJson.isLocked
      );
    } else {
      return null;
    }
  }
}

export {CharacterSettings, GameSettings, PlayerValues, OptimizerSettings, DamageType};
