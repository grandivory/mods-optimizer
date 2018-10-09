/**
 * Group all objects in an array by keyFunc, collecting the results into sub-arrays
 * @param arr Array
 * @param keyFunc Function * => *
 * @returns {*}
 */
export default function collectByKey(arr, keyFunc) {
  return arr.reduce((collection, element) => {
    const key = keyFunc(element);
    collection[key] = (collection[key] || []).concat([element]);
    return collection;
  }, {});
}
