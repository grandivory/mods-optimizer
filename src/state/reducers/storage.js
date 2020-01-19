export function cleanState(state) {
  const newState = Object.assign({}, state);

  delete newState.profiles;
  delete newState.characters;

  return newState;
}

export function setGameSettings(state, action) {
  return Object.assign({}, state, { gameSettings: action.gameSettings });
}

export function setProfile(state, action) {
  return Object.assign({}, state, {
    allyCode: action.profile ? action.profile.allyCode : '',
    profile: action.profile
  });
}

export function addPlayerProfile(state, action) {
  return Object.assign({}, state, {
    playerProfiles: Object.assign({}, state.playerProfiles, {
      [action.profile.allyCode]: action.profile.playerName
    })
  });
}

export function setPlayerProfiles(state, action) {
  return Object.assign({}, state, { playerProfiles: action.profiles });
}

export function setCharacterTemplates(state, action) {
  return Object.assign({}, state, { characterTemplates: action.templates });
}

export function setHotUtilsSubscription(state, action) {
  return Object.assign({}, state, { hotUtilsSubscription: action.subscription });
}
