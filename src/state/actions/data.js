// @flow

import React from 'react';
import Mod from "../../domain/Mod";
import { GameSettings, OptimizerSettings, PlayerValues } from "../../domain/CharacterDataClasses";
import cleanAllyCode from "../../utils/cleanAllyCode";
import { hideFlash, setIsBusy, showError, showFlash, hideModal, showModal, updateProfile } from "./app";
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
import { filterObject } from '../../utils/filterObject';

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

    if (state.version !== version) {
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
export function refreshPlayerData(allyCode, keepOldMods, sessionId, useSession = true) {
  const cleanedAllyCode = cleanAllyCode(allyCode);
  const data = {};
  const messages = [];

  return function (dispatch) {
    dispatch(setIsBusy(true));

    // First, fetch character definitions from swgoh.gg
    return fetchCharacters()
      .catch(() => {
        messages.push('Error when fetching character definitions from HotUtils. ' +
          'Some characters may not optimize properly until you fetch again.'
        );
        messages.push('This is an error with an API that the optimizer uses (HotUtils) and NOT ' +
          'an error in the optimizer itself. Feel free to discuss it on the ' +
          'optimizer\'s discord server, but know that there are no changes that ' +
          'can be made to the optimizer to fix this issue.'
        )
        return null;
      })
      .then(gameSettings => {
        data.gameSettings = gameSettings;
      })
      // Then, fetch the player's data from hotutils
      .then(() => fetchProfile(cleanedAllyCode, useSession ? sessionId : null))
      .then(profile => {
        profile.sessionId = sessionId;
        data.profile = profile;
        return profile.characters;
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
        dispatch(updatePlayerData(cleanedAllyCode, data, db, keepOldMods && !(useSession && sessionId)))

        // Show the success and/or error messages
        dispatch(showFetchResult(data, messages, !!sessionId && useSession));
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
 * Fetch base character data from the swgoh.gg API
 * @returns {Promise<Array | string[]>}
 */
function fetchCharacters() {
  return fetch('https://api.mods-optimizer.swgoh.grandivory.com/characters/')
    .then(response => response.json())
    .then(response => {
      const gameSettings = response.units.map(unit => {
        const categories = unit.affiliation
          .concat(unit.profession)
          .concat(unit.role)
          .concat(unit.species)
          .concat(unit.other)
          .filter(Boolean) // Remove any null entries
          .map(category => category.display)
          .concat(unit.shipSlot ? ['Crew Member'] : []);

        return new GameSettings(
          unit.baseId,
          unit.name,
          unit.baseImage,
          categories,
          unit.description,
          unit.alignment
        );
      });

      return groupByKey(gameSettings, gs => gs.baseID)
    });
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

        // Collect the new character objects by combining the default characters with the player values
        // and the optimizer settings from the current profile.
        const newCharacters = mapObjectByKeyAndValue(fetchData.profile.characters, (id, playerValues) => {
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
 * @param {boolean} usedSession Whether a HotUtils session was used to pull unequipped mods
 */
function showFetchResult(fetchData, errorMessages, usedSession) {
  return function (dispatch) {
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
      <p key={111}>
        <strong className={'gold'}>Your mod data was pulled from HotUtils, and is completely up-to-date!</strong>
      </p>
    );
    fetchResults.push(
      <p key={121}>
        <strong className={'gold'}>You can fetch fresh mod data again immediately!</strong>
      </p>
    );

    if (!(usedSession)) {
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

    dispatch(changeOptimizerView('edit'));
    dispatch(showFlash(
      'Success!',
      <div className={'fetch-results'}>
        {fetchResults}
      </div>
    ));
  }
}

export function fetchCharacterList(mode, overwrite, allyCode, parameters) {
  return function (dispatch) {
    dispatch(setIsBusy(true))

    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/characterlist',
      {
        allyCode: allyCode,
        mode: mode,
        parameters: filterObject(parameters, (key, value) => !!value || value === 0)
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

export function setHotUtilsSessionId(allyCode, sessionId) {
  return function (dispatch) {
    const db = getDatabase();

    db.getProfile(
      allyCode,
      profile => {
        if (!profile) {
          // If there's no profile to put the Session ID into, then do a pull of data and pass in the session ID
          dispatch(refreshPlayerData(allyCode, false, sessionId, false));
        } else {
          const newProfile = profile.withHotUtilsSessionId(sessionId);
          db.saveProfile(
            newProfile,
            () => dispatch(setProfile(newProfile)),
            error => dispatch(showFlash(
              'Storage Error',
              'Error applying HotUtils session ID to your profile. Please try again.'
            ))
          )
        }
      },
      error => dispatch(showError(error.message))
    )
  };
}

/**
 * Fetch a player profile from the API
 * @param allyCode {string} The ally code to request
 * @returns {Promise<T | never>}
 */
function fetchProfile(allyCode, sessionId) {
  return post(
    'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2/',
    {
      'action': 'getprofile',
      'sessionId': sessionId,
      'payload': {
        'allyCode': allyCode,
      }
    }
  ).then(response => {
    if (response.errorMessage) {
      throw new Error(response.errorMessage);
    }

    const playerProfile = response.mods.profiles[0];

    // Convert mods to the serialized format recognized by the optimizer
    const profileMods = playerProfile.mods.map(Mod.fromHotUtils);

    // Convert each character to a PlayerValues object
    const profileCharacters = playerProfile.characters.reduce((characters, character) => {
      characters[character.baseId] = PlayerValues.fromHotUtils(character);
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

export function fetchHotUtilsStatus(allyCode) {
  const cleanedAllyCode = cleanAllyCode(allyCode);

  return function (dispatch) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'checksubscription',
        'payload': {
          'allyCode': cleanedAllyCode
        }
      }
    )
      // access codes: 0 = no subscription, 1 = subscription, but no connection, 2 = active subscription
      .then(response => dispatch(setHotUtilsSubscription(!!response.access)))
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
}

export function createHotUtilsProfile(profile, sessionId) {
  return function (dispatch) {
    dispatch(setIsBusy(true));
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'createprofile',
        'sessionId': sessionId,
        'payload': profile
      }
    )
      .then(response => {
        if (response.errorMessage) {
          dispatch(hideModal());
          dispatch(showError(response.errorMessage));
        } else {
          switch (response.responseCode) {
            case 0:
              dispatch(showError(response.responseMessage));
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

var modMoveActive = false;

export function moveModsWithHotUtils(profile, sessionId) {
  return function (dispatch) {
    dispatch(setIsBusy(true));
    return post('https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'movemods',
        'sessionId': sessionId,
        'payload': profile
      }
    )
      .then(response => {
        dispatch(setIsBusy(false));
        if (response.errorMessage) {
          dispatch(hideModal());
          dispatch(showError(response.errorMessage));
        } else {
          switch (response.responseCode) {
            case 0:
              dispatch(hideModal());
              dispatch(showError(response.responseMessage));
              break;
            default:
              if (response.taskId === 0) {
                dispatch(hideModal());
                dispatch(showFlash(
                  "No Action Taken",
                  "There were no mods to move!"
                ))
              } else {
                modMoveActive = true;
                // Show the progress modal
                dispatch(showModal(
                  'mod-move-progress',
                  modProgressModal(response.taskId, sessionId, 0, dispatch)
                ));
                // Start polling for udpates
                return pollForModMoveStatus(response.taskId, sessionId, dispatch);
              }
              break;
          }
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

function pollForModMoveStatus(taskId, sessionId, dispatch) {
  return new Promise((resolve, reject) => {
    post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'checkmovestatus',
        'sessionId': sessionId,
        'payload': {
          'taskId': taskId
        }
      }
    ).then(response => {
      if (response.errorMessage) {
        reject(new Error(response.errorMessage))
      } else {
        switch (response.responseCode) {
          case 0:
            reject(new Error(response.responseMessage));
            break;
          default:
            if (!response.running) {
              modMoveActive = false;
              const updatedMods = response.mods.profiles[0].mods.map(Mod.fromHotUtils);
              dispatch(updateProfile(profile => profile.withMods(updatedMods)));

              dispatch(hideModal());
              if (response.progress.index === response.progress.count) {
                dispatch(showFlash(
                  'Mods successfully moved',
                  'Your mods have been moved. You may log into Galaxy of Heroes to see your characters.'
                ));
              } else {
                dispatch(showFlash(
                  'Mod move cancelled',
                  'Your mod move has been cancelled. ' + response.progress.index + ' characters have already been updated.'
                ));
              }
            } else {
              // Update the modal
              if (modMoveActive) {
                const progress = 100 * response.progress.index / response.progress.count;
                dispatch(showModal(
                  'mod-move-progress',
                  modProgressModal(taskId, sessionId, progress, dispatch)
                ))
              }
              // If the move is still ongoing, then poll again after a few seconds.
              setTimeout(
                () => resolve(pollForModMoveStatus(taskId, sessionId, dispatch)),
                2000
              );
            }
            break;
        }
      }
    }).catch(error => reject(error))
  });
}

function cancelModMove(taskId, sessionId) {
  return function (dispatch) {
    return post(
      'https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2',
      {
        'action': 'cancelmove',
        'sessionId': sessionId,
        'payload': {
          'taskId': taskId
        }
      }
    )
      .then(response => {
        if (response.errorMessage) {
          dispatch(hideModal());
          dispatch(showError(response.errorMessage));
        } else {
          switch (response.responseCode) {
            case 0:
              dispatch(hideModal());
              dispatch(showError(response.responseMessage));
              break;
            default:
              modMoveActive = false;
              dispatch(showModal(
                'cancel-mod-move',
                modCancelModal()
              ))
            // Any other functionality around cancellation will happen on the next response from `pollForModMoveStatus`
          }
        }
      })
      .catch(error => {
        dispatch(showError(error.message));
      })
  }
}

function modProgressModal(taskId, sessionId, progress, dispatch) {
  return <div>
    <h3>Moving Your Mods...</h3>
    <div className={'progress'}>
      <span className={'progress-bar'} id={'progress-bar'} style={{ width: `${progress}%` }} />
    </div>
    <div className={'actions'}>
      <button type={'button'} className={'red'} onClick={() => dispatch(cancelModMove(taskId, sessionId))}>Cancel</button>
    </div>
  </div>;
}

function modCancelModal() {
  return <div>
    <h3>Moving Your Mods...</h3>
    <div className={'canceling'}>
      <p><strong className={'red-text'}>Cancelling...</strong></p>
    </div>
    <div className={'actions'}>
      <button type={'button'} className={'red'} disabled={true}>Cancel</button>
    </div>
  </div>;
}
