// @flow
import {hideModal, updateProfile} from "./app";
import {mapObject} from "../../utils/mapObject";

export const CHANGE_CHARACTER_EDIT_MODE = 'CHANGE_CHARACTER_EDIT_MODE';
export const CHANGE_CHARACTER_FILTER = 'CHANGE_CHARACTER_FILTER';
export const CHANGE_SET_RESTRICTIONS = 'CHANGE_SET_RESTRICTIONS';
export const SELECT_SET_BONUS = 'SELECT_SET_BONUS';
export const REMOVE_SET_BONUS = 'REMOVE_SET_BONUS';

/**
 * Action to move a character from the "available characters" pool to the "selected characters" pool, moving the
 * character in order just underneath prevCharacter, if it's supplied
 * @param characterID string The character ID of the character being selected
 * @param prevCharacterID string The character ID of the character just above this one in the list
 * @returns {Function}
 */
export function selectCharacter(characterID, prevCharacterID = null) {
  return updateProfile(profile => {
    const oldSelectedCharacters = profile.selectedCharacters;
    if (oldSelectedCharacters.includes(characterID)) {
      // If the character is already in the list, remove it unless the prevCharacterID matches itself (it wasn't moved)
      if (prevCharacterID === characterID) {
        return profile;
      } else {
        oldSelectedCharacters.splice(oldSelectedCharacters.indexOf(characterID), 1);
      }
    }

    if (!prevCharacterID) {
      return profile.withSelectedCharacters([characterID].concat(oldSelectedCharacters));
    } else if (!profile.selectedCharacters.includes(prevCharacterID)) {
      return profile.withSelectedCharacters(oldSelectedCharacters.concat([characterID]));
    } else {
      const newSelectedCharacters = oldSelectedCharacters.slice();
      newSelectedCharacters.splice(newSelectedCharacters.indexOf(prevCharacterID) + 1, 0, characterID);

      return profile.withSelectedCharacters(newSelectedCharacters);
    }
  });
}

/**
 * Action to move a character from the "selected characters" pool to the "available characters" pool.
 * @param characterID string the Character ID of the character being moved
 * @returns {Function}
 */
export function unselectCharacter(characterID) {
  return updateProfile(profile => {
    const newSelectedCharacters = profile.selectedCharacters.slice();
    const oldCharacter = profile.characters[characterID];

    if (newSelectedCharacters.includes(characterID)) {
      newSelectedCharacters.splice(newSelectedCharacters.indexOf(characterID), 1);
    }

    return profile.withSelectedCharacters(newSelectedCharacters)
    // If we unselect a character, we also need to unlock it
      .withCharacters(Object.assign({}, profile.characters, {
        [characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock())
      }));
  });
}

/**
 * Action to remove all characters from the "selected characters" pool, returning them to "available characters".
 * @returns {Function}
 */
export function unselectAllCharacters() {
  return updateProfile(profile =>
    profile.withCharacters(
      mapObject(
        profile.characters,
        character => character.withOptimizerSettings(character.optimizerSettings.unlock())
      )
    ).withSelectedCharacters([]));
}

/**
 * Action to lock all characters from the "selected characters" pool
 * @returns {Function}
 */
export function lockSelectedCharacters() {
  return updateProfile(profile =>
    profile.withCharacters(
      mapObject(
        profile.characters,
        character => profile.selectedCharacters.includes(character.baseID) ?
          character.withOptimizerSettings(character.optimizerSettings.lock()) :
          character
      )
    ));
}

/**
 * Action to unlock all characters from the "selected characters" pool
 * @returns {Function}
 */
export function unlockSelectedCharacters() {
  return updateProfile(profile =>
    profile.withCharacters(
      mapObject(
        profile.characters,
        character => profile.selectedCharacters.includes(character.baseID) ?
          character.withOptimizerSettings(character.optimizerSettings.unlock()) :
          character
      )
    )
  );
}

/**
 * Lock a character so that their mods won't be assigned to other characters
 * @param characterID string the Character ID of the character being locked
 * @returns {Function}
 */
export function lockCharacter(characterID) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID]
    const newCharacters = Object.assign({}, profile.characters, {
      [characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.lock())
    });

    return profile.withCharacters(newCharacters);
  });
}

/**
 * Unlock a character so that their mods can be assigned to other characters
 * @param characterID string the Character ID of the character being unlocked
 * @returns {Function}
 */
