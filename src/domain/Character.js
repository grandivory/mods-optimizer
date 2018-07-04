import BaseStats from "./BaseStats";
import OptimizationPlan from "./OptimizationPlan";

class Character {
  constructor(name, level, starLevel, gearLevel, baseStats, optimizationPlan, tags, extraTags, useOnly5DotMods) {
    this.name = name;
    this.level = level;
    this.starLevel = starLevel;
    this.gearLevel = gearLevel;
    this.baseStats = baseStats;
    this.optimizationPlan = optimizationPlan;
    this.tags = tags;
    this.extraTags = extraTags;
    this.useOnly5DotMods = useOnly5DotMods || false;
  }

  /**
   * Checks whether this character matches a given filter string in name or tags
   * @param filterString string The string to filter by
   * @returns boolean
   */
  matchesFilter(filterString) {
    return this.name.toLowerCase().includes(filterString) ||
      (this.tags || []).concat(this.extraTags || []).some(tag => tag.toLowerCase().includes(filterString))
  }

  serialize() {
    let characterObject = {};

    characterObject.name = this.name;
    characterObject.level = this.level;
    characterObject.starLevel = this.starLevel;
    characterObject.gearLevel = this.gearLevel;
    characterObject.baseStats = this.baseStats.serialize();
    characterObject.optimizationPlan = this.optimizationPlan.serialize();
    characterObject.useOnly5DotMods = this.useOnly5DotMods;

    return characterObject;
  }

  static deserialize(characterJson) {
    return new Character(
      characterJson.name,
      characterJson.level,
      characterJson.starLevel || 7,
      characterJson.gearLevel || 11,
      BaseStats.deserialize(characterJson.baseStats),
      OptimizationPlan.deserialize(characterJson.optimizationPlan),
      [],
      [],
      characterJson.useOnly5DotMods
    );
  }
}

class SimpleCharacter extends Character {
  constructor(name, baseStats, optimizationPlan, tags, extraTags, useOnly5dotMods) {
    super(name, 85, 7, 12, baseStats, optimizationPlan, tags, extraTags, useOnly5dotMods);
  }
}

export default Character;

export {SimpleCharacter};
