export default function objectFromEntries(iter) {
  return 'function' === typeof Object.fromEntries ?
    Object.fromEntries(iter) :
    Array.from(iter).reduce((obj, [key, val]) => {
      obj[key] = val;
      return obj;
    }, {});
}