export function unlockCharacter(characterID) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID]
    const newCharacters = Object.assign({}, profile.characters, {
      [characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock())
    });

    return profile.withCharacters(newCharacters);
  });
}

/**
 * Action to change the selected target for a character
 * @param characterID string the character ID of the character being updated
 * @param target OptimizationPlan The new target to use
 * @returns {Function}
 */
export function changeCharacterTarget(characterID, target) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [characterID]:
        oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock().withTarget(target))
    }));
  });
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
 * @param characterID string The character ID of the character being updated
 * @param newTarget OptimizationPlan The new target to use for the character
 * @returns {Function}
 */
export function finishEditCharacterTarget(characterID, newTarget) {
  return updateProfile(
    profile => {
      const oldCharacter = profile.characters[characterID];
      const newCharacter = oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withTarget(newTarget));

      return profile.withCharacters(Object.assign({}, profile.characters, {
        [newCharacter.baseID]: newCharacter
      }));
    },
    dispatch => {
      dispatch(hideModal());
      dispatch(changeSetRestrictions(null));
    }
  );
}

/**
 * Reset the current-selected target for a character to its default values
 * @param characterID string The character ID of the character being reset
 * @returns {Function}
 */
export function resetCharacterTargetToDefault(characterID) {
  return updateProfile(
    profile => profile.withCharacters(Object.assign({}, profile.characters, {
      [characterID]: profile.characters[characterID].withResetTarget()
    })),
    dispatch => {
      dispatch(hideModal());
      dispatch(changeSetRestrictions(null));
    }
  );
}

/**
 * Reset all character targets so that they match the default values
 * @returns {Function}
 */
export function resetAllCharacterTargets() {
  return updateProfile(
    profile => profile.withCharacters(mapObject(profile.characters, character => character.withResetTargets())),
    dispatch => dispatch(hideModal())
  );
}

/**
 * Delete the currently selected target for a given character
 * @param characterID string The character ID of the character being reset
 * @returns {Function}
 */
export function deleteTarget(characterID) {
  return updateProfile(
    profile => {
      const oldCharacter = profile.characters[characterID];

      return profile.withCharacters(Object.assign({}, profile.characters, {
        [characterID]: oldCharacter.withDeletedTarget()
      }));
    },
    dispatch => {
      dispatch(hideModal());
      dispatch(changeSetRestrictions(null));
    }
  );
}

/**
 * Change the minimum dots that a mod needs to be used for a character
 * @param characterID string The character ID of the character being updated
 * @param minimumModDots Integer
 * @returns {Function}
 */
export function changeMinimumModDots(characterID, minimumModDots) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [characterID]:
        oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withMinimumModDots(minimumModDots))
    }));
  });
}

/**
 * Change whether to slice mods when optimizing a given character
 * @param characterID string The character ID of the character being updated
 * @param sliceMods boolean
 * @returns {Function}
 */
export function changeSliceMods(characterID, sliceMods) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withModSlicing(sliceMods))
    }));
  });
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
 * Update the threshold before the optimizer will suggest changing mods on a character
 * @param threshold
 * @returns {Function}
 */
export function updateModChangeThreshold(threshold) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, {modChangeThreshold: threshold})
    )
  );
}

/**
 * Update whether to keep all unselected characters locked.
 * @param lock {boolean}
 * @returns {Function}
 */
export function updateLockUnselectedCharacters(lock) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, {lockUnselectedCharacters: lock})
    )
  );
}

/**
 * Fill the set restrictions to display on the character edit form
 * @param setRestrictions
 * @returns {{setRestrictions: *, type: string}}
 */
export function changeSetRestrictions(setRestrictions) {
  return {
    type: CHANGE_SET_RESTRICTIONS,
    setRestrictions: setRestrictions
  };
}

/**
 * Add a set bonus to the currently selected sets
 *
 * @param setBonus
 * @returns {{setBonus: *, type: string}}
 */
export function selectSetBonus(setBonus) {
  return {
    type: SELECT_SET_BONUS,
    setBonus: setBonus
  };
}

/**
 * Remove a set bonus from the currently selected sets
 *
 * @param setBonus
 * @returns {{setBonus: *, type: string}}
 */
export function removeSetBonus(setBonus) {
  return {
    type: REMOVE_SET_BONUS,
    setBonus: setBonus
  };
}
