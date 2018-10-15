// @flow

export function changeModsFilter(state, action) {
  return Object.assign({}, state, {
    modsFilter: action.filter
  });
}
