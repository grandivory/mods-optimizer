// @flow
import {loadFromDb, loadProfile, populateDatabase, saveGameSettings, saveLastRuns, saveProfiles} from "./storage";
import {deserializeState} from "../storage";

export const CHANGE_SECTION = 'CHANGE_SECTION';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const SHOW_FLASH = 'SHOW_FLASH';
export const HIDE_FLASH = 'HIDE_FLASH';
export const RESET = 'RESET';
export const RESTORE_PROGRESS = 'RESTORE_PROGRESS';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const DELETE_PROFILE = 'DELETE_PROFILE';
export const SET_STATE = 'SET_STATE';

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
  return {
    type: RESET
  };
}

export function restoreProgress(progressData) {
  return function(dispatch) {
    const stateObj = JSON.parse(progressData);
    if (stateObj.version > '1.4') {
      dispatch(saveGameSettings(stateObj.gameSettings));
      dispatch(saveProfiles(stateObj.profiles, stateObj.allyCode));
      dispatch(saveLastRuns(stateObj.lastRuns));
      dispatch(loadProfile(stateObj.allyCode));
    } else {
      const newState = deserializeState(stateObj);
      // Update the state to match the old file
      dispatch(setState(newState));
      // Populate the database from the state by using the populateDatabase action
      dispatch(populateDatabase(newState));
      // Reload the state from the database
      dispatch(loadFromDb(stateObj.allyCode));
    }
  }
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  };
}

export function deleteProfile(allyCode) {
  return {
    type: DELETE_PROFILE,
    allyCode: allyCode
  };
}

export function setState(state) {
  return {
    type: SET_STATE,
    state: state
  };
}
