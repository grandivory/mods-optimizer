import statRoll from '../constants/statRoll'

/**
 * Return a score (suitable for sorting) of the offensive power of a mod.  This is a subjective score
 * based on the relative value of different types of sets and stats.  It is along the lines of the
 * evalutation here:
 *
 * https://gaming-fans.com/swgoh-101/swgoh-101-comprehensive-mod-guide/swgoh-101-mod-guide-choose-good-mods/
 *
 * @param mod Mod
 */
export function offenseScore(mod) {
  // weights for the set (mod type), primary attribute and secondary attributes
  const setScore = {
    'offense': 50,
    'critdamage': 30,
    'speed': 22.5,
    'critchance': 20,
    'potency': 20,
    'defense': 0,
    'health': 0,
    'tenacity': 0
  };

  const statScore = {
    'Speed': 6,
    'Offense': 0.33,
    'Offense %': 8,
    'Critical Damage %': 4,
    'Critical Chance %': 5,
    'Critical Avoidance %': 0,
    'Defense': 0,
    'Defense %': 0,
    'Health': 0,
    'Health %': 0,
    'Protection': 0,
    'Protection %': 0,
    'Potency %': 2.66,
    'Tenacity %': 0,
    'Accuracy %': 1
  };

  // Return the value of the mod set plus the sum of the values of all the stats on the mod
  return mod.secondaryStats.concat([mod.primaryStat])
    .reduce((acc, stat) => acc + statScore[stat.type] * stat.value, setScore[mod.set.name]);
};

/**
 * Return a score of a single secondary stat based on its degree of value, rolls, and matching set.
 *
 * First, determine a base score (0-100) (s) representing magnitude of the value yielded from stat rolls.
 * Second, scale the base score up/down adhering to number of rolls (S).
 * Last, if stat type matches mod type and the score is considerably good, give additional bonus (B).
 *
 * Max score is 20 / roll excluding bonus
 *
 * @param {stat} Stat
 * @param {mod} Mod
 *
 * @returns {{score: number, percentage: number }} Score of a single stat and average percentage/roll.
 */
export function singleSecondaryStatScore(stat, mod) {
  const min = statRoll[stat.type][mod.pips].min;
  const max = statRoll[stat.type][mod.pips].max;
  const range = max - min;
  const avg = stat.value / stat.rolls;
  const percentage = avg >= min ? (avg - min) / range * 100 : 0; // (s)
  const score = avg >= min ? percentage * stat.rolls / statRoll['MAX_ROLLS'] : 0; // (S)

  return {
    score: Math.round(score * 100) / 100 || 0,
    percentage: Math.round(percentage * 100) / 100 || 0
  }
}

/**
 * Return a score of a mod based on all of its secondary stats.
 *
 * Base score is 20 * max rolls of the mod.
 * Final score is then scaled to 0-100.
 *
 * @param {mod} Mod
 * @returns {Object} Object with total score, mod score, secondary stat score, bonus, badges and the index of secondaries met with requirements for bonus.
 */
