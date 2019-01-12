// @flow

import {mapObject, mapObjectByKeyAndValue} from "../../utils/mapObject";
import characterSettings from "../../constants/characterSettings";
import {GameSettings, OptimizerSettings} from "../../domain/CharacterDataClasses";
import Character from "../../domain/Character";
import groupByKey from "../../utils/groupByKey";
import PlayerProfile from "../../domain/PlayerProfile";
import CharacterStats, {NullCharacterStats} from "../../domain/CharacterStats";
import Mod from "../../domain/Mod";
import {updateCurrentProfile} from "./modsOptimizer";
import OptimizationPlan from "../../domain/OptimizationPlan";
import React from "react";

export function toggleKeepOldMods(state, action) {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}

export function requestCharacters(state, action) {
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
export function receiveCharacters(state, action) {
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
      character.categories
        .concat([character.alignment, character.role])
        .concat(character.ship_slot ? ['Crew Member'] : []),
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

export function requestProfile(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

/**
 * Update the profile for a particular ally code with new mod and character data
 * @param state
 * @param action
 */
export function receiveProfile(state, action) {
  if (!action.profile || !action.profile.characters) {
    return Object.assign({}, state, {
      isBusy: false
    });
  }

  const profile = state.profiles[action.allyCode] || new PlayerProfile();

  // Collect the new character objects by combining the default characters with the player values from the action
  // and the optimizer settings from the current profile.
  const newCharacters = mapObjectByKeyAndValue(action.profile.characters, (id, playerValues) => {
    const character = state.characters.hasOwnProperty(id) ?
      state.characters[id].withPlayerValues(playerValues) :
      Character.default(id).withPlayerValues(playerValues);

    if (profile.characters.hasOwnProperty(id)) {
      return character.withOptimizerSettings(profile.characters[id].optimizerSettings);
    } else {
      // If there are no optimizer settings for this character yet, then set reasonable defaults
      return character.withOptimizerSettings(new OptimizerSettings(
        character.defaultSettings.targets[0] || new OptimizationPlan(),
        [],
        character.defaultSettings.extraTags.includes('Crew Member') ? 5 : 1,
        false,
        false
      ));
    }
  });

  // Then, update the mods by deserializing each one
  const newMods = groupByKey(action.profile.mods, mod => mod.id);

  // If "Remember Existing Mods" is selected, then only overwrite the mods we see in this profile
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

  const newProfile = profile.withCharacters(newCharacters).withMods(finalMods);
  const lastUpdate = new Date(action.profile.updated);
  const nextUpdate = new Date(lastUpdate.getTime() + 60 * 60 * 1000); // plus one hour

  return Object.assign({}, state, {
    isBusy: false,
    allyCode: action.allyCode,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: newProfile
    }),
    optimizerView: 'edit',
    flashMessage: {
      heading: 'Success!',
      content: [
        <p key={0}>
          Successfully pulled data for <span className={'gold'}>{Object.keys(action.profile.characters).length}
          </span> characters and <span className={'gold'}>{action.profile.mods.length}</span> mods.</p>,
        <p key={1}>Your data was last updated as of <span className={'gold'}>{lastUpdate.toLocaleString()}</span>.</p>,
        <p key={2}>You should be able to fetch fresh data any time after <span className={'gold'}>
          {nextUpdate.toLocaleString()}</span>
        </p>,
        <hr key={3} />,
        <h3 key={4}><strong>
          Remember: The optimizer can only pull data for mods that you currently have equipped!
        </strong></h3>,
        <p key={5}>
          If it looks like you're missing mods, try equipping them on your characters and fetching data again after the
          time listed above.
        </p>,
        ]
    }
  });
}

export function requestStats(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

/**
 * Update all of the characters for a profile with new base and equipped stats
 * @param state
 * @param action
 */
export function receiveStats(state, action) {
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
    !Object.keys(newProfile.characters).includes(charID) ||
    newProfile.characters[charID].playerValues.baseStats === NullCharacterStats
  ).map(charID => state.characters[charID].gameSettings.name);

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

export function setMods(state, action) {
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
