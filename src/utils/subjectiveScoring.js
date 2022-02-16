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
  const percentage = (avg - min) / range * 100; // (s)
  const score = percentage * stat.rolls / statRoll['MAX_ROLLS']; // (S)

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
  const bonuses = [
    {
      badge: '⚡️',
      stats: ['Speed'],
      minPercentage: 60,
      minRolls: 3,
      multiplier: 0.6
    },
    {
      badge: '⚔️',
      stats: ['Offense', 'Critical Chance'],
      minPercentage: 60,
      minRolls: 4,
      multiplier: 0.3
    },
    {
      badge: '🛡️',
      stats: ['Health', 'Protection', 'Defense'],
      minPercentage: 60,
      minRolls: 4,
      multiplier: 0.3
    },
    {
      badge: '☠️',
      stats: ['Potency'],
      minPercentage: 60,
      minRolls: 3,
      multiplier: 0.2
    },
    {
      badge: '✊',
      stats: ['Tenacity'],
      minPercentage: 60,
      minRolls: 3,
      multiplier: 0.2
    }
  ];

  // Give badges and bonus if conditions are met
  let bonusScore = 0, bonusIndex = [];
  const badges = mod.secondaryStats.length > 0 ? bonuses.flatMap(
    (bonus) => {
      let totalStatRolls = 0;
      let totalStatScore = 0;

      let statIndex = []
      mod.secondaryStats.forEach((stat, index) => {
        if (bonus.stats.includes(stat.displayType)) {
          totalStatRolls += stat.rolls;
          totalStatScore += statScores[index].score;
          statIndex.push(index);
        }
      });

      const averagePercentage = totalStatScore * statRoll['MAX_ROLLS'] / totalStatRolls;

      if (totalStatRolls >= bonus.minRolls && averagePercentage >= bonus.minPercentage) {
        bonusScore += totalStatScore * bonus.multiplier;
        bonusIndex = bonusIndex.concat(statIndex);
        return bonus.badge;
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