export function modSecondaryStatScore(mod) {
  // Calculate score for each secondary stat
  const statScores = mod.secondaryStats.length > 0 ? mod.secondaryStats.map(
    (stat, index) => singleSecondaryStatScore(stat, mod)
  ) : [];

  // Bonus Badges
  // Flat scores are based on the real-world average values @ 5 rolls (as of 2020)
  // https://docs.google.com/spreadsheets/d/1SiK7RjaXSlfKTR3m3-Sdba4GuXTIrNpJQNUYK04ut-o/edit#gid=122944735
  // e.g.
  // minFlatScore matches (5) 23 Speed and not (3) 15 Speed
  // minPercentageScore matches (3) Speed 15 and not (5) 23 Speed
  // (5) 23 Speed is an average high speed stat
  // (3) 15 Speed is a high percentage stat
  // both stats get the same bonus
  const bonuses = [
    {
      badge: '⚡️',
      title: 'Good Speed',
      stats: ['Speed'],
      minFlatScore: 53, // (5) 53% .53*20*5
      minPercentage: 60,
      minRolls: 3,
      sets: ['speed'],
      primaries: {},
      multiplier: 0.6
    },
    {
      badge: '⚔️',
      title: 'Good Offense',
      stats: ['Offense', 'Critical Chance'],
      minFlatScore: 50, // (5) 50%
      minPercentage: 60,
      minRolls: 4,
      sets: ['critchance', 'critdamage', 'offense'],
      primaries: {
        'triangle': ['Critical Chance', 'Critical Damage', 'Offense'],
        'cross': ['Offense']
      },
      multiplier: 0.3
    },
    {
      badge: '🛡️',
      title: 'Good Defense',
      stats: ['Health', 'Protection', 'Defense'],
      minFlatScore: 53, // (5) 53%
      minPercentage: 60,
      minRolls: 4,
      sets: ['health', 'defense'],
      primaries: {
        'triangle': ['Health', 'Protection'],
        'cross': ['Health', 'Protection']
      },
      multiplier: 0.3,
    },
    {
      badge: '☠️',
      title: 'Good Potency',
      stats: ['Potency'],
      minFlatScore: 52, // (5) 52%
      minPercentage: 60,
      minRolls: 3,
      sets: ['potency'],
      primaries: {
        'cross': ['Potency']
      },
      multiplier: 0.2
    },
    {
      badge: '✊',
      title: 'Good Tenacity',
      stats: ['Tenacity'],
      minFlatScore: 50, // (5) 50%
      minPercentage: 60,
      minRolls: 3,
      sets: ['tenacity'],
      primaries: {
        'cross': ['Tenacity']
      },
      multiplier: 0.2
    }
  ];

  // Give badges and bonuses if conditions are met
  let bonusScore = 0, bonusIndex = [];
  const badges = mod.secondaryStats.length > 0 ? bonuses.flatMap(
    (bonus) => {
      let bonusStatRolls = 0;
      let bonusStatScore = 0;
      let statIndex = [];

      mod.secondaryStats.forEach((stat, index) => {
        if (bonus.stats.includes(stat.displayType)) {
          bonusStatRolls += stat.rolls;
          bonusStatScore += statScores[index].score;
          statIndex.push(index);
        }
      });

      const averagePercentage = bonusStatScore * statRoll['MAX_ROLLS'] / bonusStatRolls;

      if (bonusStatRolls >= bonus.minRolls && (averagePercentage >= bonus.minPercentage || bonusStatScore >= bonus.minFlatScore)) {
        bonusScore += bonusStatScore * bonus.multiplier;
        bonusIndex = bonusIndex.concat(statIndex);

        const ALIGN_BONUS = 10;
        let alignBonusFlag = 0;
        if (bonus.sets.includes(mod.set.name)) {
          bonusScore += ALIGN_BONUS;
          alignBonusFlag++
        }
        if (bonus.primaries.hasOwnProperty(mod.slot) && bonus.primaries[mod.slot].includes(mod.primaryStat.displayType)) {
          bonusScore += ALIGN_BONUS;
          alignBonusFlag++;
        }

        return { badge: bonus.badge, flag: alignBonusFlag, title: bonus.title };
      }
      else
        return [];
    }
  ) : [];

  // the rest
  const maxRolls = mod.pips === 6 ? mod.pips + mod.tier + 1 : mod.pips === 5 ? mod.pips + mod.tier - 2 : 8;
  const maxScore = maxRolls * 20;
  const modScore = statScores.reduce((acc, cur) => acc + cur.score, 0) / maxScore * 100;
  const totalScore = modScore + bonusScore;

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    modScore: Math.round(modScore * 100) / 100,
    statScores: statScores,
    bonusScore: Math.round(bonusScore * 100) / 100,
    bonusIndex: bonusIndex,
    badges: badges
  }

}
