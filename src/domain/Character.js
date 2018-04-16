import BaseStats from "./BaseStats";
import OptimizationPlan from "./OptimizationPlan";

class Character{
  constructor(name, baseStats, optimizationPlan) {
    this.name = name;
    this.baseStats = baseStats;
    this.optimizationPlan = optimizationPlan;
  }

  serialize() {
    let characterObject = {};

    characterObject.name = this.name;
    characterObject.baseStats = this.baseStats.serialize();
    characterObject.optimizationPlan = this.optimizationPlan.serialize();

    return characterObject;
  }

  static deserialize(characterJson) {
    console.log(characterJson);
    return new Character(
      characterJson.name,
      BaseStats.deserialize(characterJson.baseStats),
      OptimizationPlan.deserialize(characterJson.optimizationPlan)
    );
  }
}

export default Character;
