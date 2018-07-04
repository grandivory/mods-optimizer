import Character from "./Character";
import OptimizationPlan from "./OptimizationPlan";
import BaseStats from "./BaseStats";

class DefaultCharacter extends Character {
  constructor(name) {
    super(name, 85, 7, 12, new BaseStats(), new OptimizationPlan(), [], [], false)
  }
}

export default DefaultCharacter;
