// A map from the name of each stat as used in the mod exporter to
// the name(s) of the property(ies) used internally by the mod optimizer
const statTypeMap = {
  'Health': ['health'],
  'Protection': ['protection'],
  'Speed': ['speed'],
  'Critical Damage': ['critDmg'],
  'Potency': ['potency'],
  'Tenacity': ['tenacity'],
  'Offense': ['physDmg', 'specDmg'],
  'Physical Damage': ['physDmg'],
  'Special Damage': ['specDmg'],
  'Critical Chance': ['critChance'],
  'Physical Critical Chance': ['physCritChance'],
  'Special Critical Chance': ['specCritChance'],
  'Defense': ['armor', 'resistance'],
  'Armor': ['armor'],
  'Resistance': ['resistance'],
  'Accuracy': ['accuracy'],
  'Critical Avoidance': ['critAvoid']
};

Object.freeze(statTypeMap);

export default statTypeMap;
