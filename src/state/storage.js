/**
 * Save the state of the application to localStorage
 * @param state Object
 */
import {mapObject, mapObjectByKeyAndValue} from "../utils/mapObject";
import Character from "../domain/Character";
import PlayerProfile from "../domain/PlayerProfile";
import groupByKey from "../utils/groupByKey";
import Mod from "../domain/Mod";
import cleanAllyCode from "../utils/cleanAllyCode";
import formatAllyCode from "../utils/formatAllyCode";

/**
 * Save the state of the application to localStorage, then return it so it can be chained
 * @param state
 * @returns {*}
 */
export function saveState(state) {
  const savedKeys = [
    'allyCode',
    'characterFilter',
    'characterEditMode',
    'keepOldMods',
    'modsFilter',
    'modSetsFilter',
    'modListFilter',
    'optimizerView',
    'section',
    'showSidebar',
    'version'
  ];
  const reducedState = Object.assign({}, state);
  for (let key of Object.keys(state)) {
    if (!savedKeys.includes(key)) {
      delete reducedState[key];
    }
  }
  const storedState = serializeState(reducedState);
  window.localStorage.setItem('optimizer.state', JSON.stringify(storedState));
  return state;
}

export const defaultState = {
  allyCode: '',
  characterFilter: '',
  characterEditMode: 'basic',
  characterTemplates: {},
  error: null,
  flashMessage: null,
  gameSettings: {},
  hideSelectedCharacters: false,
  isBusy: false,
  keepOldMods: true,
  modal: null,
  modsFilter: {
    slot: {},
    set: {},
    rarity: {},
    tier: {},
    level: {},
    equipped: {},
    primary: {},
    secondary: {},
    sort: ''
  },
  modSetsFilter: 'all',
  modListFilter: {
    view: 'list',
    sort: 'assignedCharacter',
    tag: null
  },
  optimizerView: 'edit',
  playerProfiles: {}, // A simple map from ally codes to player names for all available profiles
  previousVersion: process.env.REACT_APP_VERSION || 'local',
  profile: null, // All the data about the current character
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

/**
 * Convert the state from an in-memory representation to a serialized representation
 * @param state {object}
 */
export function serializeState(state) {
  if (null === state || undefined === typeof state) {
    return null;
  } else if ('function' === typeof state.serialize) {
    return state.serialize();
  } else if (state instanceof Array) {
    return state.map(item => serializeState(item));
  } else if (state instanceof Object) {
    return mapObject(
      state,
      stateValue => serializeState(stateValue)
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

  return Object.assign({}, defaultState, {
      allyCode: state.allyCode,
      characterEditMode: state.characterEditMode || defaultState.characterEditMode,
      characterFilter: state.characterFilter || defaultState.characterFilter,
      keepOldMods: state.keepOldMods,
      modsFilter: Object.assign({}, defaultState.modsFilter, state.modsFilter),
      modListFilter: state.modListFilter || defaultState.modListFilter,
      modSetsFilter: state.modSetsFilter || defaultState.modSetsFilter,
      optimizerView: state.optimizerView || defaultState.optimizerView,
      previousVersion: state.version,
      section: state.section,
      showSidebar: 'undefined' !== typeof state.showSidebar ? state.showSidebar : defaultState.showSidebar,
      version: version
    },
    state.profiles ?
      {
        profiles: mapObjectByKeyAndValue(state.profiles, (allyCode, profile) => {
          profile.allyCode = allyCode;
          profile.playerName = formatAllyCode(allyCode);
          return PlayerProfile.deserialize(profile);
        })
      } :
      null,
    state.characters ?
      {
        characters: mapObject(state.characters, (character) => Character.deserialize(character, version))
      } :
      null
  );
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

  return Object.assign({}, defaultState, {
    allyCode: playerAllyCode,
    characters: mapObject(
      playerCharacters,
      char => new Character(char.baseID, char.defaultSettings, char.gameSettings)
    ),
    previousVersion: '1.2',
    profiles: {
      [playerAllyCode]:
        new PlayerProfile(playerAllyCode, playerAllyCode, playerCharacters, playerMods, playerSelectedCharacters)
    },
    version: version
  });
}
