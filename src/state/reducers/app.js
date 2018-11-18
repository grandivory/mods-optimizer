// @flow

import {defaultState, deserializeState, deserializeStateVersionOneTwo} from "../storage";

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

export function showFlash(state, action) {
  return Object.assign({}, state, {
    flashMessage: {
      heading: action.heading,
      content: action.content
    },
    isBusy: false
  });
}

export function hideFlash(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    flashMessage: null
  });
}

export function reset(state, action) {
  return Object.assign({}, defaultState);
}

export function restoreProgress(state, action) {
  try {
    const stateObj = JSON.parse(action.progressData);
    return deserializeState(stateObj);
  } catch (e) {
    try {
      const stateObj = JSON.parse(action.progressData);
      const allyCode = stateObj.state.allyCode;
      const availableCharacters = JSON.parse(stateObj.state.availableCharacters);
      const selectedCharacters = JSON.parse(stateObj.state.selectedCharacters);
      const mods = JSON.parse(stateObj.state.mods);
      return deserializeStateVersionOneTwo(allyCode, availableCharacters, selectedCharacters, mods);
    } catch (e) {
      console.log(e);
      return Object.assign({}, state, {
        error:
          'Unable to restore your progress from the provided file. Please make sure that you uploaded the correct file.'
      });
    }
  }
}

