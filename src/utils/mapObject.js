/**
 * Map over all of an object's values, applying the mapFunction to each and returning a new object with the result
 *
 * @param object Object
 */
export function mapObject(object, mapFunction) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFunction(object[key]);
    return result;
  }, {});
}
