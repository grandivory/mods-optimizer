export default function areObjectsEquivalent(left, right) {
  // If either object is null, then Object.getOwnPropertyNames will fail. Do these checks first
  if (left === null && !right === null) {
    return false;
  } else if (right === null) {
    return false;
  }

  // Create arrays of property names
  const leftProps = Object.getOwnPropertyNames(left);
  const rightProps = Object.getOwnPropertyNames(right);

  // If number of properties is different,
  // objects are not equivalent
  if (leftProps.length !== rightProps.length) {
    return false;
  }

  // Check that every property is equivalent
  return leftProps.every(propName => {
    if (left[propName] instanceof Object) {
      return areObjectsEquivalent(left[propName], right[propName]);
    } else {
      return left[propName] === right[propName];
    }
  });
};
