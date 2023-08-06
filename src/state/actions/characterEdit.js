// @flow
import { hideModal, showFlash, updateProfile } from "./app";
import { mapObject } from "../../utils/mapObject";
import groupByKey from "../../utils/groupByKey";
import collectByKey from "../../utils/collectByKey";
import OptimizationPlan from "../../domain/OptimizationPlan";
import getDatabase from "../storage/Database";
import { loadCharacterTemplates } from "./storage";

const defaultTemplates = groupByKey(require('../../constants/characterTemplates.json'), ({ name }) => name);

export const CHANGE_CHARACTER_EDIT_MODE = 'CHANGE_CHARACTER_EDIT_MODE';
export const CHANGE_CHARACTER_FILTER = 'CHANGE_CHARACTER_FILTER';
export const TOGGLE_HIDE_SELECTED_CHARACTERS = 'TOGGLE_HIDE_SELECTED_CHARACTERS';
export const TOGGLE_CHARACTER_EDIT_SORT_VIEW = 'TOGGLE_CHARACTER_EDIT_SORT_VIEW';
export const CHANGE_SET_RESTRICTIONS = 'CHANGE_SET_RESTRICTIONS';
export const SELECT_SET_BONUS = 'SELECT_SET_BONUS';
export const REMOVE_SET_BONUS = 'REMOVE_SET_BONUS';
export const CHANGE_TARGET_STATS = 'CHANGE_TARGET_STATS';
export const ADD_TARGET_STAT = 'ADD_TARGET_STAT';
export const REMOVE_TARGET_STAT = 'REMOVE_TARGET_STAT';

/**
 * Action to move a character from the "available characters" pool to the "selected characters" pool, moving the
 * character in order just underneath prevIndex, if it's supplied
 * @param characterID {String} The character ID of the character being selected
 * @param target {OptimizationPlan} The target to attach to the newly-selected character
 * @param prevIndex {Number} Where in the selected characters list to place the new character
 * @returns {Function}
 */
export function selectCharacter(characterID, target, prevIndex = null) {
  const selectedCharacter = { id: characterID, target: target };

  return updateProfile(profile => {
    const oldSelectedCharacters = profile.selectedCharacters;

    if (null === prevIndex) {
      // If there's no previous index, put the new character at the top of the list
      return profile.withSelectedCharacters([selectedCharacter].concat(oldSelectedCharacters));
    } else {
      const newSelectedCharacters = oldSelectedCharacters.slice();
      newSelectedCharacters.splice(
        prevIndex + 1,
        0,
        selectedCharacter
      );

      return profile.withSelectedCharacters(newSelectedCharacters);
    }
  });
}

/**
 * Move an already-selected character to a new position in the selected list
 * @param fromIndex {Number}
 * @param toIndex {Number}
 * @returns {Function}
 */
export function moveSelectedCharacter(fromIndex, toIndex) {
  return updateProfile(profile => {
    if (fromIndex === toIndex) {
      return profile;
    } else {
      const newSelectedCharacters = profile.selectedCharacters.slice();
      const [oldValue] = newSelectedCharacters.splice(fromIndex, 1);
      if (null === toIndex) {
        return profile.withSelectedCharacters([oldValue].concat(newSelectedCharacters));
      } else if (fromIndex < toIndex) {
        newSelectedCharacters.splice(toIndex, 0, oldValue);
        return profile.withSelectedCharacters(newSelectedCharacters);
      } else {
        newSelectedCharacters.splice(toIndex + 1, 0, oldValue);
        return profile.withSelectedCharacters(newSelectedCharacters);
      }
    }
  });
}

/**
 * Move a character from the "selected characters" pool to the "available characters" pool.
 * @param characterIndex {Number} The location of the character being unselected from the list
 * @returns {Function}
 */
export function unselectCharacter(characterIndex) {
  return updateProfile(profile => {
    const newSelectedCharacters = profile.selectedCharacters.slice();

    if (newSelectedCharacters.length > characterIndex) {
      newSelectedCharacters.splice(characterIndex, 1);
      return profile.withSelectedCharacters(newSelectedCharacters);
    } else {
      return profile;
    }
  });
}

/**
 * Action to remove all characters from the "selected characters" pool, returning them to "available characters".
 * @returns {Function}
 */
export function unselectAllCharacters() {
  return updateProfile(profile =>
    profile.withSelectedCharacters([]));
}

