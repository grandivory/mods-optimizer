import {modSets, modSlots, modStats} from "../constants/enums";
import cleanAllyCode from "../utils/cleanAllyCode";
import {PlayerValues} from "../domain/CharacterDataClasses";
import Optimizer from "../utils/Optimizer";

export const CHANGE_SECTION = 'CHANGE_SECTION';
export const CHANGE_OPTIMIZER_VIEW = 'CHANGE_OPTIMIZER_VIEW';
export const REQUEST_CHARACTERS = 'REQUEST_CHARACTERS';
export const RECEIVE_CHARACTERS = 'RECEIVE_CHARACTERS';
export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const REQUEST_STATS = 'REQUEST_STATS';
export const RECEIVE_STATS = 'RECEIVE_STATS';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const RESET = 'RESET';
export const TOGGLE_KEEP_OLD_MODS = 'TOGGLE_KEEP_OLD_MODS';
export const RESTORE_PROGRESS = 'RESTORE_PROGRESS';
export const SET_MODS = 'SET_MODS';
export const SELECT_CHARACTER = 'SELECT_CHARACTER';
export const UNSELECT_CHARACTER = 'UNSELECT_CHARACTER';
export const LOCK_CHARACTER = 'LOCK_CHARACTER';
export const UNLOCK_CHARACTER = 'UNLOCK_CHARACTER';
export const CHANGE_CHARACTER_TARGET = 'CHANGE_CHARACTER_TARGET';
export const FINISH_EDIT_CHARACTER_TARGET = 'FINISH_EDIT_CHARACTER_TARGET';
export const RESET_CHARACTER_TARGET_TO_DEFAULT = 'RESET_CHARACTER_TARGET_TO_DEFAULT';
export const RESET_ALL_CHARACTER_TARGETS = 'RESET_ALL_CHARACTER_TARGETS';
export const DELETE_TARGET = 'DELETE_TARGET';
export const CHANGE_USE_FIVE_DOT_MODS = 'CHANGE_USE_FIVE_DOT_MODS';
export const CHANGE_CHARACTER_FILTER = 'CHANGE_CHARACTER_FILTER';
export const OPTIMIZE_MODS = 'OPTIMIZE_MODS';
export const FINISH_OPTIMIZE_MODS = 'FINISH_OPTIMIZE_MODS';
export const CHANGE_MOD_SET_FILTER = 'CHANGE_MOD_SET_FILTER';
export const LOG = 'LOG';

export function logState() {
  return {
    type: LOG
  };
}

export function changeSection(newSection) {
  return {
    type: CHANGE_SECTION,
    section: newSection
  };
}

export function changeOptimizerView(newView) {
  return {
    type: CHANGE_OPTIMIZER_VIEW,
    view: newView
  };
}

export function requestProfile(allyCode) {
  return {
    type: REQUEST_PROFILE,
    allyCode: allyCode
  };
}

export function receiveProfile(allyCode, profile) {
  return {
    type: RECEIVE_PROFILE,
    allyCode: allyCode,
    profile: profile
  };
}

export function requestCharacters() {
  return {
    type: REQUEST_CHARACTERS
  };
}

export function receiveCharacters(characters) {
  return {
    type: RECEIVE_CHARACTERS,
    characters: characters
  };
}

/**
 * Request the base and equipped stats for a list of characters
 * @returns {{type: string}}
 */
export function requestStats() {
  return {
    type: REQUEST_STATS
  };
}

/**
 * Handle the receipt of base and equipped stats for a list of characters
 * @param allyCode String
 * @param characterStats Object{Character.baseID: {baseStats: CharacterStats, equippedStats: CharacterStats}}
 * @returns {{type: string, allyCode: string, stats: *}}
 */
export function receiveStats(allyCode, characterStats) {
  return {
    type: RECEIVE_STATS,
    allyCode: allyCode,
    stats: characterStats
  };
}

export function showModal(modalClass, modalContent) {
  return {
    type: SHOW_MODAL,
    class: modalClass,
    content: modalContent
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  };
}

export function showError(errorContent) {
  return {
    type: SHOW_ERROR,
    content: errorContent
  };
}

export function hideError() {
  return {
    type: HIDE_ERROR
  };
}

export function reset() {
  return {
    type: RESET
  };
}

export function toggleKeepOldMods() {
  return {
    type: TOGGLE_KEEP_OLD_MODS,
  };
}

