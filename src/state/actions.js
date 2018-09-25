import {modSets, modSlots, modStats} from "../constants/enums";
import {characters} from "../constants/characters";
import Character from "../domain/Character";

export const CHANGE_SECTION = 'CHANGE_SECTION';
export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
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

function post(url='', data={}, extras={}) {
  return fetch(url, Object.assign({
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: JSON.stringify(data),
    mode: "cors",
  }, extras)).then(response => response.json());
}

/**
 * Asynchronously fetch a player's profile, updating state before the fetch to show that the app is busy, and after
 * the fetch to fill in with the response
 *
 * @param allyCode string The ally code to fetch a profile for
 */
export function fetchProfile(allyCode) {
  const cleanAllyCode = allyCode.replace(/[^\d]/g, '');

  return function (dispatch) {
    dispatch(requestProfile(cleanAllyCode));
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/playerprofile/',
      {'ally-code': cleanAllyCode}
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

          // Link each character to the base character defined in characters.js
          const profileCharacters = roster.map(character => {
            const baseCharacter = Object.values(characters).find(c => c.baseID === character.defId);

            if (baseCharacter) {
              const char = baseCharacter.clone();
              char.level = character.level;
              char.gearLevel = character.gear;
              char.starLevel = character.rarity;
              char.gearPieces = character.equipped;
              char.galacticPower = character.gp;
              return char;
            } else {
              return Character.simpleCharacter(
                character.name,
                character.defId,
                character.level,
                character.rarity,
                character.gear,
                character.equipped,
                character.gp);
            }
          }).reduce((charactersObj, character) => Object.assign(charactersObj, {[character.baseID]: character}), {});

          return {
            mods: profileMods,
            characters: profileCharacters
          };
        },
        error => console.dir(error)
      )
      .then(profile => {
        console.dir(profile);
        dispatch(receiveProfile(cleanAllyCode, profile));
      })
  }
}
