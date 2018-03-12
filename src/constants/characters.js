import Character from "../domain/Character";
import BaseStats from "../domain/BaseStats";

let charactersArray = [
  new Character('Aayla Secura', new BaseStats(125, 2756, 41, 26236, (291+116)/2, 41, 28731)),
  new Character('Admiral Ackbar', new BaseStats(119, 2642, 36, 26856, (301+222)/2, 40, 19200)),
  new Character('Colonel Starck', new BaseStats(155, 2264, 40, 28193, (291+133)/2, 25, 33480)),
  new Character('Royal Guard', new BaseStats(110, 2608, 44, 32248, (371+313)/2, 39, 38614))
];

const characters = {};

for (let i = 0; i < charactersArray.length; i++) {
  characters[charactersArray[i].name] = charactersArray[i];
}

export default characters;
