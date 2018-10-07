// @flow

/**
 * Convert an array into an object, where the object's keys are the result of calling keyFunc on each
 * element in the array
 * @param arr Array[*]
 * @param keyFunc * => *
 */
export default function groupByKey(arr, keyFunc) {
  return arr.reduce((obj, item) => {
    obj[keyFunc(item)] = item;
    return obj;
  }, {});
}
