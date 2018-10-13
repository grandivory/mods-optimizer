// @flow

import setBonuses from "../constants/setbonuses";
import Stat from "./Stat";
import groupByKey from "../utils/groupByKey";
import {modSets, modSlots} from "../constants/enums";

class Mod {
  id;
  slot;
  set;
  level;
  pips;
  primaryStat;
  secondaryStats;
  characterID;
  tier;

  constructor(id, slot, set, level, pips, primaryStat, secondaryStats, characterID, tier = 1) {
    this.id = id;
    this.slot = slot;
    this.set = set;
    this.level = level;
    this.pips = pips;
    this.primaryStat = primaryStat;
    this.secondaryStats = secondaryStats;
    this.characterID = characterID;
    this.tier = tier;
  }

  equip(characterID) {
    this.characterID = characterID;
    return this;
  }

  unequip() {
    this.characterID = null;
    return this;
  }

  /**
   * Convert this mod to a simple JSON object so that it can be stringified
   */
  serialize() {
    let modObject = {};

    [modObject.primaryBonusType, modObject.primaryBonusValue] = this.primaryStat.serialize();

    for (let i = 0; i < 4; i++) {
      if (i < this.secondaryStats.length) {
        [
            modObject[`secondaryType_${i+1}`],
            modObject[`secondaryValue_${i+1}`],
            modObject[`secondaryRoll_${i+1}`]
        ] = this.secondaryStats[i].serialize();
      } else {
        modObject[`secondaryType_${i+1}`] = '';
        modObject[`secondaryValue_${i+1}`] = '';
        modObject[`secondaryRoll_${i+1}`] = '';
      }
    }

    modObject.mod_uid = this.id;
    modObject.slot = this.slot;
    modObject.set = this.set.name;
    modObject.level = this.level;
    modObject.pips = this.pips;
    modObject.characterID = this.characterID;
    modObject.tier = this.tier;

    return modObject;
  }

  /**
   * Deserialize a Mod object from a response from swgoh.help
   * @param modJson {{}}
   * @param characterID {string}
   * @returns {Mod}
   */
  static fromSwgohHelp(modJson, characterID) {
      return new Mod(
        modJson.id,
        modSlots[modJson.slot],
        setBonuses[modSets[modJson.set]],
        modJson.level,
        modJson.pips,
        Stat.fromSwgohHelp(modJson.primaryStat),
        modJson.secondaryStat.map(Stat.fromSwgohHelp),
        characterID,
        modJson.tier
      );
  }

  static deserialize(modJson) {
    const primaryStat = new Stat(modJson.primaryBonusType, modJson.primaryBonusValue);
    let secondaryStats = [];

    if ('None' !== modJson.secondaryType_1 && '' !== modJson.secondaryValue_1) {
      secondaryStats.push(new Stat(modJson.secondaryType_1, modJson.secondaryValue_1, +modJson.secondaryRoll_1 || 1));
    }
    if ('None' !== modJson.secondaryType_2 && '' !== modJson.secondaryValue_2) {
      secondaryStats.push(new Stat(modJson.secondaryType_2, modJson.secondaryValue_2, +modJson.secondaryRoll_2 || 1));
    }
    if ('None' !== modJson.secondaryType_3 && '' !== modJson.secondaryValue_3) {
      secondaryStats.push(new Stat(modJson.secondaryType_3, modJson.secondaryValue_3, +modJson.secondaryRoll_3 || 1));
    }
    if ('None' !== modJson.secondaryType_4 && '' !== modJson.secondaryValue_4) {
      secondaryStats.push(new Stat(modJson.secondaryType_4, modJson.secondaryValue_4, +modJson.secondaryRoll_4 || 1));
    }

    const setBonus = setBonuses[modJson.set.toLowerCase().replace(' ', '')];

    return new Mod(
      modJson.mod_uid,
      modJson.slot.toLowerCase(),
      setBonus,
      modJson.level,
      modJson.pips,
      primaryStat,
      secondaryStats,
      modJson.characterID,
      modJson.tier
    )
  }

  /**
   * Deserialize a JSON representation of a mod into a new mod (for app minor version 1.2 and below)
   *
   * @param modJson
   * @param characters Object An object, keyed by character name, of all possible characters
   *
   * @return Mod
   */
  static deserializeVersionOneTwo(modJson, characters) {
    const primaryStat = new Stat(modJson.primaryBonusType, modJson.primaryBonusValue);
    let secondaryStats = [];

    if (!['None', ''].includes(modJson.secondaryType_1) && '' !== modJson.secondaryValue_1) {
      secondaryStats.push(new Stat(modJson.secondaryType_1, modJson.secondaryValue_1, +modJson.secondaryRoll_1 || 1));
    }
    if (!['None', ''].includes(modJson.secondaryType_2) && '' !== modJson.secondaryValue_2) {
      secondaryStats.push(new Stat(modJson.secondaryType_2, modJson.secondaryValue_2, +modJson.secondaryRoll_2 || 1));
    }
    if (!['None', ''].includes(modJson.secondaryType_3) && '' !== modJson.secondaryValue_3) {
      secondaryStats.push(new Stat(modJson.secondaryType_3, modJson.secondaryValue_3, +modJson.secondaryRoll_3 || 1));
    }
    if (!['None', ''].includes(modJson.secondaryType_4) && '' !== modJson.secondaryValue_4) {
      secondaryStats.push(new Stat(modJson.secondaryType_4, modJson.secondaryValue_4, +modJson.secondaryRoll_4 || 1));
    }

    const charactersByName = groupByKey(Object.values(characters), char => char.gameSettings.name);

    const characterName = ('' !== modJson.characterName && 'UNASSIGNED' !== modJson.characterName) ?
      modJson.characterName.replace(/&amp;#39;/g, "'") : null;

    const currentCharacter = (characterName && charactersByName[characterName]) ?
      charactersByName[characterName].baseID :
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
      modJson.tier
    );
  }
}

export default Mod;
