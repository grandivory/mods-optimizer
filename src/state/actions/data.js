// @flow

import React from 'react';
import swgohStatCalc from 'swgoh-stat-calc'
import Mod from "../../domain/Mod";
import { GameSettings, OptimizerSettings, PlayerValues } from "../../domain/CharacterDataClasses";
import cleanAllyCode from "../../utils/cleanAllyCode";
import { hideFlash, setIsBusy, showError, showFlash, hideModal, updateProfile } from "./app";
import getDatabase from "../storage/Database";
import nothing from "../../utils/nothing";
import PlayerProfile from "../../domain/PlayerProfile";
import { mapObjectByKeyAndValue } from "../../utils/mapObject";
import Character from "../../domain/Character";
import characterSettings from "../../constants/characterSettings";
import OptimizationPlan from "../../domain/OptimizationPlan";
import groupByKey from "../../utils/groupByKey";
import { addPlayerProfile, setGameSettings, setProfile, setHotUtilsSubscription } from "./storage";
import { changeOptimizerView, reassignAllMods } from "./review";
import CharacterStats, { NullCharacterStats } from "../../domain/CharacterStats";

export const TOGGLE_KEEP_OLD_MODS = 'TOGGLE_KEEP_OLD_MODS';

export function toggleKeepOldMods() {
  return {
    type: TOGGLE_KEEP_OLD_MODS,
  };
}

export function checkVersion() {
  return function (dispatch) {
    return fetchVersion(dispatch)
      .then(version => {
        dispatch(processVersion(version));
        return version;
      }).catch(error => {
        dispatch(hideFlash());
        dispatch(showError(error.message));
      });
  }
}

function fetchVersion() {
  return fetch(
    'https://api.mods-optimizer.swgoh.grandivory.com/versionapi',
    { method: 'POST', body: {}, mode: 'cors' }
  )
    .then(response => response.text())
    .catch(error => {
      console.error(error);
      throw new Error(
        'Error fetching the current version. Please check to make sure that you are on the latest version'
      );
    });
}

function processVersion(version) {
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
 * Collect all the information needed for the optimizer for a player
 * @param allyCode {string}
 * @param keepOldMods {boolean} Whether to keep all existing mods, regardless of whether they were returned in this call
 * @param useHotUtils {boolean} Whether to use mod data from HotUtils in place of swgoh.help
 * @param sessionId {string} A session ID to use with HotUtils, which pulls unequipped mods but
 *                           will log the player out of the game
 * @param useSession {boolean} Whether to use the given sessionId, if one exists. This can be set to false to update the
 *                             profile with the session ID but not actually use it
 * @returns {function(*=): Promise<T | never | never>}
 */
export function refreshPlayerData(allyCode, keepOldMods, useHotUtils, sessionId, useSession = true) {
  const cleanedAllyCode = cleanAllyCode(allyCode);
  let usedHotUtils = false;
  const data = {};
  const messages = [];

  return function (dispatch) {
    dispatch(setIsBusy(true));

    // First, fetch character definitions from swgoh.gg
    return fetchCharacters()
      .catch(() => {
        messages.push('Error when fetching character definitions from swgoh.gg. ' +
          'Some characters may not optimize properly until you fetch again.'
        );
        messages.push('This is an error with an API that the optimizer uses (swgoh.gg) and NOT ' +
          'an error in the optimizer itself. Feel free to discuss it on the ' +
          'optimizer\'s discord server, but know that there are no changes that ' +
          'can be made to the optimizer to fix this issue.'
        )
        return null;
      })
      .then(gameSettings => {
        data.gameSettings = gameSettings;
      })
      // Then, fetch the player's data from swgoh.help
      .then(() => fetchProfile(cleanedAllyCode))
      .then(profile => {
        profile.sessionId = sessionId;
        data.profile = profile;
        return profile.characters;
      })
      // Fetch stats for all of the player's characters
      .then(profileCharacters => fetchCharacterStats(profileCharacters))
      .then(characterStats => data.characterStats = characterStats)
      // If the player is a HotUtils subscriber, then fetch their mods from
      // HotUtils and overwrite the mods from swgoh.help
      .then(() => {
        if (useHotUtils) {
          return getHotUtilsMods(cleanedAllyCode, useSession ? sessionId : null)
            .then(mods => {
              data.profile.mods = mods;
              usedHotUtils = true;
            })
            .catch(error => messages.push('Error fetching mods from HotUtils: ' + error.message))
        }
      })
      // Process all of the data that's been collected
      .then(() => {
        const db = getDatabase();

        if (data.gameSettings) {
          dispatch(setGameSettings(data.gameSettings));
          db.saveGameSettings(
            Object.values(data.gameSettings),
            nothing,
            error => dispatch(showFlash(
              'Storage Error',
              'Error saving base character settings: ' +
              error.message +
              ' The optimizer may not function properly for all characters'
            ))
          )
        }

        // If we used a HotUtils session, then the mods returned are all the mods a player has.
        // In this case, don't keep old mods around, even if the box is checked.
        dispatch(updatePlayerData(cleanedAllyCode, data, db, keepOldMods && !(usedHotUtils && useSession && sessionId)))

        // Show the success and/or error messages
        dispatch(showFetchResult(data, messages, usedHotUtils, !!sessionId && useSession));
      })
      .catch(error => {
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
      })
      .finally(() => {
        dispatch(setIsBusy(false));
      });
  }
}

/**
 * Fetch base character data from the API
 * @returns {Promise<Array | string[]>}
 */
function fetchCharacters() {
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .then(characters => {
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

      return groupByKey(gameSettings, gs => gs.baseID)
    });
}

/**
 * Fetch a player profile from the API
 * @param allyCode {string} The ally code to request
 * @returns {Promise<T | never>}
 */
function fetchProfile(allyCode) {
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
  })
}

