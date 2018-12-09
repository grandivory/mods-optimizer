// @flow

import Mod from "../../domain/Mod";
import {PlayerValues} from "../../domain/CharacterDataClasses";
import cleanAllyCode from "../../utils/cleanAllyCode";
import {hideFlash, showError} from "./app";

export const TOGGLE_KEEP_OLD_MODS = 'TOGGLE_KEEP_OLD_MODS';
export const REQUEST_CHARACTERS = 'REQUEST_CHARACTERS';
export const RECEIVE_CHARACTERS = 'RECEIVE_CHARACTERS';
export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const REQUEST_STATS = 'REQUEST_STATS';
export const RECEIVE_STATS = 'RECEIVE_STATS';
export const SET_MODS = 'SET_MODS';

export function toggleKeepOldMods() {
  return {
    type: TOGGLE_KEEP_OLD_MODS,
  };
}

export function requestCharacters() {
  return {
    type: REQUEST_CHARACTERS
  };
}

export function receiveCharacters(characters) {
  return {
    type: RECEIVE_CHARACTERS,
    characters: characters
  };
}

export function requestProfile(allyCode) {
  return {
    type: REQUEST_PROFILE,
    allyCode: allyCode
  };
}

export function receiveProfile(allyCode, profile) {
  return {
    type: RECEIVE_PROFILE,
    allyCode: allyCode,
    profile: profile
  };
}

/**
 * Request the base and equipped stats for a list of characters
 * @returns {{type: string}}
 */
export function requestStats() {
  return {
    type: REQUEST_STATS
  };
}

/**
 * Handle the receipt of base and equipped stats for a list of characters
 * @param allyCode String
 * @param characterStats Object{Character.baseID: {baseStats: CharacterStats, equippedStats: CharacterStats}}
 * @returns {{type: string, allyCode: string, stats: *}}
 */
export function receiveStats(allyCode, characterStats) {
  return {
    type: RECEIVE_STATS,
    allyCode: allyCode,
    stats: characterStats
  };
}

export function setMods(modsData) {
  return {
    type: SET_MODS,
    modsData: modsData
  };
}

function post(url = '', data = {}, extras = {}) {
  return fetch(url, Object.assign({
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    mode: "cors",
  }, extras))
    .then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(errorText => {
            return Promise.reject(new Error(errorText));
          });
        }
      }
    );
}

function dispatchFetchCharacters(dispatch) {
  dispatch(requestCharacters());
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .catch(() => {throw new Error('Error when fetching character definitions from swgoh.gg. Please try again.')})
    .then(characters => {
      dispatch(receiveCharacters(characters));
      return characters;
    });
}

function dispatchFetchProfile(dispatch, allyCode) {
  dispatch(requestProfile(allyCode));
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/playerprofile/',
    {'ally-code': allyCode}
  )
    .then(
      playerProfile => {
        const roster = playerProfile.roster.filter(entry => entry.combatType === 'CHARACTER');

        // Convert mods to the serialized format recognized by the optimizer
        const profileMods = roster.map(character => character.mods.map(mod => Mod.fromSwgohHelp(mod, character.defId)))
          .reduce((allMods, charMods) => allMods.concat(charMods), []);

        // Convert each character to a PlayerValues object
        const profileCharacters = roster.reduce((characters, character) => {
          characters[character.defId] = PlayerValues.fromSwgohHelp(character);
          return characters;
        }, {});

        return {
          mods: profileMods,
          characters: profileCharacters,
          updated: playerProfile.updated
        };
      },
    )
    .catch(error => {
      if (error instanceof TypeError) {
        throw new Error(
          'Your character and mod data is taking a long time to update. Please wait a few minutes and try again.'
        );
      } else {
        throw error;
      }
    })
    .then(profile => {
      dispatch(receiveProfile(allyCode, profile));
      return profile;
    });
}

function dispatchFetchCharacterStats(dispatch, allyCode, characters = null) {
  if (null !== characters) {
    return post(
      'https://crinolo-swgoh.glitch.me/statCalc/api/characters',
      Object.keys(characters).map(charID => {
        return {
          'defId': charID,
          'rarity': characters[charID].stars,
          'level': characters[charID].level,
          'gear': characters[charID].gearLevel,
          'equipped': characters[charID].gearPieces
        };
      })
    )
      .catch(() => {throw new Error('Error fetching your character\'s stats. Please try again.')})
      .then(statsResponse => {
        dispatch(receiveStats(allyCode, statsResponse));
        return statsResponse;
      });
  } else {
    return Promise.resolve()
      .then(() => dispatch(receiveStats(allyCode, null)));
  }
}

export function refreshPlayerData(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacters(dispatch, cleanedAllyCode)
    // Only continue to fetch the player's profile if the character fetch was successful
      .then((characters) => characters && dispatchFetchProfile(dispatch, cleanedAllyCode))
      .then(profile => dispatchFetchCharacterStats(dispatch, cleanedAllyCode, profile ? profile.characters : null))
      .catch(error => dispatch(showError(error.message)));
  }
}

/**
 * Asynchronously fetch the set of all characters from swgoh.gg
 *
 * @param allyCode string The ally code under which to store the character information
 */
export function fetchCharacters(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacters(dispatch, cleanedAllyCode)
      .catch(error => dispatch(showError(error.message)));
  }
}

/**
 * Asynchronously fetch a player's profile, updating state before the fetch to show that the app is busy, and after
 * the fetch to fill in with the response
 *
 * @param allyCode string The ally code to fetch a profile for
 */
export function fetchProfile(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchProfile(dispatch, cleanedAllyCode)
      .catch(error => dispatch(showError(error.message)));
  }
}

export function fetchCharacterStats(allyCode, characters) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacterStats(dispatch, cleanedAllyCode, characters)
      .catch(error => {
        dispatch(hideFlash());
        dispatch(showError(error.message))
      });
  }
}
