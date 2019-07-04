// @flow
import {restoreState, saveState} from "../storage";
import {
  CHANGE_SECTION,
  HIDE_ERROR,
  HIDE_FLASH,
  HIDE_MODAL,
  RESET_STATE,
  SET_IS_BUSY,
  SET_STATE,
  SHOW_ERROR,
  SHOW_FLASH,
  SHOW_MODAL,
  TOGGLE_SIDEBAR
} from "../actions/app";
import {
  CHANGE_CHARACTER_EDIT_MODE,
  CHANGE_CHARACTER_FILTER,
  CHANGE_SET_RESTRICTIONS,
  REMOVE_SET_BONUS,
  SELECT_SET_BONUS,
  TOGGLE_HIDE_SELECTED_CHARACTERS,
} from "../actions/characterEdit";
import {REQUEST_CHARACTERS, REQUEST_PROFILE, REQUEST_STATS, TOGGLE_KEEP_OLD_MODS} from "../actions/data";
import {CHANGE_MODS_FILTER} from "../actions/explore";
import {CANCEL_OPTIMIZE_MODS, OPTIMIZE_MODS} from "../actions/optimize";
import {CHANGE_MOD_SET_FILTER, CHANGE_MODLIST_FILTER, CHANGE_OPTIMIZER_VIEW,} from "../actions/review";
import {
  changeSection,
  hideError,
  hideFlash,
  hideModal,
  resetState,
  setIsBusy,
  setState,
  showError,
  showFlash,
  showModal,
  toggleSidebar
} from "./app";
import {
  changeCharacterEditMode,
  changeCharacterFilter,
  changeSetRestrictions,
  removeSetBonus,
  selectSetBonus,
  toggleHideSelectedCharacters,
} from "./characterEdit";
import {requestCharacters, requestProfile, requestStats, toggleKeepOldMods} from "./data";
import {changeModsFilter} from "./explore";
import {cancelOptimizeMods, optimizeMods} from "./optimize";
import {changeModListFilter, changeModSetFilter, changeOptimizerView,} from "./review";
import {
  ADD_PLAYER_PROFILE,
  CLEAN_STATE,
  SET_CHARACTER_TEMPLATES,
  SET_GAME_SETTINGS,
  SET_PLAYER_PROFILES,
  SET_PROFILE
} from "../actions/storage";
import {
  addPlayerProfile,
  cleanState,
  setCharacterTemplates,
  setGameSettings,
  setPlayerProfiles,
  setProfile
} from "./storage";

export default function modsOptimizer(state, action) {
  if (!state) {
    return saveState(restoreState());
  }

  switch (action.type) {
    case CLEAN_STATE:
      return saveState(cleanState(state));
    case SET_GAME_SETTINGS:
      return setGameSettings(state, action);
    case SET_PROFILE:
      return saveState(setProfile(state, action));
    case SET_CHARACTER_TEMPLATES:
      return saveState(setCharacterTemplates(state, action));
    case ADD_PLAYER_PROFILE:
      return addPlayerProfile(state, action);
    case SET_PLAYER_PROFILES:
      return setPlayerProfiles(state, action);


    case CHANGE_SECTION:
      return saveState(changeSection(state, action));
    case SHOW_MODAL:
      return showModal(state, action);
    case HIDE_MODAL:
      return hideModal(state);
    case SHOW_ERROR:
      return showError(state, action);
    case HIDE_ERROR:
      return hideError(state);
    case SHOW_FLASH:
      return showFlash(state, action);
    case HIDE_FLASH:
      return hideFlash(state);
    case RESET_STATE:
      saveState(resetState(action));
      return window.location.reload();
    case TOGGLE_SIDEBAR:
      return saveState(toggleSidebar(state, action));
    case SET_STATE:
      return saveState(setState(state, action));
    case SET_IS_BUSY:
      return setIsBusy(state, action);

    case CHANGE_CHARACTER_EDIT_MODE:
      return saveState(changeCharacterEditMode(state, action));
    case CHANGE_CHARACTER_FILTER:
      return saveState(changeCharacterFilter(state, action));
    case TOGGLE_HIDE_SELECTED_CHARACTERS:
      return saveState(toggleHideSelectedCharacters(state, action));
    case CHANGE_SET_RESTRICTIONS:
      return changeSetRestrictions(state, action);
    case SELECT_SET_BONUS:
      return selectSetBonus(state, action);
    case REMOVE_SET_BONUS:
      return removeSetBonus(state, action);

    case REQUEST_CHARACTERS:
      return requestCharacters(state);
    case REQUEST_PROFILE:
      return requestProfile(state);
    case REQUEST_STATS:
      return requestStats(state);
    case TOGGLE_KEEP_OLD_MODS:
      return saveState(toggleKeepOldMods(state));

    case CHANGE_MODS_FILTER:
      return saveState(changeModsFilter(state, action));

    case OPTIMIZE_MODS:
      return optimizeMods(state);
    case CANCEL_OPTIMIZE_MODS:
      return saveState(cancelOptimizeMods(state, action));

    case CHANGE_OPTIMIZER_VIEW:
      return saveState(changeOptimizerView(state, action));
    case CHANGE_MOD_SET_FILTER:
      return saveState(changeModSetFilter(state, action));
    case CHANGE_MODLIST_FILTER:
      return saveState(changeModListFilter(state, action));

    default:
      return state;
  }
}