function fetchCharacterStats(characters = null) {
  if (null !== characters) {
    return fetch('https://api.mods-optimizer.swgoh.grandivory.com/stat-calc-data')
      .catch(() => {
        throw new Error('The game data used to calculate character stats is currently being rebuilt. ' +
          'Please wait 60 seconds and try again')
      })
      .then(response => response.json())
      .then(statCalculatorData => {
        const eng_us = require('../../constants/statCalculatorEng_us.json');
        swgohStatCalc.setGameData(statCalculatorData);

        const characterData = Object.keys(characters).map(charID => ({
          'defId': charID,
          'rarity': characters[charID].stars,
          'level': characters[charID].level,
          'gear': characters[charID].gearLevel,
          'equipped': characters[charID].gearPieces,
          'relic': {
            'currentTier': characters[charID].relicTier
          }
        }));

        swgohStatCalc.calcRosterStats(characterData, { widhoutModCalc: true, language: eng_us });

        return characterData;
      })
  } else {
    return Promise.resolve(null);
  }
}

function updatePlayerData(allyCode, fetchData, db, keepOldMods) {
  return function (dispatch) {
    db.getProfile(
      allyCode,
      dbProfile => {
        const baseProfile = dbProfile ?
          dbProfile.withPlayerName(fetchData.profile.name) :
          new PlayerProfile(allyCode, fetchData.profile.name);

        const sessionId = fetchData.profile.sessionId ? fetchData.profile.sessionId : baseProfile.hotUtilsSessionId;
        const oldProfile = baseProfile.withHotUtilsSessionId(sessionId);

        // Collect character stats
        const characterStats = fetchData.characterStats.reduce(
          (characters, unit) => {
            const stats = unit.stats;

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

            return Object.assign(characters, {
              [unit.defId]: {
                baseStats: baseStats,
                equippedStats: equippedStats
              }
            });
          },
          {}
        )

        // Collect the new character objects by combining the default characters with the player values
        // and the optimizer settings from the current profile.
        const newCharacters = mapObjectByKeyAndValue(fetchData.profile.characters, (id, playerValues) => {
          const playerValuesWithStats = characterStats[id] ?
            playerValues
              .withBaseStats(characterStats[id].baseStats)
              .withEquippedStats(characterStats[id].equippedStats) :
            playerValues;

          if (oldProfile.characters.hasOwnProperty(id)) {
            return oldProfile.characters[id]
              .withPlayerValues(playerValuesWithStats)
              .withOptimizerSettings(oldProfile.characters[id].optimizerSettings);
          } else {
            return (new Character(id))
              .withPlayerValues(playerValuesWithStats)
              .withOptimizerSettings(new OptimizerSettings(
                characterSettings[id] ? characterSettings[id].targets[0] : new OptimizationPlan(),
                [],
                fetchData.gameSettings[id] && fetchData.gameSettings[id].tags.includes('Crew Member') ? 5 : 1,
                false,
                false
              ));
          }
        });

        const newMods = groupByKey(fetchData.profile.mods, mod => mod.id);

        // If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
        let finalMods;

        if (keepOldMods) {
          // If we're keeping the old mods, that means that any mod we don't see must be unequipped
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
        dispatch(fetchHotUtilsStatus(newProfile.allyCode));
      },
      error => {
        dispatch(showError('Error fetching your profile: ' + error.message + ' Please try again'));
      }
    )
  }
}

/**
 * Show messages related to the results of the fetch operation
 *
 * @param {Object} fetchData The results of the various API calls to gather player and game data
 * @param {Array<string>} errorMessages Any errors that should be shown with the results
 * @param {boolean} usedHotUtils Whether HotUtils' API was used to get up-to-date mods
 * @param {boolean} usedSession Whether a HotUtils session was used to pull unequipped mods
 */
function showFetchResult(fetchData, errorMessages, usedHotUtils, usedSession) {
  return function (dispatch) {
    const lastUpdate = new Date(fetchData.profile.updated);
    const nextUpdate = new Date(lastUpdate.getTime() + 60 * 60 * 1000); // plus one hour

    const fetchResults = [];

    if (errorMessages.length) {
      fetchResults.push(
        <div className={'errors'} key={0}>
          {errorMessages.map((message, index) => <p key={index}>{message}</p>)}
        </div>
      );
    }

    fetchResults.push(
      <p key={100}>
        Successfully pulled data for <span className={'gold'}>{Object.keys(fetchData.profile.characters).length}
        </span> characters and <span className={'gold'}>{fetchData.profile.mods.length}</span> mods.
      </p>
    );
    fetchResults.push(
      <p key={110}>
        Your player data was last updated as of <span className={'gold'}>{lastUpdate.toLocaleString()}</span>.
      </p>
    );

    if (usedHotUtils) {
      fetchResults.push(
        <p key={111}>
          <strong className={'gold'}>Your mod data from HotUtils is completely up-to-date!</strong>
        </p>
      )
      fetchResults.push(
        <p key={120}>
          You should be able to fetch fresh character data any time after <span className={'gold'}>
            {nextUpdate.toLocaleString()}
          </span>
        </p>
      );
      fetchResults.push(
        <p key={121}>
          <strong className={'gold'}>You can fetch fresh mod data again immediately!</strong>
        </p>
      )
    } else {
      fetchResults.push(
        <p key={120}>You should be able to fetch fresh data any time after <span className={'gold'}>
          {nextUpdate.toLocaleString()}</span>
        </p>
      );
    }

    if (!(usedHotUtils && usedSession)) {
      fetchResults.push(<hr key={130} />);
      fetchResults.push(
        <h3 key={140}><strong>
          Remember: The optimizer can only pull data for mods that you currently have equipped, unless you're pulling
          data using a HotUtils session!
        </strong></h3>
      );
      fetchResults.push(
        <p key={150}>
          If it looks like you're missing mods, try equipping them on your characters and fetching data again after
          the time listed above.
        </p>
      );
    }

    // Look for any characters in the profile that we didn't get stats for
    const missingCharacters = Object.keys(fetchData.profile.characters)
      .filter(charId => !fetchData.characterStats.find(stats => {
        const unit = stats.unit ? stats.unit : stats;
        return unit.defId === charId && !stats.stats.error;
      }))

    const statsErrorMessage = missingCharacters.length > 0 ?
      'Missing stats for characters: ' + missingCharacters.join(', ') +
      '. These characters may not optimize properly.'
      : null;

    dispatch(changeOptimizerView('edit'));
    dispatch(showFlash(
      missingCharacters.length ? 'API Errors' : 'Success!',
      <div className={'fetch-results'}>
        {fetchResults}
      </div>
    ));
    if (statsErrorMessage) {
      dispatch(showError(statsErrorMessage));
    }
  }
}

export function fetchCharacterList(mode, overwrite, allyCode) {
  return function (dispatch) {
    dispatch(setIsBusy(true))

    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/characterlist',
      {
        allyCode: allyCode,
        mode: mode
      }
    )
      .then(characterList => dispatch(applyCharacterList(overwrite, characterList)))
      .catch(error => {
        dispatch(showError(error.message))
      })
      .finally(() => dispatch(setIsBusy(false)))
  }
}

