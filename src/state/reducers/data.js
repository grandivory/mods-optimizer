// @flow

import {mapObjectByKeyAndValue} from "../../utils/mapObject";
import characterSettings from "../../constants/characterSettings";
import {GameSettings, OptimizerSettings} from "../../domain/CharacterDataClasses";
import Character from "../../domain/Character";
import groupByKey from "../../utils/groupByKey";
import PlayerProfile from "../../domain/PlayerProfile";
import CharacterStats, {NullCharacterStats} from "../../domain/CharacterStats";
import OptimizationPlan from "../../domain/OptimizationPlan";
import React from "react";

export function toggleKeepOldMods(state, action) {
  return Object.assign({}, state, {
    keepOldMods: !state.keepOldMods
  });
}

export function requestCharacters(state, action) {
  // Set the app to busy so that it can fetch the new character data
  return Object.assign({}, state, {isBusy: true});
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

  const gameSettings = action.characters.map(character => {
    return new GameSettings(
      character.base_id,
      character.name,
      character.image,
      character.categories
        .concat([character.alignment, character.role])
        .concat(null !== character.ship_slot ? ['Crew Member'] : []),
      character.description
    );
  });

  state.db.saveGameSettings(gameSettings);

  return state;
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

  state.db.getProfile(action.allyCode, dbProfile => {
    const oldProfile = dbProfile ?
      dbProfile.withPlayerName(action.profile.name) :
      new PlayerProfile(action.allyCode, action.profile.name);
    // Collect the new character objects by combining the default characters with the player values from the action
    // and the optimizer settings from the current profile.
    const newCharacters = mapObjectByKeyAndValue(action.profile.characters, (id, playerValues) => {
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
            state.gameSettings[id] && state.gameSettings[id].tags.includes('Crew Member') ? 5 : 1,
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
      const oldMods = oldProfile.mods.reduce((mods, mod) => {
        mods[mod.id] = mod.unequip();
        return mods;
      }, {});

      finalMods = Object.values(Object.assign({}, oldMods, newMods));
    } else {
      finalMods = Object.values(newMods);
    }

    const newProfile = oldProfile.withCharacters(newCharacters).withMods(finalMods);
    state.db.saveProfile(newProfile);
    state.db.deleteLastRun(newProfile.allyCode);
  });

  const lastUpdate = new Date(action.profile.updated);
  const nextUpdate = new Date(lastUpdate.getTime() + 60 * 60 * 1000); // plus one hour

  return Object.assign({}, state, {
    // isBusy: false,
    allyCode: action.allyCode,
    optimizerView: 'edit',
    flashMessage: {
      heading: action.messages.length ? 'API Errors' : 'Success!',
      content:
        (action.messages.length ? [
          <div className={'errors'} key={0}>
            {action.messages.map((message, index) => <p key={index}>{message}</p>)}
          </div>
        ] : []).concat([
          <p key={100}>
            Successfully pulled data for <span className={'gold'}>{Object.keys(action.profile.characters).length}
          </span> characters and <span className={'gold'}>{action.profile.mods.length}</span> mods.</p>,
          <p key={101}>Your data was last updated as of <span className={'gold'}>{lastUpdate.toLocaleString()}</span>.
          </p>,
          <p key={102}>You should be able to fetch fresh data any time after <span className={'gold'}>
          {nextUpdate.toLocaleString()}</span>
          </p>,
          <hr key={103}/>,
          <h3 key={104}><strong>
            Remember: The optimizer can only pull data for mods that you currently have equipped!
          </strong></h3>,
          <p key={105}>
            If it looks like you're missing mods, try equipping them on your characters and fetching data again after
            the
            time listed above.
          </p>,
        ])
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

  state.db.getProfile(action.allyCode, oldProfile => {
    const newProfile = oldProfile.withCharacters(
      action.stats.reduce((characters, statObject) => {
        const character = oldProfile.characters[statObject.unit.defId];

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

    state.db.saveProfile(newProfile);
  });

  const errorCharacters = action.requestedCharacters.filter(charID =>
    !action.stats.map(stats => stats.unit.defId).includes(charID)
  ).map(charID => state.gameSettings[charID].name);

  const errorMessage = errorCharacters.length > 0 ?
    'Missing stats for characters: ' + errorCharacters.join(', ') +
    '. These characters may not optimize properly.'
    : null;

  return Object.assign({}, state, {
    allyCode: action.allyCode,
    error: errorMessage,
  });
}
