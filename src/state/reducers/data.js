// @flow

export function toggleKeepOldMods(state) {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}
