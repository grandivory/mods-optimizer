import React from 'react';
import getDatabase from "../storage/Database";
import { mapObject } from "../../utils/mapObject";
import OptimizerRun from "../../domain/OptimizerRun";
import nothing from "../../utils/nothing";
import { showError, showFlash, updateProfile } from "./app";
import groupByKey from "../../utils/groupByKey";
import Mod from '../../domain/Mod';
import { fetchHotUtilsStatus } from './data';

export const CLEAN_STATE = 'CLEAN_STATE';
export const SET_GAME_SETTINGS = 'SET_GAME_SETTINGS';
export const SET_PROFILE = 'SET_PROFILE';
export const ADD_PLAYER_PROFILE = 'ADD_PLAYER_PROFILE';
export const SET_PLAYER_PROFILES = 'SET_PLAYER_PROFILES';
export const SET_CHARACTER_TEMPLATES = 'SET_CHARACTER_TEMPLATES';
export const SET_HOTUTILS_SUBSCRIPTION = 'SET_HOTUTILS_SUBSCRIPTION';

/**
 * Handle setting up everything once the database is ready to use.
 * @param state {Object} The current state of the application, used to populate the database
 * @returns {Function}
 */
export function databaseReady(state) {
  return function (dispatch) {
    // Save the state into the database
    dispatch(populateDatabase(state));

    // Load the data from the database and store it in the state
    dispatch(loadFromDb(state.allyCode));

    // Clean up any excess data in the state from previous versions
    dispatch(cleanState());
  };
}

/**
 * If the "profiles" key exists in the state, then populate the database with anything in it.
 * If the "characters" key exists in the state, populate gameSettings for each character that has one.
 * @param state {Object}
 */
