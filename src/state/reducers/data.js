// @flow

export function toggleKeepOldMods(state) {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}

export function requestCharacters(state) {
  // Set the app to busy so that it can fetch the new character data
  return Object.assign({}, state, {isBusy: true});
}

export function requestProfile(state) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

export function requestStats(state) {
  return Object.assign({}, state, {
    isBusy: true
  });
}
