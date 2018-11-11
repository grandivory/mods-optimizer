// @flow
export const SELECT_CHARACTER = 'SELECT_CHARACTER';
export const UNSELECT_CHARACTER = 'UNSELECT_CHARACTER';
export const UNSELECT_ALL_CHARACTERS = 'UNSELECT_ALL_CHARACTERS';
export const LOCK_CHARACTER = 'LOCK_CHARACTER';
export const UNLOCK_CHARACTER = 'UNLOCK_CHARACTER';
export const CHANGE_CHARACTER_TARGET = 'CHANGE_CHARACTER_TARGET';
export const CHANGE_CHARACTER_EDIT_MODE = 'CHANGE_CHARACTER_EDIT_MODE';
export const FINISH_EDIT_CHARACTER_TARGET = 'FINISH_EDIT_CHARACTER_TARGET';
export const RESET_CHARACTER_TARGET_TO_DEFAULT = 'RESET_CHARACTER_TARGET_TO_DEFAULT';
export const RESET_ALL_CHARACTER_TARGETS = 'RESET_ALL_CHARACTER_TARGETS';
export const DELETE_TARGET = 'DELETE_TARGET';
export const CHANGE_MINIMUM_MOD_DOTS = 'CHANGE_MINIMUM_MOD_DOTS';
export const CHANGE_CHARACTER_FILTER = 'CHANGE_CHARACTER_FILTER';

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
 * Action to remove all characters from the "selected characters" pool, returning them to "available characters".
 * @returns {{type: string}}
 */
export function unselectAllCharacters() {
  return {
    type: UNSELECT_ALL_CHARACTERS
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
 * Switch between basic and advanced edit mode
 * @param mode
 * @returns {{type: string, mode: *}}
 */
export function changeCharacterEditMode(mode) {
  return {
    type: CHANGE_CHARACTER_EDIT_MODE,
    mode: mode
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
 * Change the minimum dots that a mod needs to be used for a character
 * @param character string The character ID of the character being updated
 * @param minimumModDots Integer
 * @returns {{type: string, characterID: string, minimumModDots: number}}
 */
export function changeMinimumModDots(character, minimumModDots) {
  return {
    type: CHANGE_MINIMUM_MOD_DOTS,
    characterID: character,
    minimumModDots: minimumModDots
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
