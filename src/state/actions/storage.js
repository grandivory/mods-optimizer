export const LOAD_PROFILE = 'LOAD_PROFILE';
export const LOAD_FROM_DB = 'LOAD_FROM_DB';
export const POPULATE_DATABASE = 'POPULATE_DATABASE';
export const SAVE_DATABSE = 'SAVE_DATABSE';
export const SAVE_GAME_SETTINGS = 'SAVE_GAME_SETTINGS';
export const SAVE_PROFILES = 'SAVE_PROFILES';
export const SAVE_LAST_RUNS = 'SAVE_LAST_RUNS';
export const SET_DATABASE = 'SET_DATABASE';
export const SET_GAME_SETTINGS = 'SET_GAME_SETTINGS';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_PROFILES = 'SET_PROFILES';

export function databaseReady(db) {
  return function(dispatch) {
    dispatch(setDatabase(db));
    dispatch(populateDatabase());
    dispatch(loadFromDb());
    dispatch(loadProfile());
  };
}

export function loadProfile() {
  return {
    type: LOAD_PROFILE
  };
}

export function loadFromDb() {
  return {
    type: LOAD_FROM_DB
  };
}

export function populateDatabase() {
  return {
    type: POPULATE_DATABASE
  };
}

export function saveDatabase(callback) {
  return {
    type: SAVE_DATABSE,
    callback: callback
  };
}

export function saveGameSettings(gameSettings) {
  return {
    type: SAVE_GAME_SETTINGS,
    gameSettings: gameSettings
  };
}

export function saveProfiles(profiles) {
  return {
    type: SAVE_PROFILES,
    profiles: profiles
  };
}

export function saveLastRuns(lastRuns) {
  return {
    type: SAVE_LAST_RUNS,
    lastRuns: lastRuns
  };
}

export function setDatabase(db) {
  return {
    type: SET_DATABASE,
    db: db
  };
}

export function setGameSettings(gameSettings) {
  return {
    type: SET_GAME_SETTINGS,
    gameSettings: gameSettings
  };
}

export function setProfile(profile) {
  return {
    type: SET_PROFILE,
    profile: profile
  };
}

export function setProfiles(profiles) {
  return {
    type: SET_PROFILES,
    profiles: profiles
  };
}
