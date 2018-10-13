/**
 * Save the state of the application to localStorage
 * @param state Object
 */
import {mapObject, mapObjectByKey} from "../utils/mapObject";
import Character from "../domain/Character";
import characterSettings from "../constants/characterSettings";
import PlayerProfile from "../domain/PlayerProfile";

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
  isBusy: false,
  keepOldMods: true,
  modal: null,
  modSetsFilter: 'all',
  modListFilter: {
    view: 'list',
    sort: 'assignedCharacter',
    tag: null
  },
  optimizerView: 'edit',
  profiles: {},
  section: 'optimize',
  version: process.env.REACT_APP_VERSION || 'local'
};

/**
 * Restore the application from localStorage
 * @returns Object state
 */
export function restoreState() {
  const state = window.localStorage.getItem('optimizer.state');

  if (state) {
    return deserializeState(state);
  } else {
    return defaultState;
  }
}

/**
 * Convert the state from an in-memory representation to a serialized representation
 * @param state Object
 */
export function serializeState(state) {
  if (null === state) {
    return null
  } else if ('function' === typeof state.serialize) {
    return state.serialize();
  } else if (state instanceof Array) {
    return state.map(item => serializeState(item));
  } else if (state instanceof Object) {
    return mapObject(state, serializeState);
  } else {
    return state;
  }
}

/**
 * Convert the state from a serialized representation to the in-memory representation used by the app
 * @param state Object
 */
export function deserializeState(state) {
  const jsonState = JSON.parse(state);
  const version = process.env.REACT_APP_VERSION || 'local';

  return {
    allyCode: jsonState.allyCode,
    characterEditMode: jsonState.characterEditMode || 'basic',
    characterFilter: jsonState.characterFilter || '',
    characters: mapObject(jsonState.characters, (character) => Character.deserialize(character, version)),
    error: null,
    isBusy: false,
    keepOldMods: jsonState.keepOldMods,
    modal: null,
    modListFilter: jsonState.modListFilter || {
      view: 'list',
      sort: 'assignedCharacter',
      tag: null
    },
    modSetsFilter: jsonState.modSetsFilter || 'all',
    optimizerView: jsonState.optimizerView || 'edit',
    profiles: mapObject(jsonState.profiles, PlayerProfile.deserialize),
    section: jsonState.section,
    version: version,
  };
}
