// @flow

import groupByKey from "../../utils/groupByKey";
import {updateCurrentProfile} from "./modsOptimizer";

export function changeOptimizerView(state, action) {
  return Object.assign({}, state, {
    optimizerView: action.view
  });
}

export function changeModSetFilter(state, action) {
  return Object.assign({}, state, {
    modSetsFilter: action.filter
  });
}

export function unequipMod(state, action) {
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

export function reassignMod(state, action) {
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

export function unequipMods(state, action) {
  return updateCurrentProfile(state, profile => {
    const modsById = groupByKey(profile.mods, mod => mod.id);
    const modsUpdate = groupByKey(action.mods.map(modID => modsById[modID].unequip()), mod => mod.id);

    return profile.withMods(Object.values(Object.assign({}, modsById, modsUpdate)));
  });
}

export function reassignMods(state, action) {
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

export function deleteMod(state, action) {
  return updateCurrentProfile(state, profile => {
    const oldMods = profile.mods;

    return profile.withMods(oldMods.filter(mod => mod !== action.mod));
  });
}

export function changeModListFilter(state, action) {
  return Object.assign({}, state, {
    modListFilter: action.filter
  });
}
