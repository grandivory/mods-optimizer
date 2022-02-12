// @flow

// A map of min and max value per roll for each type of secondary stats,
// numbered by mod rarity
//
// Ref:
//  https://wiki.swgoh.help/wiki/Mods
//  https://forums.galaxy-of-heroes.starwars.ea.com/discussion/178037/a-very-brief-overview-of-upcoming-mod-changes

const statRoll = {
  'MIN_ROLLS': 1,
  'MAX_ROLLS': 5,
  'Critical Chance %': {
    1: { min: 0.5, max: 1 },
    2: { min: 0.625, max: 1.25 },
    3: { min: 0.75, max: 1.5 },
    4: { min: 1, max: 2 },
    5: { min: 1.125, max: 2.25 },
    6: { min: 1.175, max: 2.35 }
  },
  'Defense': {
    1: { min: 2, max: 4 },
    2: { min: 2, max: 5 },
    3: { min: 3, max: 6 },
    4: { min: 4, max: 8 },
    5: { min: 4, max: 10 },
    6: { min: 8, max: 16 }
  },
  'Defense %': {
    1: { min: 0.5, max: 1 },
    2: { min: 0.55, max: 1.1 },
    3: { min: 0.65, max: 1.3 },
    4: { min: 0.75, max: 1.5 },
    5: { min: 0.85, max: 1.7 },
    6: { min: 1.989, max: 3.978 }
  },
  'Health': {
    1: { min: 99, max: 199 },
    2: { min: 118, max: 236 },
    3: { min: 150, max: 300 },
    4: { min: 173, max: 347 },
    5: { min: 214, max: 428 },
    6: { min: 270, max: 540 }
  },
  'Health %': {
    1: { min: 0.25, max: 0.5 },
    2: { min: 0.313, max: 0.626 },
    3: { min: 0.375, max: 0.75 },
    4: { min: 0.5, max: 1 },
    5: { min: 0.563, max: 1.125 },
    6: { min: 1, max: 2 }
  },
  'Offense': {
    1: { min: 8, max: 16 },
    2: { min: 10, max: 20 },
    3: { min: 14, max: 28 },
    4: { min: 18, max: 36 },
    5: { min: 23, max: 46 },
    6: { min: 26, max: 51 }
  },
  'Offense %': {
    1: { min: 0.125, max: 0.25 },
    2: { min: 0.156, max: 0.313 },
    3: { min: 0.188, max: 0.375 },
    4: { min: 0.25, max: 0.5 },
    5: { min: 0.281, max: 0.563 },
    6: { min: 0.85, max: 1.7 }
  },
  'Potency %': {
    1: { min: 0.5, max: 1 },
    2: { min: 0.625, max: 1.25 },
    3: { min: 0.75, max: 1.5 },
    4: { min: 1, max: 2 },
    5: { min: 1.125, max: 2.25 },
    6: { min: 1.5, max: 3 }
  },
  'Protection': {
    1: { min: 99, max: 199 },
    2: { min: 154, max: 309 },
    3: { min: 240, max: 483 },
    4: { min: 319, max: 639 },
    5: { min: 415, max: 830 },
    6: { min: 460, max: 921 }
  },
  'Protection %': {
    1: { min: 0.5, max: 1 },
    2: { min: 0.63, max: 1.25 },
    3: { min: 0.75, max: 1.5 },
    4: { min: 1, max: 2 },
    5: { min: 1.125, max: 2.25 },
    6: { min: 1.5, max: 3 }
  },
  'Speed': {
    1: { min: 1, max: 2 },
    2: { min: 1, max: 3 },
    3: { min: 2, max: 4 },
    4: { min: 2, max: 5 },
    5: { min: 3, max: 6 },
    6: { min: 3, max: 6 }
  },
  'Tenacity %': {
    1: { min: 0.5, max: 1 },
    2: { min: 0.625, max: 1.25 },
    3: { min: 0.75, max: 1.5 },
    4: { min: 1, max: 2 },
    5: { min: 1.125, max: 2.25 },
    6: { min: 1.5, max: 3 }
  }
}

Object.freeze(statRoll);

export default statRoll;