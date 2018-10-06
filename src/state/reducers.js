// @flow

import {
  CHANGE_SECTION,
  HIDE_ERROR,
  HIDE_MODAL,
  LOG,
  RECEIVE_CHARACTERS,
  RECEIVE_PROFILE,
  RECEIVE_STATS,
  REQUEST_CHARACTERS,
  REQUEST_PROFILE,
  REQUEST_STATS,
  RESET, RESTORE_PROGRESS,
  SHOW_ERROR,
  SHOW_MODAL, TOGGLE_KEEP_OLD_MODS
} from "./actions";
import {defaultState, deserializeState, restoreState, saveState} from "./storage";
import {mapObject, mapObjectByKeyAndValue} from "../utils/mapObject";
import characterSettings from "../constants/characterSettings";
import Character from "../domain/Character";
import {GameSettings, OptimizerSettings} from "../domain/CharacterDataClasses";
import Mod from "../domain/Mod";
import PlayerProfile from "../domain/PlayerProfile";
import CharacterStats, {NullCharacterStats} from "../domain/CharacterStats";

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
    {isBusy: true}
  );
}

/**
 * Update the set of known characters in the state (independent of any one profile) with data from swgoh.gg
 * @param state
 * @param action
 * @returns {*}
 */
function receiveCharacters(state, action) {
  if (!action.characters) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

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

/**
 * Update the profile for a particular ally code with new mod and character data
 * @param state
 * @param action
 */
function receiveProfile(state, action) {
  if (!action.profile || !action.profile.characters) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

  // First, update the characters by combining the PlayerValues objects in the action
  // with the base characters in the state
  const newCharacters = mapObjectByKeyAndValue(action.profile.characters, (id, playerValues) => {
    const character = state.characters.hasOwnProperty(id) ?
      state.characters[id].withPlayerValues(playerValues) :
      Character.default(id).withPlayerValues(playerValues);

    // When a profile is updated, make sure that the character has optimizer settings so that the optimizer can actually
    // work with it. If nothing has been set yet, then set reasonable defaults.
    if (character.optimizerSettings) {
      return character;
    } else {
      return character.withOptimizerSettings(new OptimizerSettings(
        character.defaultSettings.targets[0],
        [],
        character.defaultSettings.extraTags.includes('Crew Member'),
        false
      ));
    }
  });

  // Then, update the mods by deserializing each one
  const newMods = action.profile.mods.reduce((mods, mod) => {
    mods[mod.mod_uid] = Mod.deserialize(mod);
    return mods;
  }, {});

  const oldProfile = state.profiles.hasOwnProperty(action.allyCode) ?
    state.profiles[action.allyCode] :
    new PlayerProfile();

  let finalMods;

  if (state.keepOldMods) {
    const oldMods = oldProfile.mods.reduce((mods, mod) => {
      mods[mod.id] = mod.unequip();
      return mods;
    }, {});

    finalMods = Object.values(Object.assign({}, oldMods, newMods));
  } else {
    finalMods = Object.values(newMods);
  }

  const newProfile = oldProfile.withCharacters(newCharacters).withMods(finalMods);

  return Object.assign({}, state, {
    isBusy: false,
    allyCode: action.allyCode,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: newProfile
    })
  });
}

function requestStats(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

/**
 * Update all of the characters for a profile with new base and equipped stats
 * @param state
 * @param action
 */
function receiveStats(state, action) {
  if (!action.stats) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

  const profile = state.profiles[action.allyCode];

  const newProfile = profile.withCharacters(
    action.stats.reduce((characters, statObject) => {
      const character = profile.characters[statObject.unit.defId];

      const baseStats = statObject.stats.base ?
        new CharacterStats(
          statObject.stats.base['Health'] || 0,
          statObject.stats.base['Protection'] || 0,
          statObject.stats.base['Speed'] || 0,
          statObject.stats.base['Potency'] || 0,
          statObject.stats.base['Tenacity'] || 0,
          statObject.stats.base['Physical Damage'] || 0,
          statObject.stats.base['Physical Critical Rating'] || 0,
          statObject.stats.base['Armor'] || 0,
          statObject.stats.base['Special Damage'] || 0,
          statObject.stats.base['Special Critical Rating'] || 0,
          statObject.stats.base['Resistance'] || 0
        ) :
        NullCharacterStats;

      let equippedStats = NullCharacterStats;

      if (statObject.stats.gear) {
        const gearStats = new CharacterStats(
          statObject.stats.gear['Health'] || 0,
          statObject.stats.gear['Protection'] || 0,
          statObject.stats.gear['Speed'] || 0,
          statObject.stats.gear['Potency'] || 0,
          statObject.stats.gear['Tenacity'] || 0,
          statObject.stats.gear['Physical Damage'] || 0,
          statObject.stats.gear['Physical Critical Rating'] || 0,
          statObject.stats.gear['Armor'] || 0,
          statObject.stats.gear['Special Damage'] || 0,
          statObject.stats.gear['Special Critical Rating'] || 0,
          statObject.stats.gear['Resistance'] || 0
        );
        equippedStats = baseStats.plus(gearStats);
      }

      characters[statObject.unit.defId] =
        character.withPlayerValues(character.playerValues.withBaseStats(baseStats).withEquippedStats(equippedStats));

      return characters;
    }, {})
  );

  const errorCharacters = Object.keys(profile.characters).filter(charID =>
    !Object.keys(newProfile.characters).includes(charID)
  ).map(charID => profile[charID].name);

  const errorMessage = errorCharacters.length > 0 ?
    'Missing stats for characters: ' + errorCharacters.join(', ') +
    '. These characters may not optimize properly.'
    : null;

  return Object.assign({}, state, {
    allyCode: action.allyCode,
    error: errorMessage,
    isBusy: false,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: newProfile
    })
  });
}

function showModal(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    modal: action.content
  });
}

function hideModal(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    modal: null
  });
}

function showError(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    error: action.content
  });
}

function hideError(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    error: null
  });
}

function reset(state, action) {
  return Object.assign({}, defaultState);
}

function toggleKeepOldMods(state, action) {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}

function restoreProgress(state, action) {
  return deserializeState(action.progressData);
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
      return requestCharacters(state, action);
    case RECEIVE_CHARACTERS:
      return saveState(receiveCharacters(state, action));
    case REQUEST_PROFILE:
      return requestProfile(state, action);
    case RECEIVE_PROFILE:
      return saveState(receiveProfile(state, action));
    case REQUEST_STATS:
      return requestStats(state, action);
    case RECEIVE_STATS:
      return saveState(receiveStats(state, action));
    case SHOW_MODAL:
      return showModal(state, action);
    case HIDE_MODAL:
      return hideModal(state, action);
    case SHOW_ERROR:
      return showError(state, action);
    case HIDE_ERROR:
      return hideError(state, action);
    case RESET:
      return saveState(reset(state, action));
    case TOGGLE_KEEP_OLD_MODS:
      return saveState(toggleKeepOldMods(state, action));
    case RESTORE_PROGRESS:
      return saveState(restoreProgress(state, action));
    case LOG:
      console.log(state);
      return Object.assign({}, state);
    default:
      return state;
  }
}
