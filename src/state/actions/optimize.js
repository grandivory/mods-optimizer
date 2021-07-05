// @flow

import { hideModal, setIsBusy, showError, showFlash, updateProfile } from "./app";
import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import getDatabase from "../storage/Database";
import { changeOptimizerView, updateModListFilter } from "./review";
import Character from "../../domain/Character";
import nothing from "../../utils/nothing";

export const OPTIMIZE_MODS = 'OPTIMIZE_MODS';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const CANCEL_OPTIMIZE_MODS = 'CANCEL_OPTIMIZE_MODS';
export const FINISH_OPTIMIZE_MODS = 'FINISH_OPTIMIZE_MODS';

export function startModOptimization() {
  return {
    type: OPTIMIZE_MODS
  };
}

export function updateProgress(progress) {
  return {
    type: UPDATE_PROGRESS,
    progress: progress
  }
}

/**
 * Take the results of the mod optimization and apply them to the current profile
 * @param result {Object} The result from the optimizer
 * @param settings {OptimizerRun} The previous settings that were used to get this result
 * @returns {*}
 */
export function finishModOptimization(result, settings) {

  return updateProfile(
    profile => profile.withModAssignments(result),
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
      dispatch(updateProgress({}));

      // If this was an incremental optimization, leave the user on their current page
      if (newProfile.incrementalOptimizeIndex !== null) {
        return;
      }

      dispatch(updateModListFilter({
        view: 'sets',
        sort: 'assignedCharacter'
      }));
      dispatch(changeOptimizerView('review'));
      dispatch(hideModal());

      // Create the content of the pop-up for any post-optimization messages

      const resultsWithMessages = result
        .filter(x => null !== x)
        .filter(({ messages, missedGoals }) => 0 < messages.length || 0 < missedGoals.length);

      if (resultsWithMessages.length) {
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
                {resultsWithMessages.map(({ id, target, messages, missedGoals }, index) => {
                  const character = newProfile.characters[id] || new Character(id);
                  return <tr key={index}>
                    <td><CharacterAvatar character={character} /><br />
                      {state.gameSettings[id] ? state.gameSettings[id].name : id}
                    </td>
                    <td>
                      <h4>{target.name}:</h4>
                      <ul>
                        {messages.map((message, index) => <li key={index}>{message}</li>)}
                      </ul>
                      <ul className={'missed-goals'}>
                        {missedGoals.map(([missedGoal, value], index) =>
                          <li key={index}>
                            {`Missed goal stat for ${missedGoal.stat}. Value of ${value % 1 ? value.toFixed(2) : value} was not between ${missedGoal.minimum} and ${missedGoal.maximum}.`}
                          </li>
                        )}
                      </ul>
                    </td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        ));
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
  return function (dispatch, getState) {
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

    optimizationWorker.onmessage = function (message) {
      switch (message.data.type) {
        case 'OptimizationSuccess':
          dispatch(setIsBusy(false));
          dispatch(updateProgress({
            character: null,
            step: 'Rendering your results',
            progress: 100
          }));
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
          dispatch(setIsBusy(false));
          dispatch(updateProgress(message.data));
          break;
        default: // Do nothing
      }
    };

    optimizationWorker.onerror = function (error) {
      console.log(error);
      optimizationWorker.terminate();
      dispatch(hideModal());
      dispatch(setIsBusy(false));
      dispatch(showError(error.message));
    };

    optimizationWorker.postMessage(profile.allyCode);
  };
}

export function cancelOptimizer() {
  return function (dispatch) {
    optimizationWorker.terminate();
    dispatch(updateProgress({}));
  }
}
