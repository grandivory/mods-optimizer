// @flow

import {
  CHANGE_CHARACTER_FILTER,
  CHANGE_CHARACTER_TARGET,
  CHANGE_MOD_SET_FILTER, CHANGE_MODLIST_FILTER, CHANGE_MODS_FILTER,
  CHANGE_OPTIMIZER_VIEW,
  CHANGE_SECTION,
  CHANGE_USE_FIVE_DOT_MODS,
  DELETE_TARGET,
  FINISH_EDIT_CHARACTER_TARGET,
  FINISH_OPTIMIZE_MODS,
  HIDE_ERROR,
  HIDE_MODAL,
  LOCK_CHARACTER,
  LOG,
  OPTIMIZE_MODS,
  REASSIGN_MOD, REASSIGN_MODS,
  RECEIVE_CHARACTERS,
  RECEIVE_PROFILE,
  RECEIVE_STATS,
  REQUEST_CHARACTERS,
  REQUEST_PROFILE,
  REQUEST_STATS,
  RESET,
  RESET_ALL_CHARACTER_TARGETS,
  RESET_CHARACTER_TARGET_TO_DEFAULT,
  RESTORE_PROGRESS,
  SELECT_CHARACTER,
  SET_MODS,
  SHOW_ERROR,
  SHOW_MODAL,
  TOGGLE_KEEP_OLD_MODS,
  UNEQUIP_MOD, UNEQUIP_MODS,
  UNLOCK_CHARACTER,
  UNSELECT_CHARACTER
} from "./actions";
import {defaultState, deserializeState, restoreState, saveState} from "./storage";
import {mapObject, mapObjectByKeyAndValue} from "../utils/mapObject";
import characterSettings from "../constants/characterSettings";
import Character from "../domain/Character";
import {GameSettings, OptimizerSettings} from "../domain/CharacterDataClasses";
import Mod from "../domain/Mod";
import PlayerProfile from "../domain/PlayerProfile";
import CharacterStats, {NullCharacterStats} from "../domain/CharacterStats";
import groupByKey from "../utils/groupByKey";

/**
 * Update the currently-selected character profile by calling an update function on the existing profile. Optionally
 * update the base state with other auxiliary changes as well.
 * @param state
 * @param updateFunc Function PlayerProfile => PlayerProfile
 * @param auxiliaryChanges object
 * @returns {*}
 */
function updateCurrentProfile(state, updateFunc, auxiliaryChanges = {}) {
  const profile = state.profiles[state.allyCode];

  return Object.assign({}, state, auxiliaryChanges, {
    profiles: Object.assign({}, state.profiles, {
      [state.allyCode]: updateFunc(profile)
    })
  });
}

function changeSection(state, action) {
  return Object.assign({}, state, {
    section: action.section
  });
}

function changeOptimizerView(state, action) {
  return Object.assign({}, state, {
    optimizerView: action.view
  });
}

function requestCharacters(state, action) {
  // First, update all existing characters with their current default settings
  // Then, set the app to busy so that it can fetch the new character data
  return Object.assign({}, state, {
      characters: mapObject(
        state.characters,
        character => character.withDefaultSettings(characterSettings[character.baseID])
      )
    },
    {isBusy: true}
  );
}

/**
 * Update the set of known characters in the state (independent of any one profile) with data from swgoh.gg
 * @param state
 * @param action
 * @returns {*}
 */
function receiveCharacters(state, action) {
  if (!action.characters) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

  let newCharacters = {};

  action.characters.forEach(character => {
    const gameSettings = new GameSettings(
      character.name,
      character.image,
      character.categories.concat([character.alignment, character.role]),
      character.description
    );

    if (state.characters.hasOwnProperty(character.base_id)) {
      newCharacters[character.base_id] = state.characters[character.base_id].withGameSettings(gameSettings);
    } else {
      newCharacters[character.base_id] = Character.default(character.base_id).withGameSettings(gameSettings);
    }
  });

  return Object.assign({}, state, {
    isBusy: false,
    characters: newCharacters
  })
}

