/**
 * Return all possible combinations of choices items from the input array
 * @param input Array the array to choose items from
 * @param choices Integer the number of items to choose
 *
 * @return Array[Array[Integer]]
 */
export default function chooseFromArray(input, choices) {
  let combinations = [];

  for (let i = 0; i <= input.length - choices; i++) {
    if (1 >= choices) {
      combinations.push([input[i]]);
    } else {
      for (let subResult of chooseFromArray(input.slice(i + 1), choices - 1)) {
        combinations.push([input[i]].concat(subResult));
      }
    }
  }

  return combinations;
};
