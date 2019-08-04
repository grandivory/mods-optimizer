// @flow

import {defaultState} from "../storage";

export function changeSection(state, action) {
  return Object.assign({}, state, {
    section: action.section
  });
}

export function showModal(state, action) {
  return Object.assign({}, state, {
    modal: {
      class: action.class,
      content: action.content,
      cancelable: action.cancelable
    }
  });
}

export function hideModal(state) {
  return Object.assign({}, state, {
    setRestrictions: null,
    modal: null
  });
}

export function showError(state, action) {
  return Object.assign({}, state, {
    error: action.content
  });
}

export function hideError(state) {
  return Object.assign({}, state, {
    error: null
  });
}

export function showFlash(state, action) {
  return Object.assign({}, state, {
    flashMessage: {
      heading: action.heading,
      content: action.content
    }
  });
}

export function hideFlash(state) {
  return Object.assign({}, state, {
    flashMessage: null
  });
}

export function resetState() {
  return Object.assign({}, defaultState);
}

export function toggleSidebar(state, action) {
  return Object.assign({}, state, {
    showSidebar: !state.showSidebar
  });
}

export function setState(state, action) {
  return Object.assign({}, action.state);
}

export function setIsBusy(state, action) {
  return Object.assign({}, state, {
    isBusy: action.isBusy
  });
}
