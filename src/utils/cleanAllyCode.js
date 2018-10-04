export default function cleanAllyCode(allyCode) {
  return allyCode.replace(/[^\d]/g, '');
}