function requestProfile(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

/**
 * Update the profile for a particular ally code with new mod and character data
 * @param state
 * @param action
 */
function receiveProfile(state, action) {
  if (!action.profile || !action.profile.characters) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

  // First, update the characters by combining the PlayerValues objects in the action
  // with the base characters in the state
  const newCharacters = mapObjectByKeyAndValue(action.profile.characters, (id, playerValues) => {
    const character = state.characters.hasOwnProperty(id) ?
      state.characters[id].withPlayerValues(playerValues) :
      Character.default(id).withPlayerValues(playerValues);

    // When a profile is updated, make sure that the character has optimizer settings so that the optimizer can actually
    // work with it. If nothing has been set yet, then set reasonable defaults.
    if (character.optimizerSettings) {
      return character;
    } else {
      return character.withOptimizerSettings(new OptimizerSettings(
        character.defaultSettings.targets[0],
        [],
        character.defaultSettings.extraTags.includes('Crew Member'),
        false
      ));
    }
  });

  // Then, update the mods by deserializing each one
  const newMods = groupByKey(action.profile.mods, mod => mod.id);

  const oldProfile = state.profiles.hasOwnProperty(action.allyCode) ?
    state.profiles[action.allyCode] :
    new PlayerProfile();

  let finalMods;

  if (state.keepOldMods) {
    const oldMods = oldProfile.mods.reduce((mods, mod) => {
      mods[mod.id] = mod.unequip();
      return mods;
    }, {});

    finalMods = Object.values(Object.assign({}, oldMods, newMods));
  } else {
    finalMods = Object.values(newMods);
  }

  const newProfile = oldProfile.withCharacters(newCharacters).withMods(finalMods);

  return Object.assign({}, state, {
    isBusy: false,
    allyCode: action.allyCode,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: newProfile
    })
  });
}

function requestStats(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

/**
 * Update all of the characters for a profile with new base and equipped stats
 * @param state
 * @param action
 */
function receiveStats(state, action) {
  if (!action.stats) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

  const profile = state.profiles[action.allyCode];

  const newProfile = profile.withCharacters(
    action.stats.reduce((characters, statObject) => {
      const character = profile.characters[statObject.unit.defId];

      const baseStats = statObject.stats.base ?
        new CharacterStats(
          statObject.stats.base['Health'] || 0,
          statObject.stats.base['Protection'] || 0,
          statObject.stats.base['Speed'] || 0,
          statObject.stats.base['Potency'] || 0,
          statObject.stats.base['Tenacity'] || 0,
          statObject.stats.base['Physical Damage'] || 0,
          statObject.stats.base['Physical Critical Rating'] || 0,
          statObject.stats.base['Armor'] || 0,
          statObject.stats.base['Special Damage'] || 0,
          statObject.stats.base['Special Critical Rating'] || 0,
          statObject.stats.base['Resistance'] || 0
        ) :
        NullCharacterStats;

      let equippedStats = NullCharacterStats;

      if (statObject.stats.gear) {
        const gearStats = new CharacterStats(
          statObject.stats.gear['Health'] || 0,
          statObject.stats.gear['Protection'] || 0,
          statObject.stats.gear['Speed'] || 0,
          statObject.stats.gear['Potency'] || 0,
          statObject.stats.gear['Tenacity'] || 0,
          statObject.stats.gear['Physical Damage'] || 0,
          statObject.stats.gear['Physical Critical Rating'] || 0,
          statObject.stats.gear['Armor'] || 0,
          statObject.stats.gear['Special Damage'] || 0,
          statObject.stats.gear['Special Critical Rating'] || 0,
          statObject.stats.gear['Resistance'] || 0
        );
        equippedStats = baseStats.plus(gearStats);
      }

      characters[statObject.unit.defId] =
        character.withPlayerValues(character.playerValues.withBaseStats(baseStats).withEquippedStats(equippedStats));

      return characters;
    }, {})
  );

  const errorCharacters = Object.keys(profile.characters).filter(charID =>
    !Object.keys(newProfile.characters).includes(charID)
  ).map(charID => profile[charID].name);

  const errorMessage = errorCharacters.length > 0 ?
    'Missing stats for characters: ' + errorCharacters.join(', ') +
    '. These characters may not optimize properly.'
    : null;

  return Object.assign({}, state, {
    allyCode: action.allyCode,
    error: errorMessage,
    isBusy: false,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: newProfile
    })
  });
}

function showModal(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    modal: {
      class: action.class,
      content: action.content
    }
  });
}

function hideModal(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    modal: null
  });
}

function showError(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    error: action.content
  });
}

function hideError(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    error: null
  });
}

