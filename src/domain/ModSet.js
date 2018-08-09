import setBonuses from "../constants/setbonuses";
import statTypeMap from "../constants/statTypeMap";
import Stat from "./Stat";

class ModSet {
  constructor(mods) {
    for (let slot of ModSet.slots) {
      this[slot] = null;
    }

    for (let mod of mods.filter(mod => null !== mod)) {
      this[mod.slot] = mod;
    }
  }

  /**
   * Get the mods in this set as an array
   */
  mods() {
    let mods = [];

    for (let slot of ModSet.slots) {
      if (this[slot]) {
        mods.push(this[slot]);
      }
    }

    return mods;
  }

  /**
   * Check to see if this mod set contains a given mod
   *
   * @param mod
   *
   * @return boolean
   */
  contains(mod) {
    return this.mods().includes(mod);
  }

  /**
   * Create a new instance of ModSet with the same mods
   */
  copy() {
    return new ModSet(this.mods());
  }

  /**
   * Check whether this set is equal to another set
   *
   * @returns boolean
   */
  equals(that) {
    return this.square === that.square &&
      this.arrow === that.arrow &&
      this.diamond === that.diamond &&
      this.triangle === that.triangle &&
      this.circle === that.circle &&
      this.cross === that.cross;
  }

  /**
   * Overwrite the slots given in `slots` with the mods from modSet
   *
   * @param slots Array
   * @param modSet ModSet
   *
   * @return this
   */
  replaceSlots(slots, modSet) {
    for (let slot of slots) {
      this[slot] = modSet[slot];
    }

    return this;
  }

  /**
   * Assign all mods in this set to a character
   *
   * @param character
   */
  assignTo(character) {
    for (let slot of ModSet.slots) {
      if (this[slot]) {
        this[slot].assignTo = character;
      }
    }
  }

  /**
   * Give a summary of the absolute stat increase given by this mod set for a given character
   *
   * @param character Character
   * @param forDisplay Boolean Set to true if this is meant to be displayed to the user (rather than used to calculate
   *                           the set score). This will then break out things like Critical Chance into physical and
   *                           special
   *
   * @return Object An object keyed on each stat in the mod set
   */
  getSummary(character, forDisplay = false) {
    let summary, statMap;

    if (forDisplay) {
      summary = {
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
      statMap = Object.assign({}, statTypeMap, {'Critical Chance': ['physCritChance', 'specCritChance']});
    } else {
      summary = {
        'Health': new Stat('Health', '0'),
        'Protection': new Stat('Protection', '0'),
        'Speed': new Stat('Speed', '0'),
        'Critical Damage': new Stat('Critical Damage %', '0'),
        'Potency': new Stat('Potency', '0'),
        'Tenacity': new Stat('Tenacity', '0'),
        'Physical Damage': new Stat('Physical Damage', '0'),
        'Critical Chance': new Stat('Critical Chance %', '0'),
        'Armor': new Stat('Armor', '0'),
        'Special Damage': new Stat('Special Damage', '0'),
        'Resistance': new Stat('Resistance', '0'),
        'Accuracy': new Stat('Accuracy %', '0'),
        'Critical Avoidance': new Stat('Critical Avoidance %', '0')
      };
      statMap = statTypeMap;
    }

    let setCounts = new WeakMap();

    for (let slot of ModSet.slots) {
      let mod = this[slot];
      if (null === mod) {
        continue;
      }
      let set = mod.set;

      // Update the summary for each stat on each mod
      this.updateSummary(summary, mod.primaryStat, character, statMap);
      for (let secondaryStat of mod.secondaryStats) {
        this.updateSummary(summary, secondaryStat, character, statMap);
      }

      // Get a count of how many mods are in each set
      let currentCount = setCounts.get(set) || 0;
      if (set) {
        setCounts.set(set, currentCount + 1);
      }
    }

    // Update the summary for each stat from each complete mod set
    for (let setKey in setBonuses) {
      let setDescription = setBonuses[setKey];
      let setMultiplier = Math.floor((setCounts.get(setDescription) || 0) / setDescription.numberOfModsRequired);

      for (let i = 0; i < setMultiplier; i++) {
        this.updateSummary(summary, setDescription.bonus, character, statMap);
      }
    }

    // Update the summary to mark the stats that should always be displayed as percentages
    // Also update all stats to be the correct precision
    Object.values(summary).forEach(stat => {
      if (!Stat.mixedTypes.includes(stat.displayType)) {
        stat.displayModifier = '%';
      } else {
        stat.value = Math.trunc(stat.value);
      }
      stat.updateDisplayValue();
    });

    return summary;
  }

  /**
   * Update a summary object with the values of a stat
   *
   * @param summary Object The summary object to update
   * @param stat Stat The stat to add to the summary
   * @param character Character A character to use for calculations involving percentages
   * @param statMap Object A map from stat display names to the list of underlying stats that they affect
   */
  updateSummary(summary, stat, character, statMap) {
    const propertyNames = statMap[stat.displayType];

    propertyNames.forEach(propertyName => {
      const propertyDisplayName = Stat.displayNames[propertyName] || propertyName;

      if (!summary.hasOwnProperty(propertyDisplayName)) {
        let statType =
          // We only include a '%' if the stat is NOT in mixedTypes, because those are the only stats that will always
          // display as a percentage
          Stat.mixedTypes.includes(propertyDisplayName) ?
            stat.displayType :
            stat.displayType + ' %';
          summary[propertyDisplayName] = new Stat(statType, '0');
      }
      if (stat.isPercent) {
        summary[propertyDisplayName].value += stat.value * character.baseStats[propertyName] / 100;
      } else {
        summary[propertyDisplayName].value += stat.value;
      }
    });
  }

  /**
   * Get the value of this full mod set for optimization
   *
   * @param character
   */
  getOptimizationValue(character) {
    return Object.values(this.getSummary(character))
      .reduce((setValue, stat) => setValue + stat.getOptimizationValue(character), 0);
  }
}

ModSet.slots = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

export default ModSet;
