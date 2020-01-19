// @flow

import React from 'react';
import Mod from "../../domain/Mod";
import { GameSettings, OptimizerSettings, PlayerValues } from "../../domain/CharacterDataClasses";
import cleanAllyCode from "../../utils/cleanAllyCode";
import { hideFlash, setIsBusy, showError, showFlash, hideModal } from "./app";
import getDatabase from "../storage/Database";
import nothing from "../../utils/nothing";
import PlayerProfile from "../../domain/PlayerProfile";
import { mapObjectByKeyAndValue } from "../../utils/mapObject";
import Character from "../../domain/Character";
import characterSettings from "../../constants/characterSettings";
import OptimizationPlan from "../../domain/OptimizationPlan";
import groupByKey from "../../utils/groupByKey";
import { addPlayerProfile, setGameSettings, setProfile, setHotUtilsSubscription } from "./storage";
import { changeOptimizerView } from "./review";
import CharacterStats, { NullCharacterStats } from "../../domain/CharacterStats";

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

export function checkVersion() {
  return function (dispatch) {
    return dispatchFetchVersion(dispatch)
      .catch(error => {
        dispatch(hideFlash());
        dispatch(showError(error.message));
      });
  }
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
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    mode: "cors",
  }, extras))
    .then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then(errorText => Promise.reject(new Error(errorText)));
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
        'Some characters may not optimize properly until you fetch again.',
        'This is an error with an API that the optimizer uses (swgoh.gg) and NOT ' +
        'an error in the optimizer itself. Feel free to discuss it on the ' +
        'optimizer\'s discord server, but know that there are no changes that ' +
        'can be made to the optimizer to fix this issue.'
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
    { 'ally-code': allyCode }
  ).then(playerProfile => {
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
  }).then(profile => {
    dispatch(receiveProfile(allyCode, profile, messages, keepOldMods, lastStep));
    return profile;
  });
}

function dispatchFetchCharacterStats(dispatch, allyCode, characters = null) {
  if (null !== characters) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/stats',
      Object.keys(characters).map(charID => ({
        'defId': charID,
        'rarity': characters[charID].stars,
        'level': characters[charID].level,
        'gear': characters[charID].gearLevel,
        'equipped': characters[charID].gearPieces,
        'relic': {
          'currentTier': characters[charID].relicTier
        }
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

function dispatchFetchVersion(dispatch) {
  return fetch(
    'https://api.mods-optimizer.swgoh.grandivory.com/versionapi',
    { method: 'POST', body: {}, mode: 'cors' }
  )
    .then(response => response.text())
    .then(version => {
      dispatch(receiveVersion(version));
      return version;
    }).catch(error => {
      console.error(error);
      throw new Error(
        'Error fetching the current version. Please check to make sure that you are on the latest version'
      );
    });
}

function dispatchFetchHotUtilsStatus(dispatch, allyCode) {
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
    {
      'action': 'checkstatus',
      'payload': {
        'allyCode': allyCode
      }
    }
  ).then(response => {
    dispatch(receiveHotUtilsStatus(response));
    return response;
  }).catch(error => {
    console.error(error);
    throw error;
  });
}

function dispatchCreateHotUtilsProfile(dispatch, profile) {
  dispatch(setIsBusy(true));
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
    {
      'action': 'createprofile',
      'payload': profile
    }
  ).then(response => {
    dispatch(receiveHotUtilsCreateProfileResponse(response));
    return response;
  }).catch(error => {
    console.error(error);
    throw error;
  });
}

function dispatchGetHotUtilsMods(dispatch, allyCode) {
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
    {
      'action': 'getmods',
      'payload': {
        'allyCode': allyCode
      }
    }
  ).then(response => {
    dispatch(receiveHotUtilsModsResponse(response));
    return response;
  }).catch(error => {
    console.error(error);
    throw error;
  });
}

function dispatchMoveHotUtilsMods(dispatch, profile) {
  dispatch(setIsBusy(true));
  return fetch(
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
    Object.assign({
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'action': 'movemods',
        'payload': profile
      }),
      mode: "cors",
    })
  ).then(
    response => {
      if (response.status === 504) {
        // In this particular case, a 504 doesn't mean a failure.
        // Start polling the status to figure out when the mod move is complete.
        return pollForModMoveStatus(profile.allyCode);
      } else if (response.ok) {
        return response.json();
      } else {
        return response.text().then(errorText => Promise.reject(new Error(errorText)))
      }
    }
  ).then(response => {
    dispatch(receiveHotUtilsMoveModsResponse(response));
    return response;
  }).catch(error => {
    throw error;
  });
}

