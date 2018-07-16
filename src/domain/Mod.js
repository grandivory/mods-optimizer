import setBonuses from "../constants/setbonuses";
import Stat from "./Stat";
import Character from "./Character";

class Mod {
  constructor(id, slot, set, level, pips, primaryStat, secondaryStats, currentCharacter, assignTo) {
    this.id = id;
    this.slot = slot;
    this.set = set;
    this.level = level;
    this.pips = pips;
    this.primaryStat = primaryStat;
    this.secondaryStats = secondaryStats;
    this.currentCharacter = currentCharacter ? currentCharacter : null;
    this.assignTo = assignTo ? assignTo : null;
  }

  /**
   * Given a stat classifier, apply the proper class to each secondary stat this mod has.
   * @param statClassifier
   */
  classifyStats(statClassifier) {
    for (let j = 0; j < this.secondaryStats.length; j++) {
      let stat = this.secondaryStats[j];
      stat.setClass(statClassifier.classify(stat));
    }
  }

  /**
   * Convert this mod to a simple JSON object so that it can be stringified
   */
  serialize() {
    let modObject = {};

    [modObject.primaryBonusType, modObject.primaryBonusValue] = this.primaryStat.serialize();

    for (let i = 0; i < 4; i++) {
      if (i < this.secondaryStats.length) {
        [modObject[`secondaryType_${i+1}`], modObject[`secondaryValue_${i+1}`]] = this.secondaryStats[i].serialize();
      } else {
        modObject[`secondaryType_${i+1}`] = '';
        modObject[`secondaryValue_${i+1}`] = '';
      }
    }

    modObject.mod_uid = this.id;
    modObject.slot = this.slot;
    modObject.set = this.set.name;
    modObject.level = this.level;
    modObject.pips = this.pips;
    modObject.characterName = this.currentCharacter ? this.currentCharacter.name : '';

    if (this.assignTo) {
      modObject.assignTo = this.assignTo.name;
    }

    return modObject;
  }

  /**
   * Deserialize a JSON representation of a mod into a new mod
   *
   * @param modJson
   * @param characters Object An object, keyed by character name, of all possible characters
   *
   * @return Mod
   */
  static deserialize(modJson, characters) {
    const primaryStat = new Stat(modJson.primaryBonusType, modJson.primaryBonusValue);
    let secondaryStats = [];

    if ('None' !== modJson.secondaryType_1 && '' !== modJson.secondaryValue_1) {
      secondaryStats.push(new Stat(modJson.secondaryType_1, modJson.secondaryValue_1));
    }
    if ('None' !== modJson.secondaryType_2 && '' !== modJson.secondaryValue_2) {
      secondaryStats.push(new Stat(modJson.secondaryType_2, modJson.secondaryValue_2));
    }
    if ('None' !== modJson.secondaryType_3 && '' !== modJson.secondaryValue_3) {
      secondaryStats.push(new Stat(modJson.secondaryType_3, modJson.secondaryValue_3));
    }
    if ('None' !== modJson.secondaryType_4 && '' !== modJson.secondaryValue_4) {
      secondaryStats.push(new Stat(modJson.secondaryType_4, modJson.secondaryValue_4));
    }

    const currentCharacter = ('' !== modJson.characterName && 'UNASSIGNED' !== modJson.characterName) ?
      characters[modJson.characterName.replace(/&amp;#39;/g, "'")] ||
      Character.defaultCharacter(modJson.characterName) :
      null;

    const assignTo = modJson.assignTo ?
      characters[modJson.assignTo] || Character.defaultCharacter(modJson.assignTo) :
      null;

    const setBonus = setBonuses[modJson.set.toLowerCase().replace(' ', '')];

    return new Mod(
      modJson.mod_uid,
      modJson.slot.toLowerCase(),
      setBonus,
      modJson.level,
      modJson.pips,
      primaryStat,
      secondaryStats,
      currentCharacter,
      assignTo
    );
  }
}

export default Mod;
