import {CHANGE_SECTION, REQUEST_PROFILE, RECEIVE_PROFILE, LOG, REQUEST_CHARACTERS, RECEIVE_CHARACTERS} from "./actions";
import {restoreState, saveState} from "./storage";
import {mapObject} from "../utils/mapObject";
import characterSettings from "../constants/characterSettings";
import Character from "../domain/Character";
import {GameSettings} from "../domain/CharacterDataClasses";

function changeSection(state, action) {
  return Object.assign({}, state, {
    section: action.section
  });
}

function requestCharacters(state, action) {
  // First, update all existing characters with their current default settings
  // Then, set the app to busy so that it can fetch the new character data
  return Object.assign({}, state, {
      characters: mapObject(
        state.characters,
        character => character.withDefaultSettings(characterSettings[character.baseID])
      )
    },
    // {
    //   profiles: Object.assign({}, state.profiles, {
    //     [action.allyCode]: Object.assign({}, profile, {
    //       characters: mapObject(
    //         profile.characters, character => character.withDefaultSettings(characterSettings[character.baseID])
    //       )
    //     })
    //   })
    // },
    {isBusy: true});
}

/**
 * Update the set of known characters in the state (independent of any one profile) with data from swgoh.gg
 * @param state
 * @param action
 * @returns {*}
 */
function receiveCharacters(state, action) {
  let newCharacters = {};

  action.characters.forEach(character => {
    const gameSettings = new GameSettings(
      character.name,
      character.image,
      character.categories.concat([character.alignment, character.role]),
      character.description
    );

    if (state.characters.hasOwnProperty(character.base_id)) {
      newCharacters[character.base_id] = state.characters[character.base_id].withGameSettings(gameSettings);
    } else {
      newCharacters[character.base_id] = Character.default(character.base_id).withGameSettings(gameSettings);
    }
  });

  return Object.assign({}, state, {
    isBusy: false,
    characters: newCharacters
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
  let newState;

  if (null == state) {
    state = restoreState();
  }

  console.log(action);
  switch (action.type) {
    case CHANGE_SECTION:
      return changeSection(state, action);
    case REQUEST_CHARACTERS:
      return requestCharacters(state, action);
    case RECEIVE_CHARACTERS:
      newState = receiveCharacters(state, action);
      saveState(newState);
      return newState;
    case REQUEST_PROFILE:
      return requestProfile(state, action);
    case RECEIVE_PROFILE:
      newState = receiveProfile(state, action);
      saveState(newState);
      return newState;
    case LOG:
      console.log(state);
      return Object.assign({}, state);
    default:
      return state;
  }
}
