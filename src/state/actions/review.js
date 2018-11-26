// @flow

export const CHANGE_OPTIMIZER_VIEW = 'CHANGE_OPTIMIZER_VIEW';
export const CHANGE_MOD_SET_FILTER = 'CHANGE_MOD_SET_FILTER';
export const UNEQUIP_MOD = 'UNEQUIP_MOD';
export const REASSIGN_MOD = 'REASSIGN_MOD';
export const UNEQUIP_MODS = 'UNEQUIP_MODS';
export const REASSIGN_MODS = 'REASSIGN_MODS';
export const DELETE_MOD = 'DELETE_MOD';
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
 * @returns {{type: string, mod: *}}
 */
export function unequipMod(modID) {
  return {
    type: UNEQUIP_MOD,
    mod: modID
  };
}

/**
 * Move a mod from its current character to a different character
 * @param modID {string}
 * @param characterID {string}
 * @returns {{type: string, mod: *, character: *}}
 */
export function reassignMod(modID, characterID) {
  return {
    type: REASSIGN_MOD,
    mod: modID,
    character: characterID
  };
}

/**
 * Remove a set of mods from their assigned character
 * @param modIDS {Array<string>}
 * @returns {{type: string, mods: *}}
 */
export function unequipMods(modIDs) {
  return {
    type: UNEQUIP_MODS,
    mods: modIDs
  };
}

/**
 * Reassign a set of mods to a new character
 * @param modIDs {Array<string>}
 * @param characterID {string}
 * @returns {{type: string, mods: *, character: *}}
 */
export function reassignMods(modIDs, characterID) {
  return {
    type: REASSIGN_MODS,
    mods: modIDs,
    character: characterID
  };
}

/**
 * Remove a mod from a player's profile
 * @param mod {Mod}
 * @returns {{type: string, mod: Mod}}
 */
export function deleteMod(mod) {
  return {
    type: DELETE_MOD,
    mod: mod
  };
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
