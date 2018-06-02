import BaseStats from "./BaseStats";
import OptimizationPlan from "./OptimizationPlan";

class Character{
  constructor(name, baseStats, optimizationPlan, tags, extraTags, useOnly5DotMods) {
    this.name = name;
    this.baseStats = baseStats;
    this.optimizationPlan = optimizationPlan;
    this.tags = tags;
    this.extraTags = extraTags;
    this.useOnly5DotMods = useOnly5DotMods || false;
  }

  serialize() {
    let characterObject = {};

    characterObject.name = this.name;
    characterObject.baseStats = this.baseStats.serialize();
    characterObject.optimizationPlan = this.optimizationPlan.serialize();
    characterObject.useOnly5DotMods = this.useOnly5DotMods;

    return characterObject;
  }

  static deserialize(characterJson) {
    return new Character(
      characterJson.name,
      BaseStats.deserialize(characterJson.baseStats),
      OptimizationPlan.deserialize(characterJson.optimizationPlan),
      [],
      [],
      characterJson.useOnly5DotMods
    );
  }
}

export default Character;
