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

  /**
   * @param characters Object{Character.baseID => Character}
   * @param mods Array[Mod]
   * @param selectedCharacters Array[Character.baseID]
   */
  constructor(characters = {}, mods = [], selectedCharacters = []) {
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
  }

  withCharacters(characters) {
    if (characters) {
      return new PlayerProfile(
        characters,
        this.mods,
        this.selectedCharacters
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
        this.selectedCharacters
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
        selectedCharacters
      );
    } else {
      return this;
    }
  }

  serialize() {
    return {
      characters: mapObject(this.characters, character => character.serialize()),
      mods: this.mods.map(mod => mod.serialize()),
      selectedCharacters: this.selectedCharacters
    };
  }

  static deserialize(profileJson) {
    if (profileJson) {
      return new PlayerProfile(
        mapObject(profileJson.characters, Character.deserialize),
        profileJson.mods.map(Mod.deserialize),
        profileJson.selectedCharacters
      )
    } else {
      return null;
    }
  }
}
