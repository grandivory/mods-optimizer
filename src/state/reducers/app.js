// @flow

import {defaultState} from "../storage";

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
    setRestrictions: null,
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
  state.db.clear();
  return Object.assign({}, defaultState, {
    db: state.db
  });
}

export function restoreProgress(state, action) {
  try {
  } catch (e) {
    return Object.assign({}, state, {
      error:
        'Unable to restore your progress from the provided file. Please make sure that you uploaded the correct file.'
    });
  }
}

export function toggleSidebar(state, action) {
  return Object.assign({}, state, {
    showSidebar: !state.showSidebar
  });
}

export function switchProfile(state, action) {
  state.db.getProfile(action.allyCode);
  return state;
}

export function deleteProfile(state, action) {
  const nextProfile = Object.keys(state.playerProfiles).find(key => key !== action.allyCode);

  state.db.deleteProfile(action.allyCode, () => state.db.getProfile(nextProfile));

  return state;
}

export function setState(state, action) {
  return Object.assign({}, action.state, {db: state.db});
}
