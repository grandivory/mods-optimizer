// @flow

export function optimizeMods(state) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

export function cancelOptimizeMods(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    flashMessage: null,
    modal: null
  });
}