/**
 * Action to lock all characters from the "selected characters" pool
 * @returns {Function}
 */
export function lockSelectedCharacters() {
  return updateProfile(profile => {
    const selectedCharacterIDs = Object.keys(groupByKey(profile.selectedCharacters, ({ id }) => id));

    return profile.withCharacters(
      mapObject(
        profile.characters,
        character => selectedCharacterIDs.includes(character.baseID) ?
          character.withOptimizerSettings(character.optimizerSettings.lock()) :
          character
      )
    );
  });
}

/**
 * Action to unlock all characters from the "selected characters" pool
 * @returns {Function}
 */
export function unlockSelectedCharacters() {
  return updateProfile(profile => {
    const selectedCharacterIDs = Object.keys(groupByKey(profile.selectedCharacters, ({ id }) => id));

    return profile.withCharacters(
      mapObject(
        profile.characters,
        character => selectedCharacterIDs.includes(character.baseID) ?
          character.withOptimizerSettings(character.optimizerSettings.unlock()) :
          character
      )
    );
  });
}

export function lockAllCharacters() {
  return updateProfile(profile =>
    profile.withCharacters(mapObject(profile.characters, character =>
      character.withOptimizerSettings(character.optimizerSettings.lock())
    ))
  );
}

export function unlockAllCharacters() {
  return updateProfile(profile =>
    profile.withCharacters(mapObject(profile.characters, character =>
      character.withOptimizerSettings(character.optimizerSettings.unlock())
    ))
  );
}

/**
 * Lock a character so that their mods won't be assigned to other characters
 * @param characterID string the Character ID of the character being locked
 * @returns {Function}
 */
export function lockCharacter(characterID) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID];
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
    const oldCharacter = profile.characters[characterID];
    const newCharacters = Object.assign({}, profile.characters, {
      [characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock())
    });

    return profile.withCharacters(newCharacters);
  });
}

export function toggleCharacterLock(characterID) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID];
    const newCharacters = Object.assign({}, profile.characters, {
      [characterID]: oldCharacter.withOptimizerSettings(
        oldCharacter.optimizerSettings.isLocked ?
          oldCharacter.optimizerSettings.unlock() :
          oldCharacter.optimizerSettings.lock()
      )
    });

    return profile.withCharacters(newCharacters);
  });
}

export function toggleSliceMods(characterID) {
  return updateProfile(profile => {
    const oldCharacter = profile.characters[characterID];
    const newCharacters = Object.assign({}, profile.characters, {
      [characterID]: oldCharacter.withOptimizerSettings(
        oldCharacter.optimizerSettings.withModSlicing(
          !oldCharacter.optimizerSettings.sliceMods
        )
      )
    });

    return profile.withCharacters(newCharacters);
  });
}

export function toggleUpgradeMods(characterIndex) {
  return updateProfile(profile => {
    const oldCharacter = profile.selectedCharacters[characterIndex];
    const newSelectedCharacters = profile.selectedCharacters.slice(0);
    newSelectedCharacters.splice(characterIndex, 1, Object.assign({}, oldCharacter, {
      target: oldCharacter.target.withUpgradeMods(!oldCharacter.target.upgradeMods)
    }));

    return profile.withSelectedCharacters(newSelectedCharacters);
  });
}

/**
 * Action to change the selected target for a character
 * @param characterIndex {Number} The index of the selected character whose target is being updated
 * @param target {OptimizationPlan} The new target to use
 * @returns {Function}
 */
