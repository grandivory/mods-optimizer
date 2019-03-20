import OptimizerRun from "../../domain/OptimizerRun";
import {mapObject} from "../../utils/mapObject";

/**
 * This reducer exists solely to pull the current allyCode out of the state and call into the database with it,
 * if needed. The database class will call setProfile when it is finished reading the profile from the database.
 * @returns {*}
 */
export function loadProfile(state, action) {
  if (state.db) {
    if (state.allyCode) {
      state.db.getProfile(state.allyCode);
    } else if (Object.keys(state.playerProfiles).length) {
      state.db.getProfile(Object.keys(state.playerProfiles)[0]);
    }
  }
  return state;
}

export function loadFromDb(state, action) {
  const db = state.db;
  db.getGameSettings();
  db.getProfiles();
  return state;
}

/**
 * If the "profiles" key exists in the state, then populate the database with anything in it, then remove
 * that key from the state. If the "characters" key exists in the state, populate gameSettings for each character that
 * has one, and remove the "characters" key.
 * @param state
 * @param action
 */
export function populateDatabase(state, action) {
  const db = state.db;
  const newState = Object.assign({}, state);

  if (state.profiles) {
    const profiles = Object.values(state.profiles).map(profile => {
      const characters = mapObject(profile.characters, character => {
        const storedCharacter = Object.assign({}, character);
        delete storedCharacter.gameSettings;
        delete storedCharacter.defaultSettings;

        return storedCharacter;
      });
      return profile.resetPreviousSettings().withCharacters(characters)
    });
    const lastRuns = Object.values(state.profiles)
      .filter(profile => Object.values(profile.previousSettings).length > 0)
      .map(profile => new OptimizerRun(
        profile.allyCode,
        profile.previousSettings.characters,
        profile.previousSettings.mods,
        profile.previousSettings.selectedCharacters,
        profile.previousSettings.modChangeThreshold
      ));
    db.saveProfiles(profiles);
    db.saveLastRuns(lastRuns);
    delete newState.profiles;
  }

  if (state.characters) {
    const gameSettings = Object.values(state.characters)
      .map(character => character.gameSettings)
      .filter(x => null !== x);

    db.saveGameSettings(Object.values(gameSettings));
    delete newState.characters;
  }

  return newState;
}

export function saveDatabase(state, action) {
  const db = state.db;

  db.export(action.callback);

  return state;
}

export function saveGameSettings(state, action) {
  const db = state.db;
  db.saveGameSettings(action.gameSettings);
  return state;
}

export function saveProfiles(state, action) {
  const db = state.db;
  db.saveProfiles(action.profiles);
  return state;
}

export function saveLastRuns(state, action) {
  const db = state.db;
  db.saveLastRuns(action.lastRuns);
  return state;
}

export function setDatabase(state, action) {
  return Object.assign({}, state, {db: action.db});
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

export function setProfiles(state, action) {
  return Object.assign({}, state, {playerProfiles: action.profiles});
}
