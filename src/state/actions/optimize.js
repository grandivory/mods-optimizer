// @flow

import Optimizer from "../../utils/Optimizer";

export const OPTIMIZE_MODS = 'OPTIMIZE_MODS';
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

/**
 * Run the optimization algorithm and update the player's profile with the results
 * @param mods Array[Mod]
 * @param characters {Character.baseID => Character}
 * @param order Array[Character.baseID]
 */
export function optimizeMods(mods, characters, order) {
  return function(dispatch) {
    dispatch(startModOptimization());
    const optimize = new Promise((resolve) => {
      setTimeout(() => resolve((new Optimizer()).optimizeMods(mods, characters, order)), 0);
    });

    optimize.then(result => dispatch(finishModOptimization(result)));
  };
}