function applyCharacterList(overwrite, characterList) {
  return updateProfile(profile => {
    const startingList = overwrite ? [] : profile.selectedCharacters;
    const startingCharacterIDs = startingList.map(selectedCharacter => selectedCharacter.id)
    const charactersToApply = characterList.filter(characterID => !startingCharacterIDs.includes(characterID))

    const newSelectedCharacters = startingList.concat(
      charactersToApply.map(characterID => {
        const character = profile.characters[characterID]

        return character ?
          { id: characterID, target: character.defaultTarget() } :
          null
      }).filter(x => null !== x)
    )

    return profile.withSelectedCharacters(newSelectedCharacters)
  })
}

//***********************/
// HotUtils Integration */
//***********************/

/**
 * Fetch mods from HotUtils, optionally using a session to get unequipped mods
 * @param {string} allyCode The player to fetch mods for
 * @param {string} sessionId A session ID to use with HotUtils to collect
 *                           unequipped mods at the cost of logging the player
 *                           out of the game
 */
function getHotUtilsMods(allyCode, sessionId) {
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
    {
      'action': 'getmods',
      'sessionId': sessionId,
      'payload': {
        'allyCode': allyCode
      }
    }
  )
    .then(response => {
      // Parse out the HotUtils response to something the optimizer can use
      if (response.ResponseCode !== 1) {
        throw new Error(response.ResponseMessage);
      }

      const modsResponse = JSON.parse(response.Mods);

      const rawMods = modsResponse.profiles[0].mods;

      return rawMods.map(Mod.fromHotUtils)
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function fetchHotUtilsStatus(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function (dispatch) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
      {
        'action': 'checkstatus',
        'payload': {
          'allyCode': cleanedAllyCode
        }
      }
    )
      .then(response => dispatch(setHotUtilsSubscription(response.ResponseCode)))
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
}

export function createHotUtilsProfile(profile, sessionId) {
  return function (dispatch) {
    dispatch(setIsBusy(true));
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
      {
        'action': 'createprofile',
        'sessionId': sessionId,
        'payload': profile
      }
    )
      .then(response => {
        switch (response.ResponseCode) {
          case 0:
            dispatch(showError(response.ResponseMessage));
            break;
          case 1:
            dispatch(hideModal());
            dispatch(showFlash('Profile created successfully', 'Please login to HotUtils to manage your new profile'))
            break;
          default:
            dispatch(hideModal());
            dispatch(showError('Unknown response from HotUtils'));
            break;
        }
      })
      .catch(error => {
        dispatch(hideModal());
        dispatch(showError(error.message));
      })
      .finally(() => {
        dispatch(setIsBusy(false));
      })
  }
}

