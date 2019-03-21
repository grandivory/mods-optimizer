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

export function hideModal(state) {
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

export function hideError(state) {
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

export function hideFlash(state) {
  return Object.assign({}, state, {
    isBusy: false,
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
  return Object.assign({}, action.state, {db: state.db});
}

export function setIsBusy(state, action) {
  return Object.assign({}, state, {
    isBusy: action.isBusy
  });
}
