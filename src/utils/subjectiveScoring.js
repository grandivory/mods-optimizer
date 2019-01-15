
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
	var score = 0;
	
	// weights for the set (mod type), primary attribute and secondary attributes
	let setScore = {
		'critchance' : 30,
		'critdamage' : 30,
		'offense' : 30,
		'potency' : 25,
		'defense' : 10,
		'health' : 10,
		'speed' : 5,
		'tenacity' : 0,
	};
	
	let primaryScore = {
		'Speed' : 50,
		'Critical Damage %' : 40,
		'Critical Chance %' : 30,
		'Offense %' : 25,
		'Defense %' : 10,
		'Health %' : 10,
		'Protection %' : -20,
		'Accuracy' : -60,
		'Tenacity %' : -60,
	};
	
	let secondaryScore = {
		'Speed' : 6,
		'Offense' : 5,
		'Critical Chance %' : 2,
		'Defense' : 1,
		'Offense %' : 1,
		'Potency %' : 1,
		'Health' : 1,
		'Defense %' : 0,
		'Health %' : 0,
		'Protection' : 0,
		'Protection %' : 0,
		'Tenacity %' : 0,
	};
	
	// combine them -- the weight is roughly 30 / 40 / 100
	score += setScore[mod.set.name];	
	score += primaryScore[mod.primaryStat.type];
	
	// secondaries are weighted by the square of the number of rolls on that stat -- 4 speed rolls is pretty valuable
	score += mod.secondaryStats.reduce((acc, stat) => acc + (stat.rolls * stat.rolls) * secondaryScore[stat.type], 0)
	
	return score;
};
