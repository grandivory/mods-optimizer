// @flow

import {updateCurrentProfile} from "./modsOptimizer";

export function optimizeMods(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

export function finishOptimizeMods(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withModAssignments(action.result),
    {
      isBusy: false,
      optimizerView: 'sets'
    }
  );
}
