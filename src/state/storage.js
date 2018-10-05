/**
 * Save the state of the application to localStorage
 * @param state Object
 */
import {mapObject, mapObjectByKey} from "../utils/mapObject";
import Character from "../domain/Character";
import characterSettings from "../constants/characterSettings";
import PlayerProfile from "../domain/PlayerProfile";

export function saveState(state) {
  const storedState = serializeState(state);
  window.localStorage.setItem('optimizer.state', JSON.stringify(storedState));
}

/**
 * Restore the application from localStorage
 * @returns Object state
 */
export function restoreState() {
  const state = window.localStorage.getItem('optimizer.state');

  if (state) {
    return deserializeState(state);
  } else {
    return {
      version: process.env.REACT_APP_VERSION || 'local',
      section: 'optimize',
      characterFilter: '',
      allyCode: '',
      characters: mapObjectByKey(characterSettings, baseID => Character.default(baseID)),
      isBusy: false,
      profiles: {}
    };
  }
}

/**
 * Convert the state from an in-memory representation to a serialized representation
 * @param state Object
 */
function serializeState(state) {
  if ('function' === typeof state.serialize) {
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
function deserializeState(state) {
  const jsonState = JSON.parse(state);
  const version = process.env.REACT_APP_VERSION || 'local';

  return {
    version: version,
    section: jsonState.section,
    characterFilter: jsonState.characterFilter || '',
    allyCode: jsonState.allyCode,
    isBusy: false,
    characters: mapObject(jsonState.characters, (character) => Character.deserialize(character, version)),
    profiles: mapObject(jsonState.profiles, PlayerProfile.deserialize)
  };
}
