// @flow

export const CHANGE_MODS_FILTER = 'CHANGE_MODS_FILTER';

/**
 * Update the filter for the explore view
 * @param newFilter
 * @returns {{type: string, filter: *}}
 */
export function changeModsFilter(newFilter) {
  return {
    type: CHANGE_MODS_FILTER,
    filter: newFilter
  };
}
