// @flow

/**
 * Collect all of the keys of an object where some predicate is true of that key's value
 * @param obj Object
 * @param predicate * => Boolean
 */
export default function keysWhere(obj, predicate) {
  return Object.entries(obj)
    .filter(([key, value]) => predicate(value))
    .map(([key]) => key)
}
