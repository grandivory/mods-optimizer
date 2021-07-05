// @flow

export function optimizeMods(state) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

export function updateProgress(state, action) {
  return Object.assign({}, state, {
    progress: action.progress
  });
}

export function cancelOptimizeMods(state) {
  return Object.assign({}, state, {
    isBusy: false,
    flashMessage: null,
    modal: null
  });
}
