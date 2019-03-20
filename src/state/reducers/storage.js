export function cleanState(state) {
  const newState = Object.assign({}, state);

  delete newState.profiles;
  delete newState.characters;

  return newState;
}

export function setGameSettings(state, action) {
  return Object.assign({}, state, {gameSettings: action.gameSettings});
}

export function setProfile(state, action) {
  return Object.assign({}, state, {
    allyCode: action.profile ? action.profile.allyCode : '',
    isBusy: false,
    profile: action.profile
  });
}

export function setPlayerProfiles(state, action) {
  return Object.assign({}, state, {playerProfiles: action.profiles});
}