export function moveModsWithHotUtils(profile, sessionId) {
  return function (dispatch) {
    dispatch(setIsBusy(true));
    return fetch(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils',
      {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'action': 'movemods',
          'sessionId': sessionId,
          'payload': profile
        }),
        mode: "cors",
      }
    )
      .then(response => {
        if (response.status === 504) {
          // In this particular case, a 504 doesn't mean a failure.
          // Start polling the status to figure out when the mod move is complete.
          return pollForModMoveStatus(profile.allyCode);
        } else if (response.ok) {
          return response.json();
        } else {
          return response.text().then(errorText => Promise.reject(new Error(errorText)))
        }
      })
      .then(response => {
        switch (response.ResponseCode) {
          case 0:
            dispatch(hideModal());
            dispatch(showError(response.ResponseMessage));
            break;
          default:
            // This could be 1 or 2 depending on how the mod movement eventually completed.
            dispatch(hideModal());
            dispatch(reassignAllMods(profile.modAssignments));
            dispatch(showFlash(
              'Mods successfully moved',
              'Your mods have been moved. You may log into Galaxy of Heroes to see your characters.'
            ));
            break;
        }
      })
      .catch(error => {
        dispatch(hideModal());
        dispatch(showError(error.message));
      })
      .finally(() => {
        dispatch(setIsBusy(false));
      })
  }
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
        default:
          reject(new Error('Unknown response from HotUtils'))
          break;
      }
    }).catch(error => reject(error))
  });
}