export function restoreProgress(progressData) {
  return {
    type: RESTORE_PROGRESS,
    progressData: progressData
  };
}

export function setMods(modsData) {
  return {
    type: SET_MODS,
    modsData: modsData
  };
}

export function startModOptimization() {
  return {
    type: OPTIMIZE_MODS
  };
}

export function finishModOptimization(result) {
  return {
    type: FINISH_OPTIMIZE_MODS,
    result: result
  };
}

/**
 * Action to move a character from the "available characters" pool to the "selected characters" pool, moving the
 * character in order just underneath prevCharacter, if it's supplied
 * @param character string The character ID of the character being selected
 * @param prevCharacter string The character ID of the character just above this one in the list
 * @returns {{type: string, characterID: *, prevCharacterID: *}}
 */
export function selectCharacter(character, prevCharacter = null) {
  return {
    type: SELECT_CHARACTER,
    characterID: character,
    prevCharacterID: prevCharacter
  };
}

/**
 * Action to move a character from the "selected characters" pool to the "available characters" pool.
 * @param character string the Character ID of the character being moved
 * @returns {{type: string, characterID: *}}
 */
export function unselectCharacter(character) {
  return {
    type: UNSELECT_CHARACTER,
    characterID: character
  };
}

/**
 * Lock a character so that their mods won't be assigned to other characters
 * @param character string the Character ID of the character being locked
 * @returns {{type: string, characterID: *}}
 */
export function lockCharacter(character) {
  return {
    type: LOCK_CHARACTER,
    characterID: character
  };
}

/**
 * Unlock a character so that their mods can be assigned to other characters
 * @param character string the Character ID of the character being unlocked
 * @returns {{type: string, characterID: *}}
 */
export function unlockCharacter(character) {
  return {
    type: UNLOCK_CHARACTER,
    characterID: character
  };
}

/**
 * Action to change the selected target for a character
 * @param character string the character ID of the character being updated
 * @param target OptimizationPlan The new target to use
 */
export function changeCharacterTarget(character, target) {
  return {
    type: CHANGE_CHARACTER_TARGET,
    characterID: character,
    target: target
  };
}

/**
 * Action to complete the editing of a character target, applying the new target values to the character
 * @param character string The character ID of the character being updated
 * @param newTarget OptimizationPlan The new target to use for the character
 */
export function finishEditCharacterTarget(character, newTarget) {
  return {
    type: FINISH_EDIT_CHARACTER_TARGET,
    characterID: character,
    target: newTarget
  };
}

/**
 * Reset the current-selected target for a character to its default values
 * @param character string The character ID of the character being reset
 * @returns {{type: string, characterID: *}}
 */
export function resetCharacterTargetToDefault(character) {
  return {
    type: RESET_CHARACTER_TARGET_TO_DEFAULT,
    characterID: character
  };
}

/**
 * Reset all character targets so that they match the default values
 * @returns {{type: string}}
 */
export function resetAllCharacterTargets() {
  return {
    type: RESET_ALL_CHARACTER_TARGETS
  };
}

/**
 * Delete the currently selected target for a given character
 * @param character string The character ID of the character being reset
 */
export function deleteTarget(character) {
  return {
    type: DELETE_TARGET,
    characterID: character
  };
}

/**
 * Change whether to use only 5-dot mods for a character
 * @param character string The character ID of the character being updated
 * @param use5DotMods boolean
 * @returns {{type: string, characterID: *, use5DotMods: *}}
 */
export function changeUse5DotMods(character, use5DotMods) {
  return {
    type: CHANGE_USE_FIVE_DOT_MODS,
    characterID: character,
    use5DotMods: use5DotMods
  };
}

/**
 * Update the filter that is used to highlight available characters
 * @param newFilter string
 * @returns {{type: string, filter: *}}
 */
export function changeCharacterFilter(newFilter) {
  return {
    type: CHANGE_CHARACTER_FILTER,
    filter: newFilter
  };
}

/**
 * Update the filter that is used to limit which mod sets are shown after optimizing mods
 * @param newFilter string
 * @returns {{type: string, filter: *}}
 */
export function changeModSetFilter(newFilter) {
  return {
    type: CHANGE_MOD_SET_FILTER,
    filter: newFilter
  };
}