export function changeCharacterTarget(characterIndex, target) {
  return updateProfile(profile => {
    const newSelectedCharacters = profile.selectedCharacters.slice();
    if (characterIndex >= newSelectedCharacters.length) {
      return profile;
    }

    const [oldValue] = newSelectedCharacters.splice(characterIndex, 1);
    const newValue = Object.assign({}, oldValue, { target: target });
    newSelectedCharacters.splice(characterIndex, 0, newValue);

    return profile.withSelectedCharacters(newSelectedCharacters);
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
 * @param characterIndex {Number} The index in the selected characters list of the character being updated
 * @param newTarget OptimizationPlan The new target to use for the character
 * @returns {Function}
 */
export function finishEditCharacterTarget(characterIndex, newTarget) {
  return updateProfile(
    profile => {
      const newSelectedCharacters = profile.selectedCharacters.slice();
      const [{ id: characterID }] = newSelectedCharacters.splice(characterIndex, 1);
      newSelectedCharacters.splice(characterIndex, 0, { id: characterID, target: newTarget });

      const oldCharacter = profile.characters[characterID];
      const newCharacter = oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withTarget(newTarget));

      return profile.withCharacters(Object.assign({}, profile.characters, {
        [newCharacter.baseID]: newCharacter
      })).withSelectedCharacters(newSelectedCharacters);
    }
  );
}

export function closeEditCharacterForm() {
  return function (dispatch) {
    dispatch(hideModal());
    dispatch(changeSetRestrictions(null));
    dispatch(changeTargetStats(null));
    dispatch(setOptimizeIndex(null));
  }
}

/**
 * Reset a given target for a character to its default values
 * @param characterID {String} The character ID of the character being reset
 * @param targetName {String} The name of the target to reset
 * @returns {Function}
 */
export function resetCharacterTargetToDefault(characterID, targetName) {
  return updateProfile(
    profile => {
      const newCharacter = profile.characters[characterID].withResetTarget(targetName);
      const resetTarget = newCharacter.optimizerSettings.targets.find(target => target.name === targetName) ||
        new OptimizationPlan('unnamed');

      const newSelectedCharacters = profile.selectedCharacters.map(({ id, target }) =>
        id === characterID && target.name === targetName ? { id: id, target: resetTarget } : { id: id, target: target }
      );

      return profile.withCharacters(Object.assign({}, profile.characters, {
        [characterID]: newCharacter
      })).withSelectedCharacters(newSelectedCharacters);
    },
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
    profile => {
      const newCharacters = mapObject(profile.characters, character => character.withResetTargets());
      const newSelectedCharacters = profile.selectedCharacters.map(({ id, target: oldTarget }) => {
        const resetTarget = newCharacters[id].optimizerSettings.targets.find(target => target.name === oldTarget.name);

        return resetTarget ? { id: id, target: resetTarget } : { id: id, target: oldTarget };
      });

      return profile.withCharacters(newCharacters).withSelectedCharacters(newSelectedCharacters);
    },
    dispatch => dispatch(hideModal())
  );
}

/**
 * Delete the currently selected target for a given character
 * @param characterID {String} The character ID of the character being reset
 * @param targetName {String} The name of the target to delete
 * @returns {Function}
 */
export function deleteTarget(characterID, targetName) {
  return updateProfile(
    profile => {
      const oldCharacter = profile.characters[characterID];
      const newCharacters = Object.assign({}, profile.characters, {
        [characterID]: oldCharacter.withDeletedTarget(targetName)
      });

      const newSelectedCharacters = profile.selectedCharacters.map(({ id, target: oldTarget }) => {
        if (id === characterID && oldTarget.name === targetName) {
          const newTarget = newCharacters[characterID].targets()[0] || new OptimizationPlan('unnamed');

          return { id: id, target: newTarget };
        } else {
          return { id: id, target: oldTarget };
        }
      });

      return profile.withCharacters(newCharacters).withSelectedCharacters(newSelectedCharacters);
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

export function toggleHideSelectedCharacters() {
  return {
    type: TOGGLE_HIDE_SELECTED_CHARACTERS
  };
}

export function toggleCharacterEditSortView() {
  return {
    type: TOGGLE_CHARACTER_EDIT_SORT_VIEW
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
      Object.assign({}, profile.globalSettings, { modChangeThreshold: threshold })
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
      Object.assign({}, profile.globalSettings, { lockUnselectedCharacters: lock })
    )
  );
}

export function updateForceCompleteModSets(forceCompleteModSets) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, { forceCompleteSets: forceCompleteModSets })
    )
  );
}

export function updateOmicronBoostsGac(boostGacOmicrons) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, { omicronBoostsGac: boostGacOmicrons })
    )
  );
}

export function updateOmicronBoostsTw(boostTwOmicrons) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, { omicronBoostsTw: boostTwOmicrons })
    )
  );
}

export function updateOmicronBoostsTb(boostTbOmicrons) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, { omicronBoostsTb: boostTbOmicrons })
    )
  );
}

export function updateOmicronBoostsRaids(boostRaidOmicrons) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, { omicronBoostsRaids: boostRaidOmicrons })
    )
  );
}

