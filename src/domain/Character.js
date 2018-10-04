// @flow

import BaseStats, {NullCharacterStats} from "./CharacterStats";
import OptimizationPlan from "./OptimizationPlan";
import characterSettings from "../constants/characterSettings";

export default class Character {
  baseID;
  defaultSettings;
  gameSettings;
  playerValues;
  optimizerSettings;

  /**
   * @param name
   * @param defaultSettings CharacterSettings The unchangeable default settings for a character, including its
   *                                          damage type, default targets, and extra searchable tags
   * @param gameSettings GameSettings The unchangeable settings for a character from in-game, including tags, name, etc.
   * @param playerValues PlayerValues The player-specific character values from the game, like level, stars, etc.
   * @param optimizerSettings OptimizerSettings Settings specific to the optimizer,
   *                                            such as what target to use, and whether to lock mods
   */
  constructor(baseID,
              defaultSettings,
              gameSettings = null,
              playerValues = null,
              optimizerSettings = null,
  ) {
    this.baseID = baseID;
    this.defaultSettings = defaultSettings;
    this.gameSettings = gameSettings;
    this.playerValues = playerValues;
    this.optimizerSettings = optimizerSettings;
  }

  /**
   * Create a new character using only the static default settings
   * @param baseID
   */
  static default(baseID) {
    return new Character(
      baseID,
      characterSettings[baseID] || null
    );
  }

  /**
   * Return a shallow copy of this character
   */
  clone() {
    return new Character(
      this.baseID,
      this.defaultSettings,
      this.gameSettings,
      Object.assign({}, this.playerValues),
      Object.assign({}, this.optimizerSettings)
    );
  }

  /**
   * Create a new Character object that matches this one, but with defaultSettings overridden
   * @param defaultSettings CharacterSettings
   */
  withDefaultSettings(defaultSettings) {
    if (defaultSettings) {
      return new Character(
        this.baseID,
        defaultSettings,
        this.gameSettings,
        this.playerValues,
        this.optimizerSettings
      );
    } else {
      return this;
    }
  }

  /**
   * Create a new Character object that matches this one, but with gameSettings overridden
   * @param gameSettings
   */
  withGameSettings(gameSettings) {
    if (gameSettings) {
      return new Character(
        this.baseID,
        this.defaultSettings,
        gameSettings,
        this.playerValues,
        this.optimizerSettings
      )
    } else {
      return this;
    }
  }

  /**
   * Comparison function useful for sorting characters by Galactic Power. If that has a higher GP, returns a value > 0.
   * If this has a higher GP, returns a value < 0. If the GPs are the same, returns a value to sort by character name.
   * @param that Character
   */
  compareGP(that) {
    if (that.gameSettings.galacticPower === this.gameSettings.galacticPower) {
      return this.gameSettings.name.localeCompare(that.gameSettings.name);
    }
    return that.gameSettings.galacticPower - this.gameSettings.galacticPower;
  }

  /**
   * Checks whether this character matches a given filter string in name or tags
   * @param filterString string The string to filter by
   * @returns boolean
   */
  matchesFilter(filterString) {
    return this.gameSettings.name.toLowerCase().includes(filterString) ||
      (this.gameSettings.tags || []).concat(this.defaultSettings.extraTags || []).some(
        tag => tag.toLowerCase().includes(filterString)
      )
  }

  serialize() {
    let characterObject = {};

    characterObject.baseID = this.baseID;
    characterObject.defaultSettings = this.defaultSettings.serialize();
    characterObject.gameSettings = this.gameSettings ? this.gameSettings.serialize() : {};
    characterObject.playerValues = this.playervalues ? this.playerValues.serialize() : {};
    characterObject.optimizerSettings = this.optimizerSettings ? this.optimizerSettings.serialize() : {};

    return characterObject;
  }

  // TODO: Implement
  static deserialize(characterJson, version) {
    const serializedNamedPlans = characterJson.namedPlans || {
      unnamed: characterJson.optimizationPlan
    };
    const planDeserializer = (() => {
      if (!version || version < '1.1.0') {
        return OptimizationPlan.deserializeVersionOne;
      } else if (version < '1.2.0') {
        return OptimizationPlan.deserializeVersionOneOne;
      } else {
        return OptimizationPlan.deserialize;
      }
    })();
    const physDmgPct = 'undefined' !== typeof characterJson.physDmgPercent ? characterJson.physDmgPercent : 1;

    const namedPlansObject = Object.keys(serializedNamedPlans).reduce((obj, key) => {
      obj[key] = planDeserializer(serializedNamedPlans[key], physDmgPct).rename(key);
      return obj;
    }, {});

    let selectedTarget = planDeserializer(characterJson.optimizationPlan, physDmgPct);

    // If the selected plan is unnamed, try to find if a matching plan does exist, so that the matching plan can
    // be selected
    if ('unnamed' === selectedTarget.name) {
      Object.values(namedPlansObject).forEach(target => {
        if (selectedTarget.rename(target.name).equals(target)) {
          selectedTarget = target;
        }
      });
    }

    return new Character(
      characterJson.name,
      '',
      characterJson.level,
      characterJson.starLevel || 1,
      characterJson.gearLevel || 1,
      characterJson.gearPieces || [],
      characterJson.galacticPower || 0,
      characterJson.physDmgPercent,
      characterJson.baseStats ? BaseStats.deserialize(characterJson.baseStats) : NullCharacterStats,
      characterJson.totalStats ? BaseStats.deserialize(characterJson.totalStats) : NullCharacterStats,
      selectedTarget,
      namedPlansObject,
      [],
      [],
      characterJson.useOnly5DotMods,
      characterJson.isLocked || false
    );
  }
}
