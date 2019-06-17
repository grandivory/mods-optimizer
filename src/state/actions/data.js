// @flow

import React from 'react';
import Mod from "../../domain/Mod";
import {GameSettings, OptimizerSettings, PlayerValues} from "../../domain/CharacterDataClasses";
import cleanAllyCode from "../../utils/cleanAllyCode";
import {hideFlash, setIsBusy, showError, showFlash} from "./app";
import getDatabase from "../storage/Database";
import nothing from "../../utils/nothing";
import PlayerProfile from "../../domain/PlayerProfile";
import {mapObjectByKeyAndValue} from "../../utils/mapObject";
import Character from "../../domain/Character";
import characterSettings from "../../constants/characterSettings";
import OptimizationPlan from "../../domain/OptimizationPlan";
import groupByKey from "../../utils/groupByKey";
import {addPlayerProfile, setGameSettings, setProfile} from "./storage";
import {changeOptimizerView} from "./review";
import CharacterStats, {NullCharacterStats} from "../../domain/CharacterStats";

export const TOGGLE_KEEP_OLD_MODS = 'TOGGLE_KEEP_OLD_MODS';
export const REQUEST_CHARACTERS = 'REQUEST_CHARACTERS';
export const REQUEST_PROFILE = 'REQUEST_PROFILE';
export const REQUEST_STATS = 'REQUEST_STATS';

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

export function requestProfile(allyCode) {
  return {
    type: REQUEST_PROFILE,
    allyCode: allyCode
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

/**
 * Fetch base character data from the API
 * @param dispatch {function} The Redux dispatch function
 * @param lastStep {boolean} Whether this is the last step in the API calls
 * @returns {Promise<Array | string[]>}
 */
function dispatchFetchCharacters(dispatch, lastStep) {
  dispatch(requestCharacters());
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .then(characters => {
      dispatch(receiveCharacters(characters, lastStep));
      return [];
    }, () => {
      return [
        'Error when fetching character definitions from swgoh.gg. ' +
        'Some characters may not optimize properly until you fetch again.'
      ];
    });
}

/**
 * Fetch a player profile from the API
 * @param dispatch {function} The Redux dispatch function
 * @param allyCode {string} The ally code to request
 * @param messages {Array<string>} Any messages to post to the user after the call is complete
 * @param keepOldMods {boolean} Whether to keep all existing mods, regardless of whether they were returned in this call
 * @param lastStep {boolean} Whether this is the last step in the API calls
 * @returns {Promise<T | never>}
 */
function dispatchFetchProfile(dispatch, allyCode, messages, keepOldMods, lastStep) {
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
          name: playerProfile.name,
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
      dispatch(receiveProfile(allyCode, profile, messages, keepOldMods, lastStep));
      return profile;
    });
}

function dispatchFetchCharacterStats(dispatch, allyCode, characters = null) {
  if (null !== characters) {
    return post(
      'https://crinolo-swgoh.glitch.me/statCalc/api/characters',
      Object.keys(characters).map(charID => ({
          'defId': charID,
          'rarity': characters[charID].stars,
          'level': characters[charID].level,
          'gear': characters[charID].gearLevel,
          'equipped': characters[charID].gearPieces
        }))
    )
      .catch(() => {
        throw new Error('Error fetching your character\'s stats. Please try again.')
      })
      .then(statsResponse => {
        dispatch(receiveStats(allyCode, Object.keys(characters), statsResponse));
        return statsResponse;
      });
  } else {
    return Promise.resolve()
      .then(() => dispatch(receiveStats(allyCode, null)));
  }
}

/**
 * Collect all the information needed for the optimizer for a player
 * @param allyCode {string}
 * @param keepOldMods {boolean} Whether to keep all existing mods, regardless of whether they were returned in this call
 * @returns {function(*=): Promise<T | never | never>}
 */
