/**
 * Save the state of the application to localStorage
 * @param state Object
 */
import {mapObject, mapObjectByKey, mapObjectByKeyAndValue} from "../utils/mapObject";
import Character from "../domain/Character";
import characterSettings from "../constants/characterSettings";
import PlayerProfile from "../domain/PlayerProfile";
import groupByKey from "../utils/groupByKey";
import Mod from "../domain/Mod";
import cleanAllyCode from "../utils/cleanAllyCode";

/**
 * Save the state of the application to localStorage, then return it so it can be chained
 * @param state
 * @returns {*}
 */
export function saveState(state) {
  const storedState = serializeState(state);
  window.localStorage.setItem('optimizer.state', JSON.stringify(storedState));
  return state;
}

export const defaultState = {
  allyCode: '',
  characterFilter: '',
  characters: mapObjectByKey(characterSettings, baseID => Character.default(baseID)),
  characterEditMode: 'basic',
  error: null,
  flashMessage: null,
  isBusy: false,
  keepOldMods: true,
  modal: null,
  modsFilter: {
    slot: [],
    set: [],
    primary: [],
    rarity: [],
    secondary: [],
    sort: '',
    tier: []
  },
  modSetsFilter: 'all',
  modListFilter: {
    view: 'list',
    sort: 'assignedCharacter',
    tag: null
  },
  optimizerView: 'edit',
  previousVersion: process.env.REACT_APP_VERSION || 'local',
  profiles: {},
  section: 'optimize',
  showSidebar: true,
  version: process.env.REACT_APP_VERSION || 'local'
};

/**
 * Restore the application from localStorage
 * @returns Object state
 */
export function restoreState() {
  const state = window.localStorage.getItem('optimizer.state');

  if (state) {
    // This is the current version of the app. Deserialize the state and continue
    return deserializeState(JSON.parse(state));
  } else {
    // This is an old version of the app. Try to convert from the old version to the new version
    const mods = JSON.parse(window.localStorage.getItem('optimizer.mods'));

    // If the player has no mods data, then they didn't have anything saved. Load the default state
    if (!mods) {
      return defaultState;
    }

    const allyCode = window.localStorage.getItem('optimizer.allyCode');
    const availableCharacters = JSON.parse(window.localStorage.getItem('optimizer.availableCharacters'));
    const selectedCharacters = JSON.parse(window.localStorage.getItem('optimizer.selectedCharacters'));

    try {
      const newState = deserializeStateVersionOneTwo(allyCode, availableCharacters, selectedCharacters, mods);
      // After restoring from the old version, free up the space
      window.localStorage.clear();

      return newState;
    } catch (e) {
      return defaultState;
    }
  }
}

const ignoredStateKeys = ['error', 'isBusy', 'modal', 'previousVersion'];

/**
 * Convert the state from an in-memory representation to a serialized representation
 * @param state {object}
 */
export function serializeState(state) {
  if (null === state) {
    return null;
  } else if ('function' === typeof state.serialize) {
    return state.serialize();
  } else if (state instanceof Array) {
    return state.map(item => serializeState(item));
  } else if (state instanceof Object) {
    return mapObjectByKeyAndValue(
      state,
      (key, value) => !ignoredStateKeys.includes(key) ? serializeState(value) : null
    );
  } else {
    return state;
  }
}

/**
 * Convert the state from a serialized representation to the in-memory representation used by the app
 * @param state {object}
 */
export function deserializeState(state) {
  const version = process.env.REACT_APP_VERSION || 'local';

  return {
    allyCode: state.allyCode,
    characterEditMode: state.characterEditMode || defaultState.characterEditMode,
    characterFilter: state.characterFilter || defaultState.characterFilter,
    characters: mapObject(state.characters, (character) => Character.deserialize(character, version)),
    error: null,
    flashMessage: null,
    isBusy: false,
    keepOldMods: state.keepOldMods,
    modal: null,
    modsFilter: Object.assign({}, defaultState.modsFilter, state.modsFilter),
    modListFilter: state.modListFilter || defaultState.modListFilter,
    modSetsFilter: state.modSetsFilter || defaultState.modSetsFilter,
    optimizerView: state.optimizerView || defaultState.optimizerView,
    previousVersion: state.version,
    profiles: mapObject(state.profiles, PlayerProfile.deserialize),
    section: state.section,
    showSidebar: 'undefined' !== typeof state.showSidebar ? state.showSidebar : defaultState.showSidebar,
    version: version
  };
}

/**
 * Deserialize state from an older version of the app (minor version 1.2)
 * @param allyCode {string}
 * @param availableCharacters {Array<object>}
 * @param selectedCharacters {Array<object>}
 * @param mods {Array<object>}
 */
export function deserializeStateVersionOneTwo(allyCode, availableCharacters, selectedCharacters, mods) {
  const version = process.env.REACT_APP_VERSION || 'local';

  const charactersObj = Object.assign(
    groupByKey(availableCharacters, char => char.baseID),
    groupByKey(selectedCharacters, char => char.baseID)
  );

  const playerAllyCode = cleanAllyCode(allyCode);
  const playerCharacters = mapObject(charactersObj, Character.deserializeVersionOneTwo);
  const playerMods = mods.map(mod => Mod.deserializeVersionOneTwo(mod, playerCharacters));
  const playerSelectedCharacters = selectedCharacters.map(char => char.baseID);

  return {
    allyCode: playerAllyCode,
    characterEditMode: defaultState.characterEditMode,
    characterFilter: defaultState.characterFilter,
    characters: mapObject(playerCharacters, char => new Character(char.baseID, char.defaultSettings, char.gameSettings)),
    error: null,
    flashMessage: null,
    isBusy: false,
    keepOldMods: defaultState.keepOldMods,
    modal: null,
    modsFilter: defaultState.modsFilter,
    modListFilter: defaultState.modListFilter,
    modSetsFilter: defaultState.modSetsFilter,
    optimizerView: defaultState.optimizerView,
    previousVersion: '1.2',
    profiles: {
      [playerAllyCode]: new PlayerProfile(playerCharacters, playerMods, playerSelectedCharacters)
    },
    section: defaultState.section,
    showSidebar: true,
    version: version
  }
}