function post(url='', data={}, extras={}) {
  return fetch(url, Object.assign({
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    mode: "cors",
  }, extras))
    .then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(errorText => {console.dir(errorText); return Promise.reject(new Error(errorText));});
        }
      }
    );
}

function dispatchFetchCharacters(dispatch) {
  dispatch(requestCharacters());
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .catch(error => dispatch(showError(error.message)))
    .then(characters => {dispatch(receiveCharacters(characters)); return characters;});
}

function dispatchFetchProfile(dispatch, allyCode) {
  dispatch(requestProfile(allyCode));
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/playerprofile/',
    {'ally-code': allyCode}
  )
    .then(
      playerProfile => {
        console.dir(playerProfile);
        const roster = playerProfile.roster.filter(entry => entry.type === 'CHARACTER');

        // Convert mods to the serialized format recognized by the optimizer
        const profileMods = roster.map(character =>
          character.mods.map(mod => {
            mod.characterID = character.defId;
            mod.mod_uid = mod.id;
            mod.set = modSets[mod.set];
            mod.slot = modSlots[mod.slot];
            mod.primaryBonusType = modStats[mod.primaryBonusType];
            for (let i = 1; i <= 4; i++) {
              mod[`secondaryType_${i}`] = modStats[mod[`secondaryType_${i}`]];
            }
            return mod;
          }))
          .reduce((allMods, charMods) => allMods.concat(charMods), []);

        // Convert each character to a PlayerValues object
        const profileCharacters = roster.reduce((characters, character) => {
          characters[character.defId] = new PlayerValues(
            character.level,
            character.rarity,
            character.gear,
            character.equipped.map(gear => {return {equipmentId: gear.equipmentId};}),
            character.gp
          );
          return characters;
        }, {});

        return {
          mods: profileMods,
          characters: profileCharacters
        };
      },
    )
    .catch(error => dispatch(showError(error.message)))
    .then(profile => {
      dispatch(receiveProfile(allyCode, profile));
      return profile;
    });
}

function dispatchFetchCharacterStats(dispatch, allyCode, characters = null) {
  if (null !== characters) {
    return post(
      'https://crinolo-swgoh.glitch.me/statCalc/api/characters',
      Object.keys(characters).map(charID => {
        return {
          'defId': charID,
          'rarity': characters[charID].stars,
          'level': characters[charID].level,
          'gear': characters[charID].gearLevel,
          'equipped': characters[charID].gearPieces
        };
      })
    )
      .catch(error => dispatch(showError(error.message)))
      .then(statsResponse => {dispatch(receiveStats(allyCode, statsResponse)); return statsResponse;});
  } else {
    return Promise.resolve()
      .then(() => dispatch(receiveStats(allyCode, null)));
  }
}

export function refreshPlayerData(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacters(dispatch, cleanedAllyCode)
      .then(() => dispatchFetchProfile(dispatch, cleanedAllyCode))
      .then(profile => dispatchFetchCharacterStats(dispatch, cleanedAllyCode, profile ? profile.characters : null))
      .catch(error => dispatch(showError(error.message)));
  }
}

/**
 * Asynchronously fetch the set of all characters from swgoh.gg
 *
 * @param allyCode string The ally code under which to store the character information
 */
export function fetchCharacters(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacters(dispatch, cleanedAllyCode)
      .catch(error => dispatch(showError(error.message)));
  }
}

/**
 * Asynchronously fetch a player's profile, updating state before the fetch to show that the app is busy, and after
 * the fetch to fill in with the response
 *
 * @param allyCode string The ally code to fetch a profile for
 */
export function fetchProfile(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function (dispatch) {
    return dispatchFetchProfile(dispatch, cleanedAllyCode)
      .catch(error => dispatch(showError(error.message)));
  }
}

export function fetchCharacterStats(allyCode, characters) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacterStats(dispatch, cleanedAllyCode, characters)
      .catch(error => dispatch(showError(error.message)));
  }
}

/**
 * Run the optimization algorithm and update the player's profile with the results
 * @param mods Array[Mod]
 * @param characters {Character.baseID => Character}
 * @param order Array[Character.baseID]
 */
export function optimizeMods(mods, characters, order) {
  return function(dispatch) {
    dispatch(startModOptimization());
    const optimize = new Promise((resolve) => {
      setTimeout(() => resolve((new Optimizer()).optimizeMods(mods, characters, order)), 0);
    });

    optimize.then(result => dispatch(finishModOptimization(result)));
  };
}
