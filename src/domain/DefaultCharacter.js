import Character from "./Character";
import OptimizationPlan from "./OptimizationPlan";
import BaseStats from "./BaseStats";

class DefaultCharacter extends Character {
  constructor(name) {
    super(
      name,
      '',
      1,
      1,
      1,
      [],
      0,
      1,
      new BaseStats(),
      new BaseStats(),
      new OptimizationPlan(),
      {},
      [],
      [],
      false,
      false
    )
  }
}

export default DefaultCharacter;
