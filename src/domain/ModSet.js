// @flow

import setBonuses from "../constants/setbonuses";
import Stat from "./Stat";
import Mod from "./Mod";

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
   * Checks to see if this mod set satisfies all the restrictions from the optimization plan
   *
   * @param target {OptimizationPlan}
   * @returns {boolean}
   */
  satisfiesRestrictions(minimumDots, target) {
    return this.mods().every(mod => mod.pips >= minimumDots) &&
      (!target.primaryStatRestrictions.arrow ||
        (this.arrow && this.arrow.primaryStat.type === target.primaryStatRestrictions.arrow)) &&
      (!target.primaryStatRestrictions.triangle ||
        (this.triangle && this.triangle.primaryStat.type === target.primaryStatRestrictions.triangle)) &&
      (!target.primaryStatRestrictions.circle ||
        (this.circle && this.circle.primaryStat.type === target.primaryStatRestrictions.circle)) &&
      (!target.primaryStatRestrictions.cross ||
        (this.cross && this.cross.primaryStat.type === target.primaryStatRestrictions.cross)) &&
      this.fulfillsSetRestriction(target.setRestrictions);
  }

  /**
   * Checks to see if this mod set satisfies all of the sets listed in setDefinition
   *
   * @param setDefinition {Object<String, Number>}
   * @returns {Boolean}
   */
  fulfillsSetRestriction(setDefinition) {
    // Count how many mods exist in each set
    const setCounts = this.mods().reduce((acc, mod) => {
      return Object.assign({}, acc, {
        [mod.set.name]: (acc[mod.set.name] || 0) + 1
      })
    }, {});

    // Check that each set in the setDefinition has a corresponding value at least that high in setCounts
    return Object.entries(setDefinition).every(([setName, count]) =>
      count <= (setCounts[setName] || 0) / setBonuses[setName].numberOfModsRequired
    );
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
        this[slot].upgrade = character.optimizationPlan.upgradeMods;
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
    let summary = {};

    // Holds the number of mods in each set
    let smallSetCounts = new WeakMap();
    // Hold the number of mods in each set that have been or will be leveled fully (thus providing the max set bonus)
    let maxSetCounts = new WeakMap();

    for (let slot of ModSet.slots) {
      const mod = this[slot];
      if (null === mod) {
        continue;
      }
      const set = mod.set;

      const modStats = mod.getStatSummaryForCharacter(character, forDisplay);
      for (let stat in modStats) {
        summary[stat] = summary[stat] ? summary[stat].plus(modStats[stat]) : modStats[stat];
      }

      // Get a count of how many mods are in each set
      const currentSmallCount = smallSetCounts.get(set) || 0;
      const currentMaxCount = maxSetCounts.get(set) || 0;
      if (set) {
        smallSetCounts.set(set, currentSmallCount + 1);
        if (character.optimizerSettings.target.upgradeMods || 15 === mod.level) {
          maxSetCounts.set(set, currentMaxCount + 1);
        }
      }
    }

    // Update the summary for each stat from each complete mod set
    for (let setKey in setBonuses) {
      const setDescription = setBonuses[setKey];

      // Add in any set bonuses
      // leveled or upgraded mods
      const maxSetMultiplier =
        Math.floor((maxSetCounts.get(setDescription) || 0) / setDescription.numberOfModsRequired);

      // Add in any set bonuses from unleveled mods
      const smallSetCount = smallSetCounts.get(setDescription);
      smallSetCounts.set(setDescription, smallSetCount - setDescription.numberOfModsRequired * maxSetMultiplier);
      const smallSetMultiplier =
        Math.floor((smallSetCounts.get(setDescription) || 0) / setDescription.numberOfModsRequired);

      const maxSetStats = setDescription.maxBonus.getFlatValuesForCharacter(character);
      maxSetStats.forEach(stat => {
        for (let i = 0; i < maxSetMultiplier; i++) {
          summary[stat.displayType] = summary[stat.displayType].plus(stat);
        }
      });

      const smallSetStats = setDescription.smallBonus.getFlatValuesForCharacter(character);
      smallSetStats.forEach(stat => {
        for (let i = 0; i < smallSetMultiplier; i++) {
          summary[stat.displayType] = summary[stat.displayType].plus(stat);
        }
      });
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
   * Get the value of this full mod set for optimization
   *
   * @param character
   */
  getOptimizationValue(character) {
    return Object.values(this.getSummary(character))
      .reduce((setValue, stat) => setValue + stat.getOptimizationValue(character), 0);
  }

  serialize() {
    return this.mods().filter(mod => null !== mod).map(mod => mod.serialize());
  }

  static deserialize(modSetJson) {
    return new ModSet(modSetJson.map(Mod.deserialize));
  }
}

ModSet.slots = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

export default ModSet;
