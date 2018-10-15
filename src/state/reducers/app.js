// @flow

import {defaultState, deserializeState} from "../storage";

export function changeSection(state, action) {
  return Object.assign({}, state, {
    section: action.section
  });
}

export function showModal(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    modal: {
      class: action.class,
      content: action.content
    }
  });
}

export function hideModal(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    modal: null
  });
}

export function showError(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    error: action.content
  });
}

export function hideError(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    error: null
  });
}

export function reset(state, action) {
  return Object.assign({}, defaultState);
}

export function restoreProgress(state, action) {
  try {
    return deserializeState(action.progressData);
  } catch (e) {
    return Object.assign({}, state, {
      error:
        'Unable to restore your progress from the provided file. Please make sure that you uploaded the correct file.'
    });
  }
}
