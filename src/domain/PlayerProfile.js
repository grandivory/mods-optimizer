/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
import Character from "./Character";
import Mod from "./Mod";
import {mapObject} from "../utils/mapObject";

export default class PlayerProfile {
  characters;
  mods;
  selectedCharacters;
  modAssignments;
  modChangeThreshold;

  /**
   * @param characters {Object<string, Character>} A map from character IDs to character objects
   * @param mods {Array<Mod>} An array of Mods
   * @param selectedCharacters {Array<string>} An array of Character IDs
   * @param modAssignments {Object<string, Array<string>>} A map from Character ID to mod IDs
   * @param modChangeThreshold {Number} An improvement threshold, as integer percent over 100, that a new mod set needs
   *                                    to hit before it will be suggested as better by the optimizer
   */
  constructor(characters = {}, mods = [], selectedCharacters = [], modAssignments = {}, modChangeThreshold = 0) {
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.modAssignments = modAssignments;
    this.modChangeThreshold = modChangeThreshold;
  }

  withCharacters(characters) {
    if (characters) {
      return new PlayerProfile(
        characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        this.modChangeThreshold
      );
    } else {
      return this;
    }
  }

  withMods(mods) {
    if (mods) {
      return new PlayerProfile(
        this.characters,
        mods,
        this.selectedCharacters,
        this.modAssignments,
        this.modChangeThreshold
      );
    } else {
      return this;
    }
  }

  withSelectedCharacters(selectedCharacters) {
    if (selectedCharacters) {
      return new PlayerProfile(
        this.characters,
        this.mods,
        selectedCharacters,
        this.modAssignments,
        this.modChangeThreshold
      );
    } else {
      return this;
    }
  }

  withModAssignments(modAssignments) {
    if (modAssignments) {
      return new PlayerProfile(
        this.characters,
        this.mods,
        this.selectedCharacters,
        modAssignments,
        this.modChangeThreshold
      );
    } else {
      return this;
    }
  }

  withModChangeThreshold(modChangeThreshold) {
    if (null !== modChangeThreshold) {
      return new PlayerProfile(
        this.characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments,
        modChangeThreshold
      );
    } else {
      return this;
    }
  }

  serialize() {
    return {
      characters: mapObject(this.characters, character => character.serialize()),
      mods: this.mods.map(mod => mod.serialize()),
      selectedCharacters: this.selectedCharacters,
      modAssignments: this.modAssignments,
      modChangeThreshold: this.modChangeThreshold
    };
  }

  static deserialize(profileJson) {
    if (profileJson) {
      return new PlayerProfile(
        mapObject(profileJson.characters, Character.deserialize),
        profileJson.mods.map(Mod.deserialize),
        profileJson.selectedCharacters,
        profileJson.modAssignments,
        profileJson.modChangeThreshold || 0
      )
    } else {
      return null;
    }
  }
}
