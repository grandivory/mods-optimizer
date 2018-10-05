/**
 * Format an ally code to follow the ###-###-### format shown in-game
 * @param allyCode string
 */
import cleanAllyCode from "./cleanAllyCode";

export default function formatAllyCode(allyCode) {
  // Take only numbers
  const cleanedAllyCode = cleanAllyCode(allyCode)
  // Take only the first 9 digits
    .substr(0, 9);

  // Split the numbers into chunks of 3
  const allyCodeChunks = cleanedAllyCode.match(/\d{1,3}/g) || [];

  // Add dashes between each and set the value back on the field
  return allyCodeChunks.join('-');
}