function reset(state, action) {
  return Object.assign({}, defaultState);
}

function toggleKeepOldMods(state, action) {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}

function restoreProgress(state, action) {
  try {
    return deserializeState(action.progressData);
  } catch (e) {
    return Object.assign({}, state, {
      error:
        'Unable to restore your progress from the provided file. Please make sure that you uploaded the correct file.'
    });
  }
}

function setMods(state, action) {
  try {
    if (!state.allyCode) {
      return Object.assign({}, state, {
        error: 'You must fetch your data before overriding your mods.'
      });
    }

    const modsData = JSON.parse(action.modsData);
    return updateCurrentProfile(state, profile => {
      const newMods = groupByKey(
        modsData.map(mod => Mod.deserializeVersionOneTwo(mod, profile.characters)),
        mod => mod.id
      );

      let finalMods;

      if (state.keepOldMods) {
        const oldMods = profile.mods.reduce((mods, mod) => {
          mods[mod.id] = mod.unequip();
          return mods;
        }, {});

        finalMods = Object.values(Object.assign({}, oldMods, newMods));
      } else {
        finalMods = Object.values(newMods);
      }

      return Object.assign({}, profile, {mods: finalMods});
    });
  } catch (e) {
    return Object.assign({}, state, {
      error: 'Unable to set your mods from the provided file. Please make sure that you uploaded the correct file.'
    })
  }
}

function selectCharacter(state, action) {
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

function unselectCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const newSelectedCharacters = profile.selectedCharacters.slice();

    if (newSelectedCharacters.includes(action.characterID)) {
      newSelectedCharacters.splice(newSelectedCharacters.indexOf(action.characterID), 1);
    }

    return profile.withSelectedCharacters(newSelectedCharacters);
  });
}

function lockCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID]
    const newCharacters = Object.assign({}, profile.characters, {
      [action.characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.lock())
    });

    return profile.withCharacters(newCharacters);
  });
}

function unlockCharacter(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID]
    const newCharacters = Object.assign({}, profile.characters, {
      [action.characterID]: oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock())
    });

    return profile.withCharacters(newCharacters);
  });
}

function changeCharacterTarget(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [action.characterID]:
        oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.unlock().withTarget(action.target))
    }));
  });
}

function finishEditCharacterTarget(state, action) {
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

function resetCharacterTargetToDefault(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withCharacters(Object.assign({}, profile.characters, {
      [action.characterID]: profile.characters[action.characterID].withResetTarget()
    })),
    {modal: null}
  );
}

function resetAllCharacterTargets(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withCharacters(mapObject(profile.characters, character => character.withResetTargets())),
    {modal: null}
  );
}

function deleteTarget(state, action) {
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

function changeUse5DotMods(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldCharacter = profile.characters[action.characterID];

    return profile.withCharacters(Object.assign({}, profile.characters, {
      [action.characterID]:
        oldCharacter.withOptimizerSettings(oldCharacter.optimizerSettings.withOnly5DotMods(action.use5DotMods))
    }));
  });
}

function changeCharacterFilter(state, action) {
  return Object.assign({}, state, {
    characterFilter: action.filter
  });
}

function optimizeMods(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

function finishOptimizeMods(state, action) {
  return updateCurrentProfile(
    state,
    profile => profile.withModAssignments(action.result),
    {
      isBusy: false,
      optimizerView: 'sets'
    }
  );
}

function changeModSetFilter(state, action) {
  return Object.assign({}, state, {
    modSetsFilter: action.filter
  });
}

function unequipMod(state, action) {
  return updateCurrentProfile(state, profile => {
    const mods = groupByKey(profile.mods, mod => mod.id);
    const oldMod = mods[action.mod];
    const newMod = oldMod ? oldMod.unequip() : null;

    return newMod ?
      profile.withMods(Object.values(Object.assign({}, mods, {
        [action.mod]: newMod
      }))) :
      profile;
  });
}

function reassignMod(state, action) {
  return updateCurrentProfile(state, profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMod = modsById[action.mod];
    const currentlyEquippedMod =
      profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === action.character);

    const newMods = Object.values(Object.assign(
      {},
      modsById,
      oldMod ? {[oldMod.id]: oldMod.equip(action.character)} : {},
      currentlyEquippedMod ? {[currentlyEquippedMod.id]: currentlyEquippedMod.unequip()} : {}
    ));

    return profile.withMods(newMods);
  });
}

