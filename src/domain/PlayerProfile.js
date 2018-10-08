/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
import Character from "./Character";
import Mod from "./Mod";
import {mapObject} from "../utils/mapObject";
import ModSet from "./ModSet";

export default class PlayerProfile {
  characters;
  mods;
  selectedCharacters;
  modAssignments;

  /**
   * @param characters Object{Character.baseID => Character}
   * @param mods Array[Mod]
   * @param selectedCharacters Array[Character.baseID]
   * @param modAssignments {Character.baseID => ModSet}
   */
  constructor(characters = {}, mods = [], selectedCharacters = [], modAssignments = {}) {
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.modAssignments = modAssignments;
  }

  withCharacters(characters) {
    if (characters) {
      return new PlayerProfile(
        characters,
        this.mods,
        this.selectedCharacters,
        this.modAssignments
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
        this.modAssignments
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
        this.modAssignments
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
        modAssignments
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
      modAssignments: mapObject(this.modAssignments, modSet => modSet.serialize())
    };
  }

  static deserialize(profileJson) {
    if (profileJson) {
      return new PlayerProfile(
        mapObject(profileJson.characters, Character.deserialize),
        profileJson.mods.map(Mod.deserialize),
        profileJson.selectedCharacters,
        mapObject(profileJson.modAssignments || {}, ModSet.deserialize)
      )
    } else {
      return null;
    }
  }
}