export function populateDatabase(state) {
  return function (dispatch) {
    const db = getDatabase();

    // First, check to see if there's anything in the state that we need to load into the database
    if (state.profiles) {
      const profiles = Object.values(state.profiles).map(profile => {
        const characters = mapObject(profile.characters, character => {
          const storedCharacter = Object.assign({}, character.serialize());
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
      db.saveProfiles(profiles, nothing, error =>
        dispatch(showFlash(
          'Storage Error',
          'Error saving your profile: ' + error.message
        ))
      );
      db.saveLastRuns(lastRuns, nothing, error =>
        dispatch(showFlash(
          'Storage Error',
          'Error saving previous runs: ' +
          error.message +
          ' The optimizer will need to recalculate optimized values on the next run.'
        ))
      );
    }

    if (state.characters) {
      const gameSettings = Object.values(state.characters)
        .map(character => character.gameSettings)
        .filter(x => null !== x);

      db.saveGameSettings(gameSettings, nothing, error =>
        dispatch(showFlash(
          'Storage Error',
          'Error saving base character settings: ' +
          error.message +
          ' The optimizer may not function properly for all characters'
        ))
      );
    }
  };
}

/**
 * Read Game settings and player profiles from the database and load them into the app state
 * @param allyCode
 * @returns {Function}
 */
export function loadFromDb(allyCode) {
  return function (dispatch) {
    dispatch(loadGameSettings());
    dispatch(loadProfiles(allyCode));
    dispatch(loadCharacterTemplates());
  };
}

/**
 * Load game settings from the database and store them in the state
 * @returns {Function}
 */
function loadGameSettings() {
  return function (dispatch) {
    const db = getDatabase();

    try {
      db.getGameSettings(
        gameSettings => {
          const gameSettingsObject = groupByKey(gameSettings, gameSettings => gameSettings.baseID);
          dispatch(setGameSettings(gameSettingsObject));
        },
        error =>
          dispatch(showFlash(
            'Storage Error',
            'Error reading basic character settings: ' +
            error.message +
            ' The settings will be restored when you next fetch data.'
          ))
      );
    } catch (e) {
      dispatch(showError(
        [
          <p key={1}>
            Unable to load database: {e.message} Please fix the problem and try again, or ask for help in the
            discord server below.
          </p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>
        ]
      ));
    }
  }
}

/**
 * Load profiles from the database and store them in the state. Only keep the full profile for the current active
 * ally code. All others only keep the ally code and name
 * @param allyCode
 * @returns {Function}
 */
export function loadProfiles(allyCode) {
  return function (dispatch) {
    const db = getDatabase();

    try {
      db.getProfiles(
        profiles => {
          // Clean up profiles to make sure that every selected character actually exists in the profile
          const cleanedProfiles = profiles.map(profile => {
            const cleanedSelectedCharacters =
              profile.selectedCharacters.filter(({ id }) => Object.keys(profile.characters).includes(id));
            return profile.withSelectedCharacters(cleanedSelectedCharacters);
          });

          // Set the active profile
          const profile = allyCode ?
            cleanedProfiles.find(profile => profile.allyCode === allyCode) :
            cleanedProfiles.find((profile, index) => index === 0);
          dispatch(setProfile(profile));
          if (profile) {
            dispatch(fetchHotUtilsStatus(profile.allyCode));
          }

          // Set up the playerProfiles object used to switch between available profiles
          const playerProfiles = {};
          cleanedProfiles.forEach(profile => playerProfiles[profile.allyCode] = profile.playerName);
          dispatch(setPlayerProfiles(playerProfiles));
        },
        error =>
          dispatch(showFlash(
            'Storage Error',
            'Error retrieving profiles: ' + error.message
          ))
      );
    } catch (e) {
      dispatch(showError(
        [
          <p key={1}>
            Unable to load database: {e.message} Please fix the problem and try again, or ask for help in the
            discord server below.
          </p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>
        ]
      ));
    }
  };
}

export function loadCharacterTemplates() {
  return function (dispatch) {
    const db = getDatabase();

    try {
      db.getCharacterTemplates(
        characterTemplates => {
          const templatesObject = mapObject(
            groupByKey(characterTemplates, template => template.name),
            ({ selectedCharacters }) => selectedCharacters
          );
          dispatch(setCharacterTemplates(templatesObject));
        },
        error => dispatch(showFlash(
          'Storage Error',
          'Error loading character templates: ' + error.message + '.'
        ))
      );
    } catch (e) {
      dispatch(showError(
        [
          <p key={1}>
            Unable to load database: {e.message} Please fix the problem and try again, or ask for help in the
            discord server below.
          </p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>
        ]
      ));
    }
  }
}

/**
 * Remove any of the old keys from the state that are no longer needed with the database
 * @returns {{type: string}}
 */
export function cleanState() {
  return {
    type: CLEAN_STATE
  };
}

/**
 * Load a single player profile from the database and set it in the state
 * @param allyCode {string}
 * @returns {*}
 */
export function loadProfile(allyCode) {
  if (!allyCode) {
    return nothing;
  }

  return function (dispatch) {
    const db = getDatabase();
    db.getProfile(
      allyCode,
      profile => {
        const cleanedSelectedCharacters =
          profile.selectedCharacters.filter(({ id }) => Object.keys(profile.characters).includes(id));
        const cleanedProfile = profile.withSelectedCharacters(cleanedSelectedCharacters);

        dispatch(setProfile(cleanedProfile));
        dispatch(fetchHotUtilsStatus(allyCode));
      },
      error => dispatch(showError('Error loading your profile from the database: ' + error.message))
    );
  };
}

/**
 * Export all of the data in the database
 * @param callback {function(Object)}
 * @returns {Function}
 */
export function exportDatabase(callback) {
  return function (dispatch) {
    const db = getDatabase();
    db.export(
      callback,
      error => dispatch(showError('Error fetching data from the database: ' + error.message))
    );
  };
}

export function exportCharacterTemplate(name, callback) {
  return function (dispatch) {
    const db = getDatabase();
    db.getCharacterTemplate(name,
      callback,
      error => dispatch(showError('Error fetching data from the database: ' + error.message))
    );
  }
}

export function exportCharacterTemplates(callback) {
  return function (dispatch) {
    const db = getDatabase();
    db.getCharacterTemplates(
      callback,
      error => dispatch(showError('Error fetching data from the database: ' + error.message))
    );
  }
}

/**
 * Add new GameSettings objects to the database, or update existing ones
 * @param gameSettings {Array<GameSettings>}
 */
export function saveGameSettings(gameSettings) {
  return function (dispatch) {
    const db = getDatabase();
    db.saveGameSettings(
      gameSettings,
      () => dispatch(loadGameSettings()),
      error => dispatch(showFlash(
        'Storage Error',
        'Error saving basic character settings: ' +
        error.message +
        ' The settings will be restored when you next fetch data.'
      ))
    );
  };
}

/**
 * Add new Profiles to the database, or update existing ones.
 * @param profiles {Array<PlayerProfile>}
 * @param allyCode {string}
 * @returns {Function}
 */
export function saveProfiles(profiles, allyCode) {
  return function (dispatch) {
    const db = getDatabase();
    db.saveProfiles(
      profiles,
      () => dispatch(loadProfiles(allyCode)),
      error => dispatch(showError(
        'Error saving player profiles: ' + error.message
      ))
    );
  };
}

export function addModsToProfiles(newProfiles) {
  const newProfilesObject = groupByKey(newProfiles, profile => profile.allyCode);

  return function (dispatch, getState) {
    const state = getState();
    const db = getDatabase();
    db.getProfiles(
      profiles => {
        const updatedProfiles = profiles.map(profile => {
          if (!newProfilesObject.hasOwnProperty(profile.allyCode)) {
            return profile;
          }

          const profileModsObject = groupByKey(profile.mods, mod => mod.id);
          const newProfileMods = newProfilesObject[profile.allyCode].mods.map(mod => Mod.fromHotUtils(mod));
          const newProfileModsObject = groupByKey(newProfileMods, mod => mod.id)
          return profile.withMods(Object.values(Object.assign({}, profileModsObject, newProfileModsObject)));
        });

        const totalMods = newProfiles.reduce((sum, profile) => sum + profile.mods.length, 0);

        db.saveProfiles(
          updatedProfiles,
          () => {
            dispatch(loadProfiles(state.allyCode));
            dispatch(showFlash(
              'Success!',
              <p>
                Successfully imported  data for <span className={'gold'}>{newProfiles.length}</span> profile(s)
                containing <span className={'gold'}>{totalMods}</span> mods.
              </p>,
            ));
          },
          error => dispatch(showError(
            'Error saving player profiles: ' + error.message
          ))
        );
      },
      error => dispatch(showError(
        'Error reading profiles: ' + error.message
      ))
    );
  }
}

export function replaceModsForProfiles(newProfiles) {
  const newProfilesObject = groupByKey(newProfiles, profile => profile.allyCode);

  return function (dispatch, getState) {
    const state = getState();
    const db = getDatabase();
    db.getProfiles(
      profiles => {
        const updatedProfiles = profiles.map(profile => {
          if (!newProfilesObject.hasOwnProperty(profile.allyCode)) {
            return profile;
          }

          const newProfileMods = newProfilesObject[profile.allyCode].mods.map(mod => Mod.fromHotUtils(mod));
          return profile.withMods(newProfileMods);
        });

        const totalMods = newProfiles.reduce((sum, profile) => sum + profile.mods.length, 0);

        db.saveProfiles(
          updatedProfiles,
          () => {
            dispatch(loadProfiles(state.allyCode));
            dispatch(showFlash(
              'Success!',
              <p>
                Successfully imported  data for <span className={'gold'}>{newProfiles.length}</span> profile(s)
                containing <span className={'gold'}>{totalMods}</span> mods.
              </p>,
            ));
          },
          error => dispatch(showError(
            'Error saving player profiles: ' + error.message
          ))
        );
      },
      error => dispatch(showError(
        'Error reading profiles: ' + error.message
      ))
    );
  }
}

/**
 * Remove a mod from a player's profile
 * @param mod {Mod}
 * @returns {Function}
 */
export function deleteMod(mod) {
  return updateProfile(
    profile => {
      const oldMods = profile.mods;

      return profile.withMods(oldMods.filter(oldMod => oldMod !== mod));
    },
    function (dispatch, getState) {
      const profile = getState().profile;
      const db = getDatabase();

      db.deleteLastRun(
        profile.allyCode,
        nothing,
        error => dispatch(showFlash(
          'Storage Error',
          'Error updating your saved results: ' +
          error.message +
          ' The optimizer may not recalculate correctly until you fetch data again'
        ))
      );
    }
  );
}

/**
 * Remove a set of mods from a player's profile
 * @param mods {Array<Mod>}
 * @returns {Function}
 */
export function deleteMods(mods) {
  return updateProfile(
    profile => {
      const oldMods = profile.mods;

      return profile.withMods(oldMods.filter(oldMod => !mods.includes(oldMod)));
    },
    function (dispatch, getState) {
      const profile = getState().profile;
      const db = getDatabase();

      db.deleteLastRun(
        profile.allyCode,
        nothing,
        error => dispatch(showFlash(
          'Storage Error',
          'Error updating your saved results: ' +
          error.message +
          ' The optimizer may not recalculate correctly until you fetch data again'
        ))
      );
    }
  )
}

/**
 * Add new Optimizer Runs to the database, or update existing ones.
 * @param lastRuns {Array<OptimizerRun>}
 * @returns {Function}
 */
export function saveLastRuns(lastRuns) {
  return function (dispatch) {
    const db = getDatabase();
    db.saveLastRuns(
      lastRuns,
      nothing,
      error => dispatch(showError(
        'Error saving previous runs: ' + error.message +
        ' The optimizer may not recalculate all toons properly until you fetch data again.'
      ))
    );
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

export function setCharacterTemplates(templates) {
  return {
    type: SET_CHARACTER_TEMPLATES,
    templates: templates
  };
}

/**
 * Add a profile to the state's list of player profiles
 * @param profile {PlayerProfile}
 */
export function addPlayerProfile(profile) {
  return {
    type: ADD_PLAYER_PROFILE,
    profile: profile
  };
}

export function setPlayerProfiles(profiles) {
  return {
    type: SET_PLAYER_PROFILES,
    profiles: profiles
  };
}

export function setHotUtilsSubscription(hasAccess) {
  return {
    type: SET_HOTUTILS_SUBSCRIPTION,
    subscription: !!hasAccess
  }
}