function unequipMods(state, action) {
  return updateCurrentProfile(state, profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const modsUpdate = groupByKey(action.mods.map(modID => modsById[modID].unequip()), mod => mod.id);

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

function reassignMods(state, action) {
  return updateCurrentProfile(state, profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMods = action.mods.map(modID => modsById[modID]);
    const currentlyEquippedMods =
      oldMods.map(oldMod => profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === action.character))
        .filter(mod => mod);

    const modsUpdate = groupByKey(
      oldMods.map(mod => mod.equip(action.character)).concat(currentlyEquippedMods.map(mod => mod.unequip())),
      mod => mod.id
    );

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

function changeModListFilter(state, action) {
  return Object.assign({}, state, {
    modListFilter: action.filter
  });
}

function changeModsFilter(state, action) {
  return Object.assign({}, state, {
    modsFilter: action.filter
  });
}

export function optimizerApp(state, action) {
  if (null == state) {
    state = restoreState();
  }

  switch (action.type) {
    case CHANGE_SECTION:
      return saveState(changeSection(state, action));
    case CHANGE_OPTIMIZER_VIEW:
      return saveState(changeOptimizerView(state, action));
    case REQUEST_CHARACTERS:
      return requestCharacters(state, action);
    case RECEIVE_CHARACTERS:
      return saveState(receiveCharacters(state, action));
    case REQUEST_PROFILE:
      return requestProfile(state, action);
    case RECEIVE_PROFILE:
      return saveState(receiveProfile(state, action));
    case REQUEST_STATS:
      return requestStats(state, action);
    case RECEIVE_STATS:
      return saveState(receiveStats(state, action));
    case SHOW_MODAL:
      return showModal(state, action);
    case HIDE_MODAL:
      return hideModal(state, action);
    case SHOW_ERROR:
      return showError(state, action);
    case HIDE_ERROR:
      return hideError(state, action);
    case RESET:
      return saveState(reset(state, action));
    case TOGGLE_KEEP_OLD_MODS:
      return saveState(toggleKeepOldMods(state, action));
    case RESTORE_PROGRESS:
      return saveState(restoreProgress(state, action));
    case SET_MODS:
      return saveState(setMods(state, action));
    case SELECT_CHARACTER:
      return saveState(selectCharacter(state, action));
    case UNSELECT_CHARACTER:
      return saveState(unselectCharacter(state, action));
    case LOCK_CHARACTER:
      return saveState(lockCharacter(state, action));
    case UNLOCK_CHARACTER:
      return saveState(unlockCharacter(state, action));
    case CHANGE_CHARACTER_TARGET:
      return saveState(changeCharacterTarget(state, action));
    case FINISH_EDIT_CHARACTER_TARGET:
      return saveState(finishEditCharacterTarget(state, action));
    case RESET_CHARACTER_TARGET_TO_DEFAULT:
      return saveState(resetCharacterTargetToDefault(state, action));
    case RESET_ALL_CHARACTER_TARGETS:
      return saveState(resetAllCharacterTargets(state, action));
    case DELETE_TARGET:
      return saveState(deleteTarget(state, action));
    case CHANGE_USE_FIVE_DOT_MODS:
      return saveState(changeUse5DotMods(state, action));
    case CHANGE_CHARACTER_FILTER:
      return saveState(changeCharacterFilter(state, action));
    case CHANGE_MOD_SET_FILTER:
      return saveState(changeModSetFilter(state, action));
    case OPTIMIZE_MODS:
      return optimizeMods(state, action);
    case FINISH_OPTIMIZE_MODS:
      return saveState(finishOptimizeMods(state, action));
    case UNEQUIP_MOD:
      return saveState(unequipMod(state, action));
    case REASSIGN_MOD:
      return saveState(reassignMod(state, action));
    case UNEQUIP_MODS:
      return saveState(unequipMods(state, action));
    case REASSIGN_MODS:
      return saveState(reassignMods(state, action));
    case CHANGE_MODLIST_FILTER:
      return saveState(changeModListFilter(state, action));
    case CHANGE_MODS_FILTER:
      return saveState(changeModsFilter(state, action));
    case LOG:
      console.log(state);
      return Object.assign({}, state);
    default:
      console.log(action);
      return state;
  }
}
