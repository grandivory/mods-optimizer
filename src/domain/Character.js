import BaseStats from "./BaseStats";
import OptimizationPlan from "./OptimizationPlan";

class Character{
  constructor(name, baseStats, optimizationPlan, tags, extraTags) {
    this.name = name;
    this.baseStats = baseStats;
    this.optimizationPlan = optimizationPlan;
    this.tags = tags;
    this.extraTags = extraTags;
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
    characterObject.baseStats = this.baseStats.serialize();
    characterObject.optimizationPlan = this.optimizationPlan.serialize();

    return characterObject;
  }

  static deserialize(characterJson) {
    return new Character(
      characterJson.name,
      BaseStats.deserialize(characterJson.baseStats),
      OptimizationPlan.deserialize(characterJson.optimizationPlan)
    );
  }
}

export default Character;
