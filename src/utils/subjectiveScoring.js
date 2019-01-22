/**
 * Return a score (suitable for sorting) of the offensive power of a mod.  This is a subjective score
 * based on the relative value of different types of sets and stats.  It is along the lines of the
 * evalutation here:
 *
 * https://gaming-fans.com/swgoh-101/swgoh-101-comprehensive-mod-guide/swgoh-101-mod-guide-choose-good-mods/
 *
 * @param mod Mod
 */
export default function offenseScore(mod) {
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
