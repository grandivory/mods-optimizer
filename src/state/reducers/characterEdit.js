// @flow
import {mapObject} from "../../utils/mapObject";
import {updateCurrentProfile} from "./modsOptimizer";

export function selectCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldSelectedCharacters = profile.selectedCharacters;
    if (oldSelectedCharacters.includes(action.characterID)) {
      // If the character is already in the list, remove it
      oldSelectedCharacters.splice(oldSelectedCharacters.indexOf(action.characterID), 1);
    }

    if (!action.prevCharacterID || !profile.selectedCharacters.includes(action.prevCharacterID)) {
      return profile.withSelectedCharacters(oldSelectedCharacters.concat([action.characterID]));
    } else {
      const newSelectedCharacters = oldSelectedCharacters.slice();
      newSelectedCharacters.splice(newSelectedCharacters.indexOf(action.prevCharacterID) + 1, 0, action.characterID);

      return profile.withSelectedCharacters(newSelectedCharacters);
    }
  });
}

export function unselectCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const newSelectedCharacters = profile.selectedCharacters.slice();
    const oldCharacter = profile.characters[action.characterID];

    if (newSelectedCharacters.includes(action.characterID)) {
      newSelectedCharacters.splice(newSelectedCharacters.indexOf(action.characterID), 1);
    }

    return profile.withSelectedCharacters(newSelectedCharacters)
    // If we unselect a character, we also need to unlock it
      .withCharacters(Object.assign({}, profile.characters, {
        [action.characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock())
      }));
  });
}

export function unselectAllCharacters(state, action) {
  return updateCurrentProfile(state, profile =>
    profile.withCharacters(
      mapObject(
        profile.characters,
        character => character.withOptimizerSettings(character.optimizerSettings.unlock())
      )
    ).withSelectedCharacters([])
    );
}

export function lockCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID]
    const newCharacters = Object.assign({}, profile.characters, {
      [action.characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.lock())
    });

    return profile.withCharacters(newCharacters);
  });
}

export function unlockCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID]
    const newCharacters = Object.assign({}, profile.characters, {
      [action.characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock())
    });

    return profile.withCharacters(newCharacters);
  });
}

export function changeCharacterTarget(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [action.characterID]:
        oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock().withTarget(action.target))
    }));
  });
}

export function changeCharacterEditMode(state, action) {
  return Object.assign({}, state, {
    characterEditMode: action.mode
  });
}

export function finishEditCharacterTarget(state, action) {
  const profile = state.profiles[state.allyCode];
  const oldCharacter = profile.characters[action.characterID];

  const newCharacter = oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withTarget(action.target));

  return Object.assign({}, state, {
    modal: null,
    profiles: Object.assign({}, state.profiles, {
      [state.allyCode]: profile.withCharacters(Object.assign({}, profile.characters, {
        [newCharacter.baseID]: newCharacter
      }))
    })
  });
}

export function resetCharacterTargetToDefault(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withCharacters(Object.assign({}, profile.characters, {
      [action.characterID]: profile.characters[action.characterID].withResetTarget()
    })),
    {modal: null}
  );
}

export function resetAllCharacterTargets(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withCharacters(mapObject(profile.characters, character => character.withResetTargets())),
    {modal: null}
  );
}

export function deleteTarget(state, action) {
  return updateCurrentProfile(
    state,
    profile => {
      const oldCharacter = profile.characters[action.characterID];

      return profile.withCharacters(Object.assign({}, profile.characters, {
        [action.characterID]: oldCharacter.withDeletedTarget()
      }));
    },
    {modal: null}
  );
}

export function changeUse5DotMods(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [action.characterID]:
        oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withOnly5DotMods(action.use5DotMods))
    }));
  });
}

export function changeCharacterFilter(state, action) {
  return Object.assign({}, state, {
    characterFilter: action.filter
  });
}
