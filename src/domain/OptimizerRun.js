import {mapObject} from "../utils/mapObject";
import PlayerProfile from "./PlayerProfile";

export default class OptimizerRun {
  allyCode;
  characters;
  mods;
  selectedCharacters;
  globalSettings;

  /**
   * Note that all of the parameters for an OptimizerRun are pure Objects - no classes with extra methods built-in
   *
   * @param allyCode {string}
   * @param characters {Object<String, Object>}
   * @param mods {Array<Object>}
   * @param selectedCharacters {Array<Object>}
   * @param globalSettings {Object} 
   * @param modChangeThreshold {number}
   * @param lockUnselectedCharacters {boolean}
   */
  constructor(allyCode, characters, mods, selectedCharacters, globalSettings) {
    this.allyCode = allyCode;
    // We care about everything stored for the character except the default settings
    mapObject(characters, character => {
      delete character.defaultSettings;
      delete character.gameSettings;
    });
    this.characters = characters;
    this.mods = mods;
    this.selectedCharacters = selectedCharacters;
    this.globalSettings = globalSettings;
  }

  serialize() {
    return {
      allyCode: this.allyCode,
      characters: this.characters,
      mods: this.mods,
      selectedCharacters: this.selectedCharacters.map(({id, target}) => ({id: id, target: target.serialize()})),
      globalSettings: this.globalSettings
    };
  }

  deserialize(runJson) {
    if (runJson.globalSettings) {
      return new OptimizerRun(
        runJson.allyCode,
        runJson.characters,
        runJson.mods,
        runJson.selectedCharacters,
        runJson.globalSettings
      );  
    } else {
      return this.deserializeVersionOneFive(runJson);
    }
  }

  deserializeVersionOneFive(runJson) {
    return new OptimizerRun(
      runJson.allyCode,
      runJson.characters,
      runJson.mods,
      runJson.selectedCharacters,
      Object.assign({}, PlayerProfile.defaultGlobalSettings, {
        modChangeThreshold: runJson.modChangeThreshold,
        lockUnselectedCharacters: runJson.lockUnselectedCharacters
      })
    );
  }
}
