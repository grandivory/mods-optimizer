// @flow
import {restoreState, saveState} from "../storage";
import {CHANGE_SECTION, HIDE_ERROR, HIDE_MODAL, RESET, RESTORE_PROGRESS, SHOW_ERROR, SHOW_MODAL} from "../actions/app";
import {
  CHANGE_CHARACTER_FILTER,
  CHANGE_CHARACTER_TARGET,
  CHANGE_USE_FIVE_DOT_MODS,
  DELETE_TARGET,
  FINISH_EDIT_CHARACTER_TARGET,
  LOCK_CHARACTER,
  RESET_ALL_CHARACTER_TARGETS,
  RESET_CHARACTER_TARGET_TO_DEFAULT,
  SELECT_CHARACTER,
  UNLOCK_CHARACTER,
  UNSELECT_CHARACTER
} from "../actions/characterEdit";
import {
  RECEIVE_CHARACTERS,
  RECEIVE_PROFILE,
  RECEIVE_STATS,
  REQUEST_CHARACTERS,
  REQUEST_PROFILE,
  REQUEST_STATS,
  SET_MODS,
  TOGGLE_KEEP_OLD_MODS
} from "../actions/data";
import {CHANGE_MODS_FILTER} from "../actions/explore";
import {FINISH_OPTIMIZE_MODS, OPTIMIZE_MODS} from "../actions/optimize";
import {
  CHANGE_MOD_SET_FILTER,
  CHANGE_MODLIST_FILTER,
  CHANGE_OPTIMIZER_VIEW,
  REASSIGN_MOD,
  REASSIGN_MODS,
  UNEQUIP_MOD,
  UNEQUIP_MODS
} from "../actions/review";
import {changeSection, hideError, hideModal, reset, restoreProgress, showError, showModal} from "./app";
import {
  changeCharacterFilter,
  changeCharacterTarget,
  changeUse5DotMods,
  deleteTarget,
  finishEditCharacterTarget,
  lockCharacter,
  resetAllCharacterTargets,
  resetCharacterTargetToDefault,
  selectCharacter,
  unlockCharacter,
  unselectCharacter
} from "./characterEdit";
import {
  receiveCharacters,
  receiveProfile,
  receiveStats,
  requestCharacters,
  requestProfile,
  requestStats,
  setMods,
  toggleKeepOldMods
} from "./data";
import {changeModsFilter} from "./explore";
import {finishOptimizeMods, optimizeMods} from "./optimize";
import {
  changeModListFilter,
  changeModSetFilter,
  changeOptimizerView,
  reassignMod,
  reassignMods,
  unequipMod,
  unequipMods
} from "./review";

/**
 * Update the currently-selected character profile by calling an update function on the existing profile. Optionally
 * update the base state with other auxiliary changes as well.
 * @param state {object}
 * @param updateFunc {function(PlayerProfile): PlayerProfile}
 * @param auxiliaryChanges {object} An object used to add additional changes to the state at a level above the profile
 * @returns {*}
 */
export function updateCurrentProfile(state, updateFunc, auxiliaryChanges = {}) {
  const profile = state.profiles[state.allyCode];

  return Object.assign({}, state, auxiliaryChanges, {
    profiles: Object.assign({}, state.profiles, {
      [state.allyCode]: updateFunc(profile)
    })
  });
}

export default function modsOptimizer(state, action) {
  if (null == state) {
    return saveState(restoreState());
  }

  switch (action.type) {
    case CHANGE_SECTION:
      return saveState(changeSection(state, action));
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
    case RESTORE_PROGRESS:
      return saveState(restoreProgress(state, action));

    case SELECT_CHARACTER:
      return saveState(selectCharacter(state, action));
    case UNSELECT_CHARACTER:
      return saveState(unselectCharacter(state, action));
    case LOCK_CHARACTER:
      return saveState(lockCharacter(state, action));
    case UNLOCK_CHARACTER:
      return saveState(unlockCharacter(state, action));
    case CHANGE_CHARACTER_TARGET:
      return saveState(changeCharacterTarget(state, action));
    case FINISH_EDIT_CHARACTER_TARGET:
      return saveState(finishEditCharacterTarget(state, action));
    case RESET_CHARACTER_TARGET_TO_DEFAULT:
      return saveState(resetCharacterTargetToDefault(state, action));
    case RESET_ALL_CHARACTER_TARGETS:
      return saveState(resetAllCharacterTargets(state, action));
    case DELETE_TARGET:
      return saveState(deleteTarget(state, action));
    case CHANGE_USE_FIVE_DOT_MODS:
      return saveState(changeUse5DotMods(state, action));
    case CHANGE_CHARACTER_FILTER:
      return saveState(changeCharacterFilter(state, action));

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
    case TOGGLE_KEEP_OLD_MODS:
      return saveState(toggleKeepOldMods(state, action));
    case SET_MODS:
      return saveState(setMods(state, action));

    case CHANGE_MODS_FILTER:
      return saveState(changeModsFilter(state, action));

    case OPTIMIZE_MODS:
      return optimizeMods(state, action);
    case FINISH_OPTIMIZE_MODS:
      return saveState(finishOptimizeMods(state, action));

    case CHANGE_OPTIMIZER_VIEW:
      return saveState(changeOptimizerView(state, action));
    case CHANGE_MOD_SET_FILTER:
      return saveState(changeModSetFilter(state, action));
    case CHANGE_MODLIST_FILTER:
      return saveState(changeModListFilter(state, action));
    case UNEQUIP_MOD:
      return saveState(unequipMod(state, action));
    case REASSIGN_MOD:
      return saveState(reassignMod(state, action));
    case UNEQUIP_MODS:
      return saveState(unequipMods(state, action));
    case REASSIGN_MODS:
      return saveState(reassignMods(state, action));

    default:
      return state;
  }
}
