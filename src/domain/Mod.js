// @flow

import setBonuses from "../constants/setbonuses";
import Stat from "./Stat";
import groupByKey from "../utils/groupByKey";
import {modSets, modSlots} from "../constants/enums";
import OptimizationPlan from "./OptimizationPlan";

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
    return new Mod(
      this.id,
      this.slot,
      this.set,
      this.level,
      this.pips,
      this.primaryStat,
      this.secondaryStats,
      characterID,
      this.tier
    );
  }

  unequip() {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      this.level,
      this.pips,
      this.primaryStat,
      this.secondaryStats,
      null,
      this.tier
    );
  }

  /**
   * Simulate leveling this mod up to level 15, upgrading the primary stat as needed, but not changing any of the
   * secondary stats
   * @returns {Mod}
   */
  levelUp() {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      15,
      this.pips,
      this.primaryStat.upgradePrimary(this.pips),
      this.secondaryStats,
      this.characterID,
      this.tier
    );
  }

  /**
   * Upgrade all of the stats on this mod to see what it would be like after slicing from 5A to 6E
   * @returns {Mod}
   */
  slice() {
    return new Mod(
      this.id,
      this.slot,
      this.set,
      this.level,
      6,
      this.primaryStat.upgradePrimary(6),
      this.secondaryStats.map(stat => stat.upgradeSecondary()),
      this.characterID,
      1
    );
  }

  shouldLevel(target) {
    return OptimizationPlan.shouldUpgradeMods(target) && this.level < 15;
  }

  shouldSlice(character, target) {
    return character.optimizerSettings.sliceMods && this.pips < 6 &&
      (this.level === 15 || this.shouldLevel(target))
  }

  /**
   * Get a summary of how this mod affects a character's stats
   * @param character {Character}
   * @param target {OptimizationPlan}
   * @param withUpgrades {boolean} Whether to level and slice the mod, if they've been selected for the character
   * @returns {Object<String, Number>} A map from stat name to value
   */
  getStatSummaryForCharacter(character, target, withUpgrades = true) {
    let workingMod = this;

    const summary = {
      'Health': new Stat('Health', '0'),
      'Protection': new Stat('Protection', '0'),
      'Speed': new Stat('Speed', '0'),
      'Critical Damage': new Stat('Critical Damage %', '0'),
      'Potency': new Stat('Potency', '0'),
      'Tenacity': new Stat('Tenacity', '0'),
      'Physical Damage': new Stat('Physical Damage', '0'),
      'Physical Critical Chance': new Stat('Physical Critical Chance %', '0'),
      'Armor': new Stat('Armor', '0'),
      'Special Damage': new Stat('Special Damage', '0'),
      'Special Critical Chance': new Stat('Special Critical Chance %', '0'),
      'Resistance': new Stat('Resistance', '0'),
      'Accuracy': new Stat('Accuracy %', '0'),
      'Critical Avoidance': new Stat('Critical Avoidance %', '0')
    };

    if (withUpgrades) {
      // Upgrade or slice each mod as necessary based on the optimizer settings and level of the mod
      if (15 > workingMod.level && target.upgradeMods) {
        workingMod = workingMod.levelUp();
      }
      if (15 === workingMod.level && 5 === workingMod.pips && character.optimizerSettings.sliceMods) {
        workingMod = workingMod.slice();
      }
    }

    for (let modStat of [workingMod.primaryStat].concat(workingMod.secondaryStats)) {
      const flatStats = modStat.getFlatValuesForCharacter(character);
      flatStats.forEach(stat => summary[stat.displayType] = summary[stat.displayType].plus(stat));
    }

    return summary;
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
          modObject[`secondaryType_${i + 1}`],
          modObject[`secondaryValue_${i + 1}`],
          modObject[`secondaryRoll_${i + 1}`]
        ] = this.secondaryStats[i].serialize();
      } else {
        modObject[`secondaryType_${i + 1}`] = '';
        modObject[`secondaryValue_${i + 1}`] = '';
        modObject[`secondaryRoll_${i + 1}`] = '';
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
   * @param modJson {string}
   * @param characters {Object<string, Character>} An object, keyed by character ID, of all possible characters
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
