import {modSets, modSlots, modStats} from "../constants/enums";
import cleanAllyCode from "../utils/cleanAllyCode";
import {PlayerValues} from "../domain/CharacterDataClasses";

export const CHANGE_SECTION = 'CHANGE_SECTION';
export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const REQUEST_CHARACTERS = 'REQUEST_CHARACTERS';
export const RECEIVE_CHARACTERS = 'RECEIVE_CHARACTERS';
export const LOG = 'LOG';

export function logState() {
  return {
    type: LOG
  };
}

export function changeSection(newSection) {
  return {
    type: CHANGE_SECTION,
    section: newSection
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

function post(url='', data={}, extras={}) {
  return fetch(url, Object.assign({
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: JSON.stringify(data),
    mode: "cors",
  }, extras)).then(response => response.json());
}

function dispatchFetchCharacters(dispatch) {
  dispatch(requestCharacters());
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .then(characters => {console.log(characters); return characters;})
    .then(characters => dispatch(receiveCharacters(characters)))
}

function dispatchFetchProfile(dispatch, allyCode) {
  dispatch(requestProfile(allyCode));
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/playerprofile/',
    {'ally-code': allyCode}
  )
    .then(
      playerProfile => {
        const roster = playerProfile.roster.filter(entry => entry.type === 'CHARACTER');

        // Convert mods to the serialized format recognized by the optimizer
        const profileMods = roster.map(character =>
          character.mods.map(mod => {
            mod.characterName = character.name;
            mod.mod_uid = mod.id;
            mod.set = modSets[mod.set];
            mod.slot = modSlots[mod.slot];
            mod.primaryBonusType = modStats[mod.primaryBonusType];
            for (let i = 1; i <= 4; i++) {
              mod[`secondaryType_${i}`] = modStats[mod[`secondaryType_${i}`]];
            }
            return mod;
          }))
          .reduce((allMods, charMods) => allMods.concat(charMods), []);

        // Convert each character to a PlayerValues object
        const profileCharacters = roster.map(character => new PlayerValues(
          character.level,
          character.rarity,
          character.gear,
          character.equipped.map(gear => {return {equipmentId: gear.equipmentId};}),
          character.gp
        ));

        return {
          mods: profileMods,
          characters: profileCharacters
        };
      },
      error => console.dir(error)
    )
    .then(profile => {
      console.dir(profile);
      dispatch(receiveProfile(allyCode, profile));
    });
}

export function refreshPlayerData(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function(dispatch) {
    return dispatchFetchCharacters(dispatch, cleanedAllyCode)
      // .then(() => dispatchFetchProfile(dispatch, cleanedAllyCode));
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
    return dispatchFetchCharacters(dispatch, cleanedAllyCode);
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

  return function (dispatch) {
    return dispatchFetchProfile(dispatch, cleanedAllyCode);
  }
}