export function refreshPlayerData(allyCode, keepOldMods) {
  const cleanedAllyCode = cleanAllyCode(allyCode);
  const messages = [];

  return function(dispatch) {
    return dispatchFetchCharacters(dispatch, false)
    // Only continue to fetch the player's profile if the character fetch was successful
      .then((characterMessages) => {
        messages.push(...characterMessages);
        return dispatchFetchProfile(dispatch, cleanedAllyCode, messages, keepOldMods, false);
      })
      .then(profile => dispatchFetchCharacterStats(dispatch, cleanedAllyCode, profile ? profile.characters : null))
      .catch(error => {
        dispatch(hideFlash());
        dispatch(showError(error.message));
      });
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
    return dispatchFetchCharacters(dispatch, cleanedAllyCode, true);
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
    return dispatchFetchProfile(dispatch, cleanedAllyCode, true)
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

/**
 * Update the set of known characters in the state (independent of any one profile) with data from swgoh.gg
 * @param characters {Array<Object>} The result from the call to the API
 * @param lastStep {boolean} Whether this is the end of the API call chain
 * @returns {Function}
 */
export function receiveCharacters(characters, lastStep) {
  return function(dispatch) {
    const db = getDatabase();
    if (!characters && lastStep) {
      dispatch(setIsBusy(false));
      return;
    }

    const gameSettings = characters.map(character => {
      return new GameSettings(
        character.base_id,
        character.name,
        character.image,
        character.categories
          .concat([character.alignment, character.role])
          .concat(null !== character.ship_slot ? ['Crew Member'] : []),
        character.description
      );
    });

    dispatch(setGameSettings(groupByKey(gameSettings, gs => gs.baseID)));

    db.saveGameSettings(
      gameSettings,
      lastStep ? () => {
        dispatch(setIsBusy(false));
      } : nothing,
      error => dispatch(showFlash(
        'Storage Error',
        'Error saving base character settings: ' +
        error.message +
        ' The optimizer may not function properly for all characters'
      ))
    );
  };
}

/**
 * Update the profile for a particular ally code with new mod and character data
 * @param allyCode {string} the ally code that was fetched
 * @param profile {Object} The result from the API call
 * @param messages {Array<string>} Any messages to post to the user
 * @param keepOldMods {boolean} Whether to keep all existing mods, regardless of whether they were returned in this call
 * @param lastStep {boolean} Whether this is the last step in the API call chain
 * @returns {Function}
 */
export function receiveProfile(allyCode, profile, messages, keepOldMods, lastStep) {
  return function(dispatch) {
    const db = getDatabase();
    if ((!profile || !profile.characters) && lastStep) {
      dispatch(setIsBusy(false));
      return;
    }

    db.getGameSettings(
      gameSettings => {
        db.getProfile(
          allyCode,
          dbProfile => {
            const oldProfile = dbProfile ?
              dbProfile.withPlayerName(profile.name) :
              new PlayerProfile(allyCode, profile.name);
            // Collect the new character objects by combining the default characters with the player values
            // and the optimizer settings from the current profile.
            const newCharacters = mapObjectByKeyAndValue(profile.characters, (id, playerValues) => {
              if (oldProfile.characters.hasOwnProperty(id)) {
                return oldProfile.characters[id]
                  .withPlayerValues(playerValues)
                  .withOptimizerSettings(oldProfile.characters[id].optimizerSettings);
              } else {
                return (new Character(id))
                  .withPlayerValues(playerValues)
                  .withOptimizerSettings(new OptimizerSettings(
                    characterSettings[id] ? characterSettings[id].targets[0] : new OptimizationPlan(),
                    [],
                    gameSettings[id] && gameSettings[id].tags.includes('Crew Member') ? 5 : 1,
                    false,
                    false
                  ));
              }
            });

            // Update the mods by deserializing each one
            const newMods = groupByKey(profile.mods, mod => mod.id);

            // If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
            let finalMods;

            if (keepOldMods) {
              const oldMods = oldProfile.mods.reduce((mods, mod) => {
                mods[mod.id] = mod.unequip();
                return mods;
              }, {});

              finalMods = Object.values(Object.assign({}, oldMods, newMods));
            } else {
              finalMods = Object.values(newMods);
            }

            const newProfile = oldProfile.withCharacters(newCharacters).withMods(finalMods);
            db.saveProfile(
              newProfile,
              nothing,
              error => dispatch(showFlash(
                'Storage Error',
                'Error saving your profile: ' + error.message + ' Your data may be lost on page refresh.'
              ))
            );
            db.deleteLastRun(
              newProfile.allyCode,
              nothing,
              error => dispatch(showFlash(
                'Storage Error',
                'Error updating your data: ' +
                error.message +
                ' The optimizer may not recalculate correctly until you fetch again'
              ))
            );
            dispatch(addPlayerProfile(newProfile));
            dispatch(setProfile(newProfile));
            if (lastStep) {
              dispatch(setIsBusy(false));
            }
          },
          error => {
            dispatch(showError('Error fetching your profile: ' + error.message + ' Please try again'));
            if (lastStep) {
              dispatch(setIsBusy(false));
            }
          }
        );
      },
      error => {
        dispatch(showError('Database error: ' + error.message + ' Please try again.'));
        if (lastStep) {
          dispatch(setIsBusy(false));
        }
      }
    );

    const lastUpdate = new Date(profile.updated);
    const nextUpdate = new Date(lastUpdate.getTime() + 60 * 60 * 1000); // plus one hour

    dispatch(changeOptimizerView('edit'));
    dispatch(showFlash(
      messages.length ? 'API Errors' : 'Success!',
      (messages.length ? [
        <div className={'errors'} key={0}>
          {messages.map((message, index) => <p key={index}>{message}</p>)}
        </div>
      ] : []).concat([
        <p key={100}>
          Successfully pulled data for <span className={'gold'}>{Object.keys(profile.characters).length}
          </span> characters and <span className={'gold'}>{profile.mods.length}</span> mods.</p>,
        <p key={101}>Your data was last updated as of <span className={'gold'}>{lastUpdate.toLocaleString()}</span>.
        </p>,
        <p key={102}>You should be able to fetch fresh data any time after <span className={'gold'}>
          {nextUpdate.toLocaleString()}</span>
        </p>,
        <hr key={103}/>,
        <h3 key={104}><strong>
          Remember: The optimizer can only pull data for mods that you currently have equipped!
        </strong></h3>,
        <p key={105}>
          If it looks like you're missing mods, try equipping them on your characters and fetching data again after
          the
          time listed above.
        </p>,
      ])
    ));
  };
}

/**
 * Handle the receipt of base and equipped stats for a list of characters
 * @param allyCode String
 * @param requestedCharacters {Array<string>} The baseIDs of all characters that were requested
 * @param characterStats Object{Character.baseID: {baseStats: CharacterStats, equippedStats: CharacterStats}}
 * @returns {Function}
 */
export function receiveStats(allyCode, requestedCharacters, characterStats) {
  return function(dispatch) {
    const db = getDatabase();
    if (!characterStats) {
      dispatch(setIsBusy(false));
      return;
    }

    db.getProfile(
      allyCode,
      oldProfile => {
        const newProfile = oldProfile.withCharacters(
          characterStats.reduce((characters, statObject) => {
            const unit = statObject.unit ? statObject.unit : statObject;
            const stats = statObject.stats;

            const character = oldProfile.characters[unit.defId];

            const baseStats = stats.base ?
              new CharacterStats(
                stats.base['Health'] || 0,
                stats.base['Protection'] || 0,
                stats.base['Speed'] || 0,
                stats.base['Potency'] || 0,
                stats.base['Tenacity'] || 0,
                stats.base['Physical Damage'] || 0,
                stats.base['Physical Critical Rating'] || 0,
                stats.base['Armor'] || 0,
                stats.base['Special Damage'] || 0,
                stats.base['Special Critical Rating'] || 0,
                stats.base['Resistance'] || 0
              ) :
              NullCharacterStats;

            let equippedStats = NullCharacterStats;

            if (stats.gear) {
              const gearStats = new CharacterStats(
                stats.gear['Health'] || 0,
                stats.gear['Protection'] || 0,
                stats.gear['Speed'] || 0,
                stats.gear['Potency'] || 0,
                stats.gear['Tenacity'] || 0,
                stats.gear['Physical Damage'] || 0,
                stats.gear['Physical Critical Rating'] || 0,
                stats.gear['Armor'] || 0,
                stats.gear['Special Damage'] || 0,
                stats.gear['Special Critical Rating'] || 0,
                stats.gear['Resistance'] || 0
              );
              equippedStats = baseStats.plus(gearStats);
            }

            characters[unit.defId] =
              character.withPlayerValues(character.playerValues.withBaseStats(baseStats)
                .withEquippedStats(equippedStats));

            return characters;
          }, {})
        );

        db.saveProfile(
          newProfile,
          nothing,
          error => {
            dispatch(showFlash(
              'Storage Error',
              'Error saving your profile: ' + error.message + ' Your data may be lost on page refresh.'
            ));
            dispatch(setIsBusy(false));
          }
        );
        dispatch(setProfile(newProfile));
        dispatch(setIsBusy(false));
      }
    );

    const errorCharacters = requestedCharacters.filter(charID =>
      !characterStats.find(stats => {
        const unit = stats.unit ? stats.unit : stats;
        return unit.defId === charID && !stats.stats.error;
      })
    );

    const errorMessage = errorCharacters.length > 0 ?
      'Missing stats for characters: ' + errorCharacters.join(', ') +
      '. These characters may not optimize properly.'
      : null;

    if (errorMessage) {
      dispatch(showError(errorMessage));
    }
  };
}

