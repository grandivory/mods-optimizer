import SetBonus from "../domain/SetBonus";
import Stat from "../domain/Stat";

let setsArray = [
  new SetBonus('health', 2, new Stat('Health', '5%')),
  new SetBonus('defense', 2, new Stat('Defense', '5%')),
  new SetBonus('critdamage', 4, new Stat('Critical Damage', '30%')),
  new SetBonus('critchance', 2, new Stat('Critical Chance', '5%')),
  new SetBonus('tenacity', 2, new Stat('Tenacity', '10%')),
  new SetBonus('offense', 4, new Stat('Offense', '10%')),
  new SetBonus('potency', 2, new Stat('Potency', '10%')),
  new SetBonus('speed', 4, new Stat('Speed', '10%'))
];

const setBonuses = {};

for (let set of setsArray) {
  setBonuses[set.name] = set;
}

Object.freeze(setBonuses);

export default setBonuses;
