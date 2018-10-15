// @flow
export const CHANGE_SECTION = 'CHANGE_SECTION';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SHOW_ERROR = 'SHOW_ERROR';
export const HIDE_ERROR = 'HIDE_ERROR';
export const RESET = 'RESET';
export const RESTORE_PROGRESS = 'RESTORE_PROGRESS';

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
