import {CHANGE_SECTION, REQUEST_PROFILE, RECEIVE_PROFILE, LOG, REQUEST_CHARACTERS, RECEIVE_CHARACTERS} from "./actions";
import {restoreState, saveState} from "./storage";
import {mapObject} from "../utils/mapObject";
import characterSettings from "../constants/characterSettings";

function changeSection(state, action) {
  return Object.assign({}, state, {
    section: action.section
  });
}

function requestCharacters(state, action) {
  // First, update all existing characters with their current default settings
  // Then, set the app to busy so that it can fetch the new character data
  const profile = state.profiles[action.allyCode] ? state.profiles[action.allyCode] : {};

  return Object.assign({}, state,
    {
      profiles: Object.assign({}, state.profiles, {
        [action.allyCode]: Object.assign({}, profile, {
          characters: mapObject(
            profile.characters, character => character.withDefaultSettings(characterSettings[character.baseID])
          )
        })
      })
    },
    {isBusy: true});
}

/**
 * Update the profile for a particular
 * @param state
 * @param action
 * @returns {*}
 */
function receiveCharacters(state, action) {
  const oldCharacters = state.profiles[action.allyCode] ? state.profiles[action.allyCode].characters : {};
  let newCharacters = {};

  action.characters.forEach(character => {
    if (oldCharacters.hasOwnProperty(character.baseID)) {
      newCharacters[character.baseID] = oldCharacters[character.baseID].with
    }
  });







  return Object.assign({}, state, {
    isBusy: false,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: Object.assign({}, state.profiles[action.allyCode] || {}, {
        characters: Object.assign({}, state.profiles[action.allyCode].characters, )
      })
    })
  })
}

function requestProfile(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

function receiveProfile(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    allyCode: action.allyCode,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: action.profile
    })
  });
}

export function optimizerApp(state, action) {
  if (null == state) {
    state = restoreState();
  }

  console.log(action);
  switch (action.type) {
    case CHANGE_SECTION:
      return changeSection(state, action);
    case REQUEST_CHARACTERS:
      const foo = requestCharacters(state, action);
      console.log(foo);
      return foo;
    case RECEIVE_CHARACTERS:
      return receiveCharacters(state, action);
    case REQUEST_PROFILE:
      return requestProfile(state, action);
    case RECEIVE_PROFILE:
      const newState = receiveProfile(state, action);
      saveState(newState);
      return newState;
    case LOG:
      console.log(state);
      return Object.assign({}, state);
    default:
      return state;
  }
}