function pollForModMoveStatus(allyCode) {
  return new Promise((resolve, reject) => {
    post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
      {
        'action': 'checkmovestatus',
        'payload': {
          'allyCode': allyCode
        }
      }
    ).then(response => {
      switch (response.ResponseCode) {
        case 0:
          reject(new Error(response.ResponseMessage));
          break;
        case 1:
          // If the move is still ongoing, then poll again after a few seconds.
          setTimeout(
            () => resolve(pollForModMoveStatus(allyCode)),
            10000
          );
          break;
        case 2:
          resolve(response)
          break;
      }
    }).catch(error => reject(error))
  });
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

  return function (dispatch) {
    return dispatchFetchCharacters(dispatch, false)
      // Only continue to fetch the player's profile if the character fetch was successful
      .then((characterMessages) => {
        messages.push(...characterMessages);
        return dispatchFetchProfile(dispatch, cleanedAllyCode, messages, keepOldMods, false);
      })
      .then(profile => dispatchFetchCharacterStats(dispatch, cleanedAllyCode, profile ? profile.characters : null))
      .catch(error => {
        dispatch(setIsBusy(false));
        dispatch(hideFlash());
        dispatch(showError(
          [
            <p key={1}>{error.message}</p>,
            <p key={2}>
              This is an error with an API that the optimizer uses, and not a problem with the optimizer itself. Feel
              free to discuss this error on the optimizer discord, but know that there are no changes that can be made
              to the optimizer to fix this issue.
            </p>
          ]
        ));
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

  return function (dispatch) {
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

  return function (dispatch) {
    return dispatchFetchProfile(dispatch, cleanedAllyCode, true)
      .catch(error => {
        dispatch(setIsBusy(false));
        dispatch(showError(error.message));
      })
  }
}

export function fetchCharacterStats(allyCode, characters) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function (dispatch) {
    return dispatchFetchCharacterStats(dispatch, cleanedAllyCode, characters)
      .catch(error => {
        dispatch(setIsBusy(false));
        dispatch(hideFlash());
        dispatch(showError(error.message))
      });
  }
}

export function fetchHotUtilsStatus(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function (dispatch) {
    return dispatchFetchHotUtilsStatus(dispatch, cleanedAllyCode)
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
}

export function createHotUtilsProfile(profile) {
  return function (dispatch) {
    return dispatchCreateHotUtilsProfile(dispatch, profile)
      .catch(error => {
        console.error(error);
        dispatch(setIsBusy(false));
        dispatch(showError(error.message));
      })
  }
}

export function moveModsWithHotUtils(profile) {
  return function (dispatch) {
    return dispatchMoveHotUtilsMods(dispatch, profile)
      .catch(error => {
        console.error(error);
        dispatch(setIsBusy(false));
        dispatch(showError(error.message));
      })
  }
}

/**
 * Update the set of known characters in the state (independent of any one profile) with data from swgoh.gg
 * @param characters {Array<Object>} The result from the call to the API
 * @param lastStep {boolean} Whether this is the end of the API call chain
 * @returns {Function}
 */
function receiveCharacters(characters, lastStep) {
  return function (dispatch) {
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
        character.description,
        character.alignment
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
function receiveProfile(allyCode, profile, messages, keepOldMods, lastStep) {
  return function (dispatch) {
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
        dispatch(showError([
          <p key={1}>Database error: {error.message}</p>,
          <p key={2}>Grandivory's mods optimizer is is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>,
          <p key={3}>If you're still having trouble, try asking for help in the discord server below.</p>
        ]));
        if (lastStep) {
          dispatch(setIsBusy(false));
        }
      }
    );

    const lastUpdate = new Date(profile.updated);
    const nextUpdate = new Date(lastUpdate.getTime() + 60 * 60 * 1000); // plus one hour

    const fetchResults = (messages.length ? [
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
      <hr key={103} />,
      <h3 key={104}><strong>
        Remember: The optimizer can only pull data for mods that you currently have equipped!
      </strong></h3>,
      <p key={105}>
        If it looks like you're missing mods, try equipping them on your characters and fetching data again after
        the
        time listed above.
      </p>,
    ]);

    dispatch(changeOptimizerView('edit'));
    dispatch(showFlash(
      messages.length ? 'API Errors' : 'Success!',
      <div className={'fetch-results'}>
        {fetchResults}
      </div>
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
function receiveStats(allyCode, requestedCharacters, characterStats) {
  return function (dispatch) {
    const db = getDatabase();
    if (!characterStats) {
      dispatch(setIsBusy(false));
      return;
    }

    db.getProfile(
      allyCode,
      oldProfile => {
        const newProfile = oldProfile.withCharacters(
          characterStats.reduce((characters, unit) => {
            const stats = unit.stats;

            const character = oldProfile.characters[unit.defId];

            const baseStats = stats.base ?
              new CharacterStats(
                stats.base['Health'] || 0,
                stats.base['Protection'] || 0,
                stats.base['Speed'] || 0,
                stats.base['Potency'] || 0,
                stats.base['Tenacity'] || 0,
                stats.base['Physical Damage'] || 0,
                stats.base['Physical Critical Chance'] || 0,
                stats.base['Armor'] || 0,
                stats.base['Special Damage'] || 0,
                stats.base['Special Critical Chance'] || 0,
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
                stats.gear['Physical Critical Chance'] || 0,
                stats.gear['Armor'] || 0,
                stats.gear['Special Damage'] || 0,
                stats.gear['Special Critical Chance'] || 0,
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

function receiveVersion(version) {
  return function (dispatch, getState) {
    const state = getState();

    if (state.version < version) {
      dispatch(showFlash(
        'Version out-of-date!',
        [
          <p key={1}>
            The mods optimizer has been updated to version <strong>{version}</strong>.
            You're currently running version <strong>{state.version}</strong>
          </p>,
          <p key={2}>Please clear your cache and refresh to get the latest version.</p>
        ]
      ));
    }
  }
}

function receiveHotUtilsStatus(response) {
  return function (dispatch) {
    dispatch(setHotUtilsSubscription(response.ResponseCode))
  }
}

function receiveHotUtilsCreateProfileResponse(response) {
  return function (dispatch) {
    dispatch(setIsBusy(false));
    dispatch(hideModal());
    switch (response.ResponseCode) {
      case 0:
        dispatch(showError(response.ResponseMessage));
        break;
      case 1:
        dispatch(showFlash('Profile created successfully', 'Please login to HotUtils to manage your new profile'))
        break;
    }
  }
}

function receiveHotUtilsModsResponse(response) {
  return function (dispatch) {
    console.log(response);
  }
}

function receiveHotUtilsMoveModsResponse(response) {
  return function (dispatch) {
    dispatch(setIsBusy(false));
    dispatch(hideModal());
    switch (response.ResponseCode) {
      case 0:
        dispatch(showError(response.ResponseMessage));
        break;
      default:
        // This could be 1 or 2 depending on how the mod movement eventually completed.
        dispatch(showFlash(
          'Mods successfully moved',
          'Your mods have been moved. You may log into Galaxy of Heroes to see your characters.'
        ));
        break;
    }
  }
}
