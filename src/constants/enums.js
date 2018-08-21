const modSets = {
  1: 'health',
  2: 'offense',
  3: 'defense',
  4: 'speed',
  5: 'critchance',
  6: 'critdamage',
  7: 'potency',
  8: 'tenacity'
};

const modSlots = {
  1: 'square',
  2: 'arrow',
  3: 'diamond',
  4: 'triangle',
  5: 'circle',
  6: 'cross'
};

const modStats = {
  'UNITSTATACCURACY': 'Potency %',
  'UNITSTATCRITICALCHANCEPERCENTADDITIVE': 'Critical Chance %',
  'UNITSTATCRITICALDAMAGE': 'Critical Damage %',
  'UNITSTATCRITICALNEGATECHANCEPERCENTADDITIVE': 'Critical Avoidance %',
  'UNITSTATDEFENSE': 'Defense',
  'UNITSTATDEFENSEPERCENTADDITIVE': 'Defense %',
  'UNITSTATEVASIONNEGATEPERCENTADDITIVE': 'Accuracy %',
  'UNITSTATMAXHEALTH': 'Health',
  'UNITSTATMAXHEALTHPERCENTADDITIVE': 'Health %',
  'UNITSTATMAXSHIELD': 'Protection',
  'UNITSTATMAXSHIELDPERCENTADDITIVE': 'Protection %',
  'UNITSTATOFFENSE': 'Offense',
  'UNITSTATOFFENSEPERCENTADDITIVE': 'Offense %',
  'UNITSTATRESISTANCE': 'Tenacity %',
  'UNITSTATSPEED': 'Speed'
};

export {modSets, modSlots, modStats};
