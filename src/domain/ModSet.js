import setBonuses from "../constants/setbonuses";
import statTypeMap from "../constants/statTypeMap";

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
   * Create a new instance of ModSet with the same mods
   */
  copy() {
    return new ModSet(this.mods());
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
   * Get the value of this set of mods for a given character based on a provided optimization plan
   *
   * @param optimizationPlan OptimizationPlan
   * @param character Character
   */
  optimizationValue(optimizationPlan, character) {
    let summary = this.getSummary(character);
    let value = 0;

    for (let statType in summary) {
      value += optimizationPlan[statType] * summary[statType];
    }

    return value;
  }

  /**
   * Give a summary of the absolute stat increase given by this mod set for a given character
   *
   * @param character
   *
   * @return Object An object keyed on each stat in the mod set
   */
  getSummary(character) {
    let summary = {};
    let setCounts = new WeakMap();

    for (let slot of ModSet.slots) {
      let mod = this[slot];
      if (null === mod) {
        continue;
      }
      let set = mod.set;

      // Update the summary for each stat on each mod
      this.updateSummary(summary, mod.primaryStat, character);
      for (let secondaryStat of mod.secondaryStats) {
        this.updateSummary(summary, secondaryStat, character);
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
        this.updateSummary(summary, setDescription.bonus, character);
      }
    }

    return summary;
  }

  /**
   * Update a summary object with the values of a stat
   *
   * @param summary Object The summary object to update
   * @param stat Stat The stat to add to the summary
   * @param character Character A character to use for calculations involving percentages
   */
  updateSummary(summary, stat, character) {
    let statType = statTypeMap[stat.displayType];
    if (!summary.hasOwnProperty(statType)) {
      summary[statType] = 0;
    }
    if (stat.isPercent) {
      summary[statType] += stat.value * character.baseStats[statType] / 100;
    } else {
      summary[statType] += stat.value;
    }
  }
}

ModSet.slots = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

export default ModSet;
