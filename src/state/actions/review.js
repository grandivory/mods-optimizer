// @flow

import { updateProfile } from "./app";
import groupByKey from "../../utils/groupByKey";

export const CHANGE_OPTIMIZER_VIEW = 'CHANGE_OPTIMIZER_VIEW';
export const CHANGE_MOD_SET_FILTER = 'CHANGE_MOD_SET_FILTER';
export const CHANGE_MODLIST_FILTER = 'CHANGE_MODLIST_FILTER';

export function changeOptimizerView(newView) {
  return {
    type: CHANGE_OPTIMIZER_VIEW,
    view: newView
  };
}

/**
 * Update the filter that is used to limit which mod sets are shown after optimizing mods
 * @param newFilter string
 * @returns {{type: string, filter: *}}
 */
export function changeModSetFilter(newFilter) {
  return {
    type: CHANGE_MOD_SET_FILTER,
    filter: newFilter
  };
}

/**
 * Unassign a mod
 * @param modID {string}
 * @returns {Function}
 */
export function unequipMod(modID) {
  return updateProfile(profile => {
    const mods = groupByKey(profile.mods, mod => mod.id);
    const oldMod = mods[modID];
    const newMod = oldMod ? oldMod.unequip() : null;

    return newMod ?
      profile.withMods(Object.values(Object.assign({}, mods, {
        [modID]: newMod
      }))) :
      profile;
  });
}

/**
 * Move a mod from its current character to a different character
 * @param modID {string}
 * @param characterID {string}
 * @returns {Function}
 */
export function reassignMod(modID, characterID) {
  return updateProfile(profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMod = modsById[modID];
    const currentlyEquippedMod =
      profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === characterID);

    const newMods = Object.values(Object.assign(
      {},
      modsById,
      oldMod ? { [oldMod.id]: oldMod.equip(characterID) } : {},
      currentlyEquippedMod ? { [currentlyEquippedMod.id]: currentlyEquippedMod.unequip() } : {}
    ));

    return profile.withMods(newMods);
  });
}

/**
 * Remove a set of mods from their assigned character
 * @param modIDS {Array<string>}
 * @returns {Function}
 */
export function unequipMods(modIDs) {
  return updateProfile(profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const modsUpdate = groupByKey(modIDs.map(modID => modsById[modID].unequip()), mod => mod.id);

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

/**
 * Reassign a set of mods to a new character
 * @param modIDs {Array<string>}
 * @param characterID {string}
 * @returns {Function}
 */
export function reassignMods(modIDs, characterID) {
  return updateProfile(profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMods = modIDs.map(modID => modsById[modID]);
    const currentlyEquippedMods =
      oldMods.map(oldMod => profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === characterID))
        .filter(mod => mod);

    const modsUpdate = groupByKey(
      currentlyEquippedMods.map(mod => mod.unequip()).concat(oldMods.map(mod => mod.equip(characterID))),
      mod => mod.id
    );

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

/**
 * Given a full optimizer recommendation, reassign all mods to all characters at once
 * @param {Array<Object>} modAssignments An array of objects including `id` and `assignedMods` keys
 */
export function reassignAllMods(modAssignments) {
  return updateProfile(profile => {
    const characterByMod = modAssignments
      .reduce(
        (modMap, { id: charId, assignedMods: mods }) => {

          const newMapEntries = mods.reduce((map, modId) => Object.assign(map, { [modId]: charId }), {});

          return Object.assign(modMap, newMapEntries);
        },
        {}
      );

    const modsById = groupByKey(profile.mods, mod => mod.id);
    const oldMods = Object.keys(characterByMod).map(modID => modsById[modID]);
    const currentlyEquippedMods =
      oldMods.map(oldMod =>
        profile.mods.find(mod => mod.slot === oldMod.slot && mod.characterID === characterByMod[oldMod.id])
      ).filter(mod => mod);

    const modsUpdate = groupByKey(
      currentlyEquippedMods.map(mod => mod.unequip()).concat(oldMods.map(mod => mod.equip(characterByMod[mod.id]))),
      mod => mod.id
    );

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  })
}

/**
 * Update the filter for the mod list view
 * @param newFilter {{view: string, sort: string, tag: string}}
 * @returns {{type: string, filter: *}}
 */
export function changeModListFilter(newFilter) {
  return {
    type: CHANGE_MODLIST_FILTER,
    filter: newFilter
  };
}

/**
 * Replace parts of the mod list filter, leaving the rest as-is
 * @param newFilter {Object}
 * @returns {Function}
 */
export function updateModListFilter(newFilter) {
  return function (dispatch, getState) {
    const state = getState();

    dispatch(changeModListFilter(
      Object.assign({}, state.modListFilter, newFilter)
    ));
  }
}
