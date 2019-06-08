import {mapObject} from "../utils/mapObject";

export default class OptimizerRun {
  allyCode;
  characters;
  mods;
  selectedCharacters;
  modChangeThreshold;
  lockUnselectedCharacters;

  /**
   * Note that all of the parameters for an OptimizerRun are pure Objects - no classes with extra methods built-in
   *
   * @param allyCode {string}
   * @param characters {Object<String, Object>}
   * @param mods {Array<Object>}
   * @param selectedCharacters {Array<Object>}
   * @param modChangeThreshold {number}
   * @param lockUnselectedCharacters {boolean}
   */
  constructor(allyCode, characters, mods, selectedCharacters, modChangeThreshold, lockUnselectedCharacters) {
    this.allyCode = allyCode;
    // We care about everything stored for the character except the default settings
    mapObject(characters, character => {
      delete character.defaultSettings;
      delete character.gameSettings;
    });
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.modChangeThreshold = modChangeThreshold;
    this.lockUnselectedCharacters = lockUnselectedCharacters;
  }

  serialize() {
    return this;
  }

  deserialize(runJson) {
    return new OptimizerRun(
      runJson.allyCode,
      runJson.characters,
      runJson.mods,
      runJson.selectedCharacters,
      runJson.modChangeThreshold,
      runJson.lockUnselectedCharacters || false
    );
  }
}
