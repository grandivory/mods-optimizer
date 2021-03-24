// @flow
import { saveTemplates } from "./characterEdit"
import {
  cleanState,
  loadFromDb,
  loadProfile,
  loadProfiles,
  populateDatabase,
  saveGameSettings,
  saveLastRuns,
  saveProfiles,
  replaceModsForProfiles,
  setProfile
} from "./storage";
import { deserializeState } from "../storage";
import getDatabase from "../storage/Database";
import nothing from "../../utils/nothing";
import groupByKey from "../../utils/groupByKey";

export const CHANGE_SECTION = 'CHANGE_SECTION';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const SHOW_FLASH = 'SHOW_FLASH';
export const HIDE_FLASH = 'HIDE_FLASH';
export const RESET_STATE = 'RESET_STATE';
export const RESTORE_PROGRESS = 'RESTORE_PROGRESS';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const DELETE_PROFILE = 'DELETE_PROFILE';
export const SET_STATE = 'SET_STATE';
export const SET_IS_BUSY = 'SET_IS_BUSY';

export function changeSection(newSection) {
  return {
    type: CHANGE_SECTION,
    section: newSection
  };
}

export function showModal(modalClass, modalContent, cancelable = true) {
  return {
    type: SHOW_MODAL,
    class: modalClass,
    content: modalContent,
    cancelable: cancelable
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

export function showFlash(heading, flashContent) {
  return {
    type: SHOW_FLASH,
    heading: heading,
    content: flashContent
  };
}

export function hideFlash() {
  return {
    type: HIDE_FLASH
  };
}

export function reset() {
  return function (dispatch) {
    const db = getDatabase();
    db.delete(
      () => dispatch(resetState()),
      error => dispatch(showError(
        'Error deleting the database: ' + error.message + '. Try clearing it manually and refreshing.'
      ))
    );
  };
}

export function resetState() {
  return {
    type: RESET_STATE
  };
}

export function restoreProgress(progressData) {
  return function (dispatch) {
    try {
      const stateObj = JSON.parse(progressData);
      // If the progress data has only a profiles section, then it's an export from HotUtils.
      // Add the mods to any existing profile
      if (!stateObj.version && stateObj.profiles && !stateObj.gameSettings) {
        dispatch(replaceModsForProfiles(stateObj.profiles));
      } else if (stateObj.version > '1.4' && stateObj.version !== 'develop') {
        // Get all of the current profiles from the database - if any have HotUtils session IDs, we'll keep those,
        // overwriting anything stored in the file
        const db = getDatabase();
        db.getProfiles(
          profiles => {
            const profileByAllyCode = groupByKey(profiles, profile => profile.allyCode);

            const updatedProfiles = stateObj.profiles.map(profile => {
              const oldProfile = profileByAllyCode[profile.allyCode];

              return {
                ...profile,
                hotUtilsSessionId: oldProfile ? oldProfile.hotUtilsSessionId : null
              }
            });

            dispatch(saveProfiles(updatedProfiles, stateObj.allyCode));
          },
          error =>
            // On error, just save the profiles directly from the file
            dispatch(saveProfiles(stateObj.profiles, stateObj.allyCode))
        );



        dispatch(saveGameSettings(stateObj.gameSettings));
        dispatch(saveLastRuns(stateObj.lastRuns));
        if (stateObj.characterTemplates) {
          dispatch(saveTemplates(stateObj.characterTemplates))
        }
        dispatch(loadProfile(stateObj.allyCode));
      } else {
        const newState = deserializeState(stateObj);
        // Update the state to match the old file
        dispatch(setState(newState));
        // Populate the database from the state by using the populateDatabase action
        dispatch(populateDatabase(newState));
        // Reload the state from the database
        dispatch(loadFromDb(stateObj.allyCode));
        // Clean up any excess entries in the state
        dispatch(cleanState());
      }
    } catch (e) {
      throw new Error(
        'Unable to process progress file. Is this a template file? If so, use the "load" button below. Error message: ' +
        e.message
      );
    }
  }
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  };
}

export function deleteProfile(allyCode) {
  return function (dispatch) {
    const db = getDatabase();
    db.deleteProfile(
      allyCode,
      () => dispatch(loadProfiles(null)),
      error => dispatch(showFlash(
        'Storage Error',
        'Error deleting your profile: ' + error.message
      ))
    );
  };
}

export function setState(state) {
  return {
    type: SET_STATE,
    state: state
  };
}

export function setIsBusy(isBusy) {
  return {
    type: SET_IS_BUSY,
    isBusy: isBusy
  };
}

/**
 * Update the currently-selected character profile by calling an update function on the existing profile. Optionally
 * update the base state with other auxiliary changes as well.
 * @param updateFunc {function(PlayerProfile): PlayerProfile}
 * @param auxiliaryChanges {function(dispatch, getState, newProfile)} Any additional changes that need to be made in
 * addition to the profile
 * @returns {Function}
 */
export function updateProfile(updateFunc, auxiliaryChanges = nothing) {
  return function (dispatch, getState) {
    const state = getState();
    const db = getDatabase();
    const newProfile = updateFunc(state.profile);

    db.saveProfile(
      newProfile,
      nothing,
      error => dispatch(showFlash(
        'Storage Error',
        'Error saving your progress: ' + error.message + ' Your progress may be lost on page refresh.'
      ))
    );
    dispatch(setProfile(newProfile));
    auxiliaryChanges(dispatch, getState, newProfile);
  };
}
