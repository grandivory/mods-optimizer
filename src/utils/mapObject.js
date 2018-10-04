/**
 * Map over all of an object's values, applying the mapFunction to each and returning a new object with the result
 *
 * @param object Object
 * @param mapFunction Function object.value => Any
 */
export function mapObject(object, mapFunction) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFunction(object[key]);
    return result;
  }, {});
}

/**
 * Map over all of an object's keys, applying the mapFunction to each and returning a new object with the result
 *
 * @param object Object
 * @param mapFunction Function object.key => Any
 */
export function mapObjectByKey(object, mapFunction) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFunction(key);
    return result;
  }, {});
}

/**
 * Map over all of an object's key/value pairs, applying the mapFunction to each and returning
 * a new object with the result
 * @param object Object
 * @param mapFunction Function (object.key, object.value) => Any
 */
export function mapObjectByKeyAndValue(object, mapFunction) {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFunction(key, object[key]);
    return result;
  }, {});
}
