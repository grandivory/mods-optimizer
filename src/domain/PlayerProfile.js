/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
import Character from "./Character";
import Mod from "./Mod";
import {mapObject} from "../utils/mapObject";
import OptimizerRun from "./OptimizerRun";

export default class PlayerProfile {
  allyCode;
  playerName;
  characters;
  mods;
  selectedCharacters;
  modAssignments;
  modChangeThreshold;
  // Deprecated
  previousSettings;

  /**
   * @param allyCode {string} The ally code for the player whose data this is
   * @param playerName {string} The player name associated with this profile
   * @param characters {Object<string, Character>} A map from character IDs to character objects
   * @param mods {Array<Mod>} An array of Mods
   * @param selectedCharacters {Array<string>} An array of Character IDs
   * @param modAssignments {Object<string, Array<string>>} A map from Character ID to mod IDs
   * @param modChangeThreshold {Number} An improvement threshold, as integer percent over 100, that a new mod set needs
   *                                    to hit before it will be suggested as better by the optimizer
   * @param previousSettings {Object} Deprecated - An object that holds the previous values for characters, mods,
   *                                  selectedCharacters, and modChangeThreshold. If none of these have changed, then
   *                                  modAssignments shouldn't change on a reoptimization.
   */
  constructor(allyCode,
              playerName,
              characters = {},
              mods = [],
              selectedCharacters = [],
              modAssignments = {},
              modChangeThreshold = 0,
              previousSettings = {}
  ) {
    this.allyCode = allyCode;
    this.playerName = playerName;
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.modAssignments = modAssignments;
    this.modChangeThreshold = modChangeThreshold;
    this.previousSettings = previousSettings;
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
        this.modChangeThreshold,
        this.previousSettings
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
        this.modChangeThreshold,
        this.previousSettings
      );
    } else {
      return this;
    }
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
        this.modChangeThreshold,
        this.previousSettings
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
        this.modChangeThreshold,
        this.previousSettings
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
        this.modChangeThreshold,
        this.previousSettings
      );
    } else {
      return this;
    }
  }

  withModChangeThreshold(modChangeThreshold) {
    if (null !== modChangeThreshold) {
      return new PlayerProfile(
        this.allyCode,
        this.playerName,
        this.characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        modChangeThreshold,
        this.previousSettings
      );
    } else {
      return this;
    }
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
        this.modChangeThreshold,
        previousSettings
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
      this.modChangeThreshold,
      {}
    );
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
      this.modChangeThreshold
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
      selectedCharacters: this.selectedCharacters,
      modAssignments: this.modAssignments,
      modChangeThreshold: this.modChangeThreshold,
      previousSettings: this.previousSettings
    };
  }

  static deserialize(profileJson) {
    if (profileJson) {
      return new PlayerProfile(
        profileJson.allyCode,
        profileJson.playerName,
        mapObject(profileJson.characters, Character.deserialize),
        profileJson.mods.map(Mod.deserialize),
        profileJson.selectedCharacters,
        profileJson.modAssignments,
        profileJson.modChangeThreshold || 0,
        profileJson.previousSettings || {}
      )
    } else {
      return null;
    }
  }
}
