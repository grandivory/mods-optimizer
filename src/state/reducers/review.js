// @flow

export function changeOptimizerView(state, action) {
  return Object.assign({}, state, {
    optimizerView: action.view
  });
}

export function changeModSetFilter(state, action) {
  return Object.assign({}, state, {
    modSetsFilter: action.filter
  });
}

export function changeModListFilter(state, action) {
  return Object.assign({}, state, {
    modListFilter: action.filter
  });
}