export function updateOmicronBoostsConquest(boostConquestOmicrons) {
  return updateProfile(profile =>
    profile.withGlobalSettings(
      Object.assign({}, profile.globalSettings, { omicronBoostsConquest: boostConquestOmicrons })
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

/**
 * Fill the target stats to display on the character edit form
 *
 * @param targetStats {Array<TargetStat>}
 * @returns {{type: string, targetStats: Array<TargetStat>}}
 */
export function changeTargetStats(targetStats) {
  return {
    type: CHANGE_TARGET_STATS,
    targetStats: targetStats
  };
}

/**
 * Add a target stat to the character edit form
 *
 * @param targetStat {TargetStat}
 * @returns {{type: string, targetStat: TargetStat}}
 */
export function addTargetStat(targetStat) {
  return {
    type: ADD_TARGET_STAT,
    targetStat: targetStat
  };
}

/**
 * Remove a target stat from the character edit form
 *
 * @param index {Int}
 * @returns {{type: string, index: Int}}
 */
export function removeTargetStat(index) {
  return {
    type: REMOVE_TARGET_STAT,
    index: index
  };
}

export function saveTemplate(name) {
  const db = getDatabase();

  return function (dispatch, getState) {
    const state = getState();
    const selectedCharacters = state.profile.selectedCharacters;

    db.saveCharacterTemplate(name, selectedCharacters,
      () => {
        dispatch(loadCharacterTemplates());
        dispatch(hideModal());
      },
      error => dispatch(showFlash(
        'Storage Error',
        'Error saving the character template: ' + error.message + '. Please try again.'
      ))
    );
  };
}

export function saveTemplates(templates) {
  const db = getDatabase();

  return function (dispatch) {
    db.saveCharacterTemplates(
      templates,
      () => {
        dispatch(loadCharacterTemplates());
        dispatch(hideModal());
      },
      error => dispatch(showFlash(
        'Storage Error',
        'Error saving the character templates: ' + error.message + '.'
      ))
    );
  };
}

export function appendTemplate(name) {
  const db = getDatabase();

  function updateFunction(template) {
    return updateProfile(
      profile => {
        const templateTargetsById = mapObject(
          collectByKey(template.selectedCharacters, ({ id }) => id),
          entries => entries.map(({ target }) => target)
        );

        const availableCharacters = template.selectedCharacters.filter(({ id }) => Object.keys(profile.characters)
          .includes(id));

        const newProfile = profile.withCharacters(mapObject(profile.characters, character => {
          if (template.selectedCharacters.map(({ id }) => id).includes(character.baseID)) {
            return character.withOptimizerSettings(
              character.optimizerSettings.withTargetOverrides(templateTargetsById[character.baseID])
            );
          } else {
            return character;
          }
        }));

        return newProfile.withSelectedCharacters(profile.selectedCharacters.concat(availableCharacters));
      },
      (dispatch, getState, newProfile) => {
        const state = getState();
        const missingCharacters =
          template.selectedCharacters.filter(({ id }) => !Object.keys(newProfile.characters).includes(id))
            .map(({ id }) => state.gameSettings[id] ? state.gameSettings[id].name : id);
        if (missingCharacters.length) {
          dispatch(showFlash(
            'Missing Characters',
            'Missing the following characters from the selected template: ' + missingCharacters.join(', ')
          ));
        }
      }
    )
  }

  return function (dispatch, getState) {
    if (Object.keys(defaultTemplates).includes(name)) {
      const template = {
        name: defaultTemplates[name],
        selectedCharacters: defaultTemplates[name].selectedCharacters.map(
          ({ id, target }) => ({ id: id, target: OptimizationPlan.deserialize(target) })
        )
      };
      updateFunction(template)(dispatch, getState);
    } else {
      db.getCharacterTemplate(
        name,
        template => updateFunction(template)(dispatch, getState),
        error => dispatch(showFlash(
          'Storage Error',
          `Error retrieving your template from the database: ${error.message}.`
        ))
      );
    }
  }
}

export function replaceTemplate(name) {
  const db = getDatabase();

  function updateFunction(template) {
    return updateProfile(
      profile => {
        const templateTargetsById = mapObject(
          collectByKey(template.selectedCharacters, ({ id }) => id),
          entries => entries.map(({ target }) => target)
        );

        const availableCharacters = template.selectedCharacters.filter(({ id }) => Object.keys(profile.characters)
          .includes(id));

        const newProfile = profile.withCharacters(mapObject(profile.characters, character => {
          if (template.selectedCharacters.map(({ id }) => id).includes(character.baseID)) {
            return character.withOptimizerSettings(
              character.optimizerSettings.withTargetOverrides(templateTargetsById[character.baseID])
            );
          } else {
            return character;
          }
        }));

        return newProfile.withSelectedCharacters(availableCharacters);
      },
      (dispatch, getState, newProfile) => {
        const state = getState();
        const missingCharacters =
          template.selectedCharacters.filter(({ id }) => !Object.keys(newProfile.characters).includes(id))
            .map(({ id }) => state.gameSettings[id] ? state.gameSettings[id].name : id);
        if (missingCharacters.length) {
          dispatch(showFlash(
            'Missing Characters',
            'Missing the following characters from the selected template: ' + missingCharacters.join(', ')
          ));
        }
      }
    );
  }

  return function (dispatch, getState) {
    if (Object.keys(defaultTemplates).includes(name)) {
      const template = {
        name: defaultTemplates[name],
        selectedCharacters: defaultTemplates[name].selectedCharacters.map(
          ({ id, target }) => ({ id: id, target: OptimizationPlan.deserialize(target) })
        )
      };
      updateFunction(template)(dispatch, getState);
    } else {
      db.getCharacterTemplate(
        name,
        template => updateFunction(template)(dispatch, getState),
        error => dispatch(showFlash(
          'Storage Error',
          `Error retrieving your template from the database: ${error.message}.`
        ))
      );
    }
  }
}

export function setOptimizeIndex(index) {
  return updateProfile(profile => profile.withOptimizeIndex(index));
}

export function applyTemplateTargets(name) {
  const db = getDatabase();

  function updateFunction(template) {
    return updateProfile(
      profile => {
        const templateTargetsById = mapObject(
          collectByKey(template.selectedCharacters, ({ id }) => id),
          entries => entries.map(({ target }) => target)
        );

        const newProfile = profile.withCharacters(mapObject(profile.characters, character => {
          if (template.selectedCharacters.map(({ id }) => id).includes(character.baseID)) {
            return character.withOptimizerSettings(
              character.optimizerSettings.withTargetOverrides(templateTargetsById[character.baseID])
            );
          } else {
            return character;
          }
        }));

        const newSelectedCharacters = profile.selectedCharacters.slice(0);
        template.selectedCharacters.forEach(({ id: templateCharId, target: templateTarget }) => {
          for (let selectedCharacter of newSelectedCharacters) {
            if (selectedCharacter.id === templateCharId) {
              selectedCharacter.target = templateTarget;
            }
          }
        });

        return newProfile.withSelectedCharacters(newSelectedCharacters);
      },
      (dispatch, getState, newProfile) => {
        const state = getState();
        const missingCharacters = template.selectedCharacters.filter(({ id: templateCharId }) =>
          !newProfile.selectedCharacters.map(({ id }) => id).includes(templateCharId)
        ).map(({ id }) => state.gameSettings[id] ? state.gameSettings[id].name : id);

        if (missingCharacters.length) {
          dispatch(showFlash(
            'Missing Characters',
            'The following characters weren\'t in your selected characters: ' + missingCharacters.join(', ')
          ));
        }
      }
    )
  }

  return function (dispatch, getState) {
    if (Object.keys(defaultTemplates).includes(name)) {
      const template = {
        name: defaultTemplates[name],
        selectedCharacters: defaultTemplates[name].selectedCharacters.map(
          ({ id, target }) => ({ id: id, target: OptimizationPlan.deserialize(target) })
        )
      };
      updateFunction(template)(dispatch, getState);
    } else {
      db.getCharacterTemplate(
        name,
        template => updateFunction(template)(dispatch, getState),
        error => dispatch(showFlash(
          'Storage Error',
          `Error retrieving your template from the database: ${error.message}.`
        ))
      );
    }
  }

}

export function deleteTemplate(name) {
  const db = getDatabase();

  return function (dispatch) {
    db.deleteCharacterTemplate(
      name,
      () => {
        dispatch(loadCharacterTemplates());
        dispatch(hideModal());
      },
      error => dispatch(showFlash(
        'Storage Error',
        `Error deleting the character template '${name}'. Error message: ${error.message}`
      ))
    );
  }
}
