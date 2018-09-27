/**
 * Save the state of the application to localStorage
 * @param state Object
 */
import {mapObject} from "../utils/mapObject";

export function saveState(state) {
  const storedState = serializeState(state);
  window.localStorage.setItem('optimizer.state', JSON.stringify(storedState));
}

/**
 * Restore the application from localStorage
 * @returns Object state
 */
export function restoreState() {

}

/**
 * Convert the state from an in-memory representation to a serialized representation
 * @param state Object
 */
export function serializeState(state) {
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
