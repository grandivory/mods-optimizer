// @flow

import {hideModal, showError, showModal} from "./app";
import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

export const OPTIMIZE_MODS = 'OPTIMIZE_MODS';
export const CANCEL_OPTIMIZE_MODS = 'CANCEL_OPTIMIZE_MODS';
export const UPDATE_OPTIMIZER_PROGRESS = 'UPDATE_OPTIMIZER_PROGRESS';
export const FINISH_OPTIMIZE_MODS = 'FINISH_OPTIMIZE_MODS';

export function startModOptimization() {
  return {
    type: OPTIMIZE_MODS
  };
}

export function finishModOptimization(result) {
  return {
    type: FINISH_OPTIMIZE_MODS,
    result: result
  };
}

export function updateOptimizerProgress(character, step, progress) {
  return {
    type: UPDATE_OPTIMIZER_PROGRESS,
    character: character,
    step: step,
    progress: progress
  };
}

export function cancelOptimizeMods() {
  return {
    type: CANCEL_OPTIMIZE_MODS
  };
}

let optimizationWorker = null;

/**
 * Run the optimization algorithm and update the player's profile with the results
 * @param mods Array[Mod]
 * @param characters {Character.baseID => Character}
 * @param order Array[Character.baseID]
 * @param threshold {Number}
 */
export function optimizeMods(mods, characters, order, threshold) {
  return function(dispatch) {
    // If any of the characters being optimized don't have stats, then show an error message
    if (Object.values(characters)
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
            optimizerProgressModal(null, 'Rendering results', 100, dispatch)
          ));
          // Set a timeout so the modal has time to display
          setTimeout(() => dispatch(finishModOptimization(message.data.result)), 0);
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

    optimizationWorker.postMessage({
      mods: mods,
      characters: characters,
      order: order,
      threshold: threshold
    });
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
