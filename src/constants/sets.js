import ModSet from "../domain/ModSet";
import Stat from "../domain/Stat";

let setsArray = [
  new ModSet('health', 2, new Stat('Health', '5%')),
  new ModSet('defense', 2, new Stat('Defense', '5%')),
  new ModSet('critdamage', 4, new Stat('Critical Damage', '30%')),
  new ModSet('critchance', 2, new Stat('Critical Chance', '5%')),
  new ModSet('tenacity', 2, new Stat('Tenacity', '10%')),
  new ModSet('offense', 4, new Stat('Offense', '10%')),
  new ModSet('potency', 2, new Stat('Potency', '10%')),
  new ModSet('speed', 4, new Stat('Speed', '10%'))
];

const modSets = {};

for (let i = 0; i < setsArray.length; i++) {
  modSets[setsArray[i].name] = setsArray[i];
}

Object.freeze(modSets);

export default modSets;
