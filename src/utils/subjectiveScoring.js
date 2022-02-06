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
export function offenseScore (mod) {
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
 * @returns {{score: number, bonus: number }} Score and bonus of a single stat
 */
export function singleSecondaryStatScore (stat, mod) {

  // Bonus for matching set
  const bonusMultiplier = {
    'offense': {
      'Speed': 0.5,
      'Offense': 0.3,
      'Offense %': 0.3,
      'Critical Chance %': 0.2
    },
    'critdamage': {
      'Speed': 0.5,
      'Offense': 0.2,
      'Offense %': 0.2,
      'Critical Chance %': 0.2
    },
    'speed': {
      'Speed': 0.5
    },
    'critchance': {
      'Speed': 0.5,
      'Offense': 0.2,
      'Offense %': 0.2,
      'Critical Chance %': 0.3,
    },
    'potency': {
      'Speed': 0.5,
      'Potency %': 0.5
    },
    'defense': {
      'Speed': 0.5,
      'Defense': 0.3,
      'Defense %': 0.3,
      'Health': 0.2,
      'Health %': 0.2,
      'Protection': 0.2,
      'Protection %': 0.2
    },
    'health': {
      'Speed': 0.5,
      'Health': 0.2,
      'Health %': 0.2,
      'Protection': 0.2,
      'Protection %': 0.2
    },
    'tenacity': {
      'Speed': 0.5,
      'Tenacity %': 0.5
    }
  }

  const min = statRoll[stat.type][mod.pips].min;
  const max = statRoll[stat.type][mod.pips].max;
  const range = max - min;
  const avg = stat.value / stat.rolls;
  let baseScore = (avg - min) / range * 100; // (s)
  // SIMULATE 6E if the mod is 5A (15)
  // if (mod.pips === 5 && mod.level === 15) {
  //   const newStat = stat.upgradeSecondary();
  //   const min = statRoll[stat.type][mod.pips + 1].min;
  //   const max = statRoll[stat.type][mod.pips + 1].max;
  //   const range = max - min;
  //   const avg = newStat.value / stat.rolls;
  //   baseScore = (avg - min) / range * 100; // (s)
  // }
  const score = baseScore * stat.rolls / statRoll['MAX_ROLLS']; // (S)

  let bonus;
  if (bonusMultiplier[mod.set.name].hasOwnProperty(stat.type)) {
    if (baseScore >= 60 && stat.rolls >= 3)
      bonus = score * bonusMultiplier[mod.set.name][stat.type]; // (B)
  }

  return {
    score: Math.round(score * 100) / 100 || 0,
    bonus: Math.round(bonus * 100) / 100 || 0
  }

}

/**
 * Return a score of a mod based on all of its secondary stats. 
 * 
 * Base score is 20 * max rolls of the mod.
 * Final score is then scaled to 0-100.
 * 
 * @param {mod} Mod 
 * @returns {{ overall: number, statScores: array of { score: number, bonus: number}}} Overall score of a mod and each of its individual stats
 */

export function modSecondaryStatScore (mod) {

  const maxRolls = mod.pips === 6 ? mod.pips + mod.tier + 1 : mod.pips === 5 ? mod.pips + mod.tier - 2 : 4;
  const maxScore = maxRolls * 20;
  const statScores = mod.secondaryStats.length > 0 ?
    mod.secondaryStats.map(
      (stat, index) => singleSecondaryStatScore(stat, mod)
    ) : [];

  return {
    overall: (statScores.reduce((acc, cur) => acc + cur.score + cur.bonus, 0) / maxScore * 100).toFixed(2),
    statScores: statScores
  }

}
