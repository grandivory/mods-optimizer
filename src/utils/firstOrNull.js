// @flow

export default function firstOrNull(arr) {
  if ('undefined' !== typeof arr[0]) {
    return arr[0];
  } else {
    return null;
  }
};
