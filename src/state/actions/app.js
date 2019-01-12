// @flow
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
export const SWITCH_PROFILE = 'SWITCH_PROFILE';
export const DELETE_PROFILE = 'DELETE_PROFILE';

export function changeSection(newSection) {
  return {
    type: CHANGE_SECTION,
    section: newSection
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
  return {
    type: RESTORE_PROGRESS,
    progressData: progressData
  };
}

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  };
}

export function switchProfile(allyCode) {
  return {
    type: SWITCH_PROFILE,
    allyCode: allyCode
  };
}

export function deleteProfile(allyCode) {
  return {
    type: DELETE_PROFILE,
    allyCode: allyCode
  };
}
