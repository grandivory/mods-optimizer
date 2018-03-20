import Character from "../domain/Character";
import BaseStats from "../domain/BaseStats";

let charactersArray = [
  new Character('Aayla Secura', new BaseStats(26236, 28731, 2756, 125, (291+116)/2)),
  new Character('Admiral Ackbar', new BaseStats(26856, 19200, 2642, 119, (301+222)/2)),
  new Character('Colonel Starck', new BaseStats(28193, 33480, 2264, 155, (291+133)/2)),
  new Character('Royal Guard', new BaseStats(32248, 38614, 2608, 110, (371+313)/2)),
  new Character('Darth Vader', new BaseStats(26646, 35283, 2514, 121, (371+334)/2))
];

const characters = {};

for (let character of charactersArray) {
  characters[character.name] = character;
}

Object.freeze(characters);

export default characters;
