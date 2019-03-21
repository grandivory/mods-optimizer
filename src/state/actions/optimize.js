// @flow

import {hideModal, setIsBusy, showError, showFlash, showModal, updateProfile} from "./app";
import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import getDatabase from "../storage/Database";
import {changeOptimizerView} from "./review";
import {mapObjectByKeyAndValue} from "../../utils/mapObject";
import Character from "../../domain/Character";
import nothing from "../../utils/nothing";

export const OPTIMIZE_MODS = 'OPTIMIZE_MODS';
export const CANCEL_OPTIMIZE_MODS = 'CANCEL_OPTIMIZE_MODS';
export const FINISH_OPTIMIZE_MODS = 'FINISH_OPTIMIZE_MODS';

export function startModOptimization() {
  return {
    type: OPTIMIZE_MODS
  };
}

/**
 * Take the results of the mod optimization and apply them to the current profile
 * @param result {Object} The result from the optimizer
 * @param settings {OptimizerRun} The previous settings that were used to get this result
 * @returns {*}
 */
export function finishModOptimization(result, settings) {
  return updateProfile(
    profile => {
      const newAssignments = {};
      // Go through the previous mod assignments until one is found in the new result.
      // Anything above that won't have changed
      for (let character of settings.selectedCharacters) {
        if (result.assignedSets[character]) {
          newAssignments[character] = result.assignedSets[character];
        } else {
          newAssignments[character] = profile.modAssignments[character];
        }
      }

      return profile.withModAssignments(newAssignments);
    },
    (dispatch, getState, newProfile) => {
      const db = getDatabase();
      db.saveLastRun(
        settings,
        nothing,
        error => dispatch(showFlash(
          'Storage Error',
          'Error saving your last run to the database: ' +
          error.message +
          ' The optimizer may not recalculate correctly on your next optimization'
        ))
      );

      dispatch(setIsBusy(false));
      dispatch(changeOptimizerView('sets'));
      dispatch(hideModal());
      if (result.messages.length) {
        const state = getState();
        dispatch(showFlash(
          '',
          <div className={'optimizer-messages'}>
            <h3>Important messages regarding your selected targets</h3>
            <table>
              <thead>
              <tr>
                <th>Character</th>
                <th>Messages</th>
              </tr>
              </thead>
              <tbody>
              {Object.values(mapObjectByKeyAndValue(result.messages, (characterID, messages) => {
                const character = newProfile.characters[characterID] || new Character(characterID);
                return <tr key={characterID}>
                  <td><CharacterAvatar character={character}/><br />
                    {state.gameSettings[character.baseID] ? state.gameSettings[character.baseID].name : character.baseID}
                  </td>
                  <td>
                    <ul>
                      {messages.map((message, index) => <li key={index}>{message}</li>)}
                    </ul>
                  </td>
                </tr>;
              }))}
              </tbody>
            </table>
          </div>
        ))
      }
    }
  );
}

export function cancelOptimizeMods() {
  return {
    type: CANCEL_OPTIMIZE_MODS
  };
}

let optimizationWorker = null;

/**
 * Run the optimization algorithm and update the player's profile with the results
 * @param allyCode {string} The player to optimize mods for
 */
export function optimizeMods() {
  return function(dispatch, getState) {
    const profile = getState().profile;
    // If any of the characters being optimized don't have stats, then show an error message
    if (Object.values(profile.characters)
      .filter(char => null === char.playerValues.baseStats || null === char.playerValues.equippedStats)
      .length > 0
    ) {
      dispatch(showError('Missing character data required to optimize. Try fetching your data and trying again.'));
      return;
    }

    dispatch(startModOptimization());
    optimizationWorker =
      new Worker(`/workers/optimizer.js?version=${process.env.REACT_APP_VERSION || 'local'}`);

    optimizationWorker.onmessage = function(message) {
      switch (message.data.type) {
        case 'OptimizationSuccess':
          dispatch(showModal(
            'optimizer-progress',
            optimizerProgressModal(null, 'Rendering your results', 100, dispatch)
          ));
          // Set a timeout so the modal has time to display
          setTimeout(
            () =>
              dispatch(finishModOptimization(
                message.data.result,
                profile.toOptimizerRun()
              )),
            0
          );
          break;
        case 'Progress':
          dispatch(showModal(
            'optimizer-progress',
            optimizerProgressModal(message.data.character, message.data.step, message.data.progress, dispatch),
            false
          ));
          break;
        default: // Do nothing
      }
    };

    optimizationWorker.onerror = function(error) {
      console.log(error);
      optimizationWorker.terminate();
      dispatch(hideModal());
      dispatch(showError(error.message));
    };

    optimizationWorker.postMessage(profile.allyCode);
  };
}

/**
 * Renders a modal showing the progress of the optimization
 * @param character {Character}
 * @param step {string}
 * @param progress {number} The progress percent to show, from 0 to 100
 * @param dispatch {function} The dispatch function for Redux
 * @returns {*}
 */
function optimizerProgressModal(character, step, progress, dispatch) {
  return <div>
    <h3>Optimizing Your Mods...</h3>
    <div className={'progressBox'}>
      {character &&
      <div className={'character'}><CharacterAvatar character={character}/></div>
      }
      <div className={'step'}>{step}</div>
      <div className={'progress'}>
        <span className={'progress-bar'} id={'progress-bar'} style={{width: `${progress}%`}}/>
      </div>
    </div>
    <div className={'actions'}>
      <button type={'button'} className={'red'} onClick={() => dispatch(cancelOptimizer())}>Cancel</button>
    </div>
  </div>;
}

export function cancelOptimizer() {
  return function(dispatch) {
    optimizationWorker.terminate();
    dispatch(cancelOptimizeMods());
  };
}
