/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
import Character from "./Character";
import Mod from "./Mod";
import { mapObject } from "../utils/mapObject";
import OptimizerRun from "./OptimizerRun";
import OptimizationPlan from "./OptimizationPlan";

export default class PlayerProfile {
  allyCode;
  playerName;
  characters;
  mods;
  selectedCharacters;
  modAssignments;
  globalSettings;
  hotUtilsSessionId;
  incrementalOptimizeIndex;
  // Deprecated
  previousSettings;

  /**
   * @param allyCode {string} The ally code for the player whose data this is
   * @param playerName {string} The player name associated with this profile
   * @param characters {Object<string, Character>} A map from character IDs to character objects
   * @param mods {Array<Mod>} An array of Mods
   * @param selectedCharacters {Array<string>} An array of Character IDs
   * @param modAssignments {Array<Object>} An array of character definitions and assigned mods
   * @param globalSettings {Object} An object containing settings that apply in the context of a player, rather than a
   *                                character
   * @param incrementalOptimizeIndex {number} Specify to terminate optimization at a specific character, for incremental optimization
   *
   * @param previousSettings {Object} Deprecated - An object that holds the previous values for characters, mods,
   *                                  selectedCharacters, and modChangeThreshold. If none of these have changed, then
   *                                  modAssignments shouldn't change on a reoptimization.
   */
  constructor(allyCode,
    playerName,
    characters = {},
    mods = [],
    selectedCharacters = [],
    modAssignments = [],
    globalSettings = PlayerProfile.defaultGlobalSettings,
    previousSettings = {},
    hotUtilsSessionId = null,
    incrementalOptimizeIndex = null,
  ) {
    this.allyCode = allyCode;
    this.playerName = playerName;
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.modAssignments = modAssignments;
    this.globalSettings = globalSettings;
    this.previousSettings = previousSettings;
    this.hotUtilsSessionId = hotUtilsSessionId;
    this.incrementalOptimizeIndex = incrementalOptimizeIndex;
  }

  withPlayerName(name) {
    if (name) {
      return new PlayerProfile(
        this.allyCode,
        name,
        this.characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.previousSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      )
    } else {
      return this;
    }
  }

  withCharacters(characters) {
    if (characters) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.previousSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withOptimizeIndex(index) {
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      this.globalSettings,
      this.previousSettings,
      this.hotUtilsSessionId,
      index
    );
  }

  withMods(mods) {
    if (mods) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.characters,
        mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.previousSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withSelectedCharacters(selectedCharacters) {
    if (selectedCharacters) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.characters,
        this.mods,
        selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        this.previousSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withModAssignments(modAssignments) {
    if (modAssignments) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.characters,
        this.mods,
        this.selectedCharacters,
        modAssignments,
        this.globalSettings,
        this.previousSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  withGlobalSettings(globalSettings) {
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      globalSettings,
      this.previousSettings,
      this.hotUtilsSessionId,
      this.incrementalOptimizeIndex,
    );
  }

  withPreviousSettings(previousSettings) {
    if (null !== previousSettings) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        this.globalSettings,
        previousSettings,
        this.hotUtilsSessionId,
        this.incrementalOptimizeIndex,
      );
    } else {
      return this;
    }
  }

  /**
   * Create a new PlayerProfile with empty previous settings
   */
  resetPreviousSettings() {
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      this.globalSettings,
      {},
      this.hotUtilsSessionId,
      this.incrementalOptimizeIndex,
    );
  }

  withHotUtilsSessionId(id) {
    return new PlayerProfile(
      this.allyCode,
      this.playerName,
      this.characters,
      this.mods,
      this.selectedCharacters,
      this.modAssignments,
      this.globalSettings,
      this.previousSettings,
      id,
      this.incrementalOptimizeIndex,
    )
  }

  /**
   * Convert this full PlayerProfile into only what is needed to store the values form an optimizer run
   * @returns OptimizerRun
   */
  toOptimizerRun() {
    return new OptimizerRun(
      this.allyCode,
      mapObject(this.characters, character => character.serialize()),
      this.mods.map(mod => mod.serialize()),
      this.selectedCharacters,
      this.globalSettings
    );
  }

  serialize() {
    return {
      allyCode: this.allyCode,
      playerName: this.playerName,
      characters: mapObject(this.characters, character =>
        'function' === typeof character.serialize ? character.serialize() : character
      ),
      mods: this.mods.map(mod => mod.serialize()),
      selectedCharacters: this.selectedCharacters.map(({ id, target }) => ({ id: id, target: target.serialize() })),
      modAssignments: this.modAssignments,
      globalSettings: this.globalSettings,
      previousSettings: this.previousSettings,
      hotUtilsSessionId: this.hotUtilsSessionId,
      incrementalOptimizeIndex: this.incrementalOptimizeIndex,
    };
  }

  static deserialize(profileJson) {
    if (profileJson) {
      if (profileJson.selectedCharacters.length && 'string' === typeof profileJson.selectedCharacters[0]) {
        // This is an older-style profile. Use the older deserializer
        return this.deserializeVersionOneFour(profileJson);
      }

      return new PlayerProfile(
        profileJson.allyCode,
        profileJson.playerName,
        mapObject(profileJson.characters, Character.deserialize),
        profileJson.mods.map(Mod.deserialize),
        profileJson.selectedCharacters.map(({ id, target }) => ({ id: id, target: OptimizationPlan.deserialize(target) })),
        profileJson.modAssignments,
        Object.assign({}, PlayerProfile.defaultGlobalSettings, profileJson.globalSettings),
        profileJson.previousSettings || {},
        profileJson.hotUtilsSessionId || null,
        profileJson.incrementalOptimizeIndex || null,
      )
    } else {
      return null;
    }
  }

  static deserializeVersionOneFour(profileJson) {
    const globalSettings = profileJson.globalSettings ?
      Object.assign({}, PlayerProfile.defaultGlobalSettings, profileJson.globalSettings) :
      Object.assign({}, PlayerProfile.defaultGlobalSettings, {
        modChangeThreshold: profileJson.modChangeThreshold || 0
      });

    const characters = mapObject(profileJson.characters, Character.deserialize);
    const selectedCharacters = profileJson.selectedCharacters.map(characterID => ({
      id: characterID,
      target: characters[characterID].optimizerSettings.target
    }));
    const modAssignments = profileJson.selectedCharacters.map(characterID => ({
      id: characterID,
      target: characters[characterID].optimizerSettings.target,
      assignedMods: profileJson.modAssignments[characterID]
    }));

    return new PlayerProfile(
      profileJson.allyCode,
      profileJson.playerName,
      characters,
      profileJson.mods.map(Mod.deserialize),
      selectedCharacters,
      modAssignments,
      globalSettings,
      profileJson.previousSettings || {},
      null,
      null,
    );
  }
}

PlayerProfile.defaultGlobalSettings = {
  modChangeThreshold: 0,
  lockUnselectedCharacters: false,
  forceCompleteSets: false,
  omicronBoostsGac: false,
  omicronBoostsTw: false,
  omicronBoostsTb: false,
  omicronBoostsRaids: false,
  omicronBoostsConquest: false
};
