// @flow

import {updateCurrentProfile} from "./modsOptimizer";
import React from "react";
import {mapObjectByKeyAndValue} from "../../utils/mapObject";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import Character from "../../domain/Character";

export function optimizeMods(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

export function finishOptimizeMods(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withModAssignments(action.result.assignedSets),
    {
      isBusy: false,
      optimizerView: 'sets',
      modal: null,
      flashMessage: Object.keys(action.result.messages).length > 0 ?
        {
          heading: '',
          content: <div className={'optimizer-messages'}>
            <h3>Important messages regarding your selected targets</h3>
            <table>
              <thead>
              <tr>
                <th>Character</th>
                <th>Messages</th>
              </tr>
              </thead>
              <tbody>
              {Object.values(mapObjectByKeyAndValue(action.result.messages, (characterID, messages) => {
                const character = state.profiles[state.allyCode].characters[characterID] ||
                  Character.default(characterID);
                return <tr key={characterID}>
                  <td><CharacterAvatar character={character}/><br />{character.gameSettings.name}</td>
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
        } : null
    }
  );
}

export function cancelOptimizeMods(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    flashMessage: null,
    modal: null
  });
}

export function updateOptimizerProgress(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    optimizerProgress: {
      character: action.character,
      step: action.step,
      progress: action.progress
    }
  });
}
