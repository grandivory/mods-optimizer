// A map from the name of each stat as used in the mod exporter to
// the name of the property used internally by the mod optimizer
const statTypeMap = {
  'Health': 'health',
  'Protection': 'protection',
  'Speed': 'speed',
  'Critical Damage': 'critDmg',
  'Potency': 'potency',
  'Tenacity': 'tenacity',
  'Offense': 'offense',
  'Critical Chance': 'critChance',
  'Defense': 'defense',
  'Accuracy': 'accuracy'
};

Object.freeze(statTypeMap);

export default statTypeMap;
