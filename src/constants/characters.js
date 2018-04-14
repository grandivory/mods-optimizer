import Character from "../domain/Character";
import BaseStats from "../domain/BaseStats";
import OptimizationPlan from "../domain/OptimizationPlan";

let charactersArray = [
  new Character(
    'Aayla Secura',
    new BaseStats(26236, 28731, 2756, 2351, 1, 125, 291, 116),
    new OptimizationPlan()
  ),
  new Character(
    'Admiral Ackbar',
    new BaseStats(26856, 19200, 2642, 3454, 1, 119, 301, 222),
    new OptimizationPlan(
      .2, // health
      .4, // protection
      100, // speed
      0, // crit damage
      0, // potency
      75, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Ahsoka Tano',
    new BaseStats(23102, 16056, 2648, 1464, 1, 105, 285, 110),
    new OptimizationPlan()
  ),
  new Character(
    'Ahsoka Tano (Fulcrum)',
    new BaseStats(26600, 26452, 2801, 1765, 1, 148, 219, 92),
    new OptimizationPlan()
  ),
  new Character(
    'Amilyn Holdo',
    new BaseStats(36873, 43712, 1997, 3265, .5, 90, 285, 257),
    new OptimizationPlan()
  ),
  new Character(
    'Asajj Ventress',
    new BaseStats(24345, 18158, 2546, 2575, .5, 104, 284, 116),
    new OptimizationPlan(
      .4, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      4, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0 // crit avoidance
    )
  ),
  new Character(
    'B2 Super Battle Droid',
    new BaseStats(28207, 37758, 2419, 2222, 1, 111, 366, 431),
    new OptimizationPlan()
  ),
  new Character(
    'Barriss Offee',
    new BaseStats(29943, 31100, 2393, 2482, 1, 116, 393, 253),
    new OptimizationPlan()
  ),
  new Character(
    'Baze Malbus',
    new BaseStats(28481, 39152, 2622, 1990, 1, 90, 385, 271),
    new OptimizationPlan(
      1, // health
      1, // protection
      100, // speed
      0, // crit damage
      10, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0 // crit avoidance
    )
  ),
  new Character(
    'BB-8',
    new BaseStats(25270, 30427, 2440, 3783, 1, 162, 285, 307),
    new OptimizationPlan(
      .25, // health
      0, // protection
      100, // speed
      0, // crit damage
      0, // potency
      50, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0 // crit avoidance
    )
  ),
  new Character(
    'Biggs Darklighter',
    new BaseStats(15692, 19594, 2239, 2611, 1, 108, 275, 304),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Bistan',
    new BaseStats(28049, 22588, 2659, 1675, 1, 145, 277, 121),
    new OptimizationPlan()
  ),
  new Character(
    'Boba Fett',
    new BaseStats(23193, 19913, 2950, 1687, 1, 147, 221, 188),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Bodhi Rook',
    new BaseStats(26837, 22621, 2575, 3313, 1, 132, 236, 284),
    new OptimizationPlan()
  ),
  new Character(
    'Cad Bane',
    new BaseStats(27439, 15086, 2991, 1886, 1, 113, 256, 146),
    new OptimizationPlan()
  ),
  new Character(
    'Captain Han Solo',
    new BaseStats(27432, 32592, 2111, 2389, 1, 129, 319, 214),
    new OptimizationPlan(
      .5, // health
      0, // protection
      100, // speed
      10, // crit damage
      50, // potency
      0, // tenacity
      .5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0 // crit avoidance
    )
  ),
  new Character(
    'Captain Phasma',
    new BaseStats(26074, 29919, 2179, 2307, 1, 121, 295, 271),
    new OptimizationPlan()
  ),
  new Character(
    'Cassian Andor',
    new BaseStats(27798, 25047, 2135, 3508, .5, 134, 186, 135),
    new OptimizationPlan(
      0, // health
      .4, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'CC-2224 "Cody"',
    new BaseStats(23694, 16040, 2581, 2317, .5, 115, 207, 91),
    new OptimizationPlan()
  ),
  new Character(
    'Chief Chirpa',
    new BaseStats(28017, 28168, 2672, 2503, 1, 116, 326, 253),
    new OptimizationPlan()
  ),
  new Character(
    'Chief Nebit',
    new BaseStats(34474, 40275, 2744, 1956, 1, 115, 404, 228),
    new OptimizationPlan()
  ),
  new Character(
    'Chirrut Îmwe',
    new BaseStats(16110, 24866, 2895, 1819, 1, 153, 267, 240),
    new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0,// crit avoidance
    )
  ),
  new Character(
    'Chopper',
    new BaseStats(31708, 29738, 2319, 2032, 1, 152, 390, 187),
    new OptimizationPlan(
      .2, // health
      .33, // protection
      100, // speed
      0, // crit damage
      0, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Clone Sergeant - Phase I',
    new BaseStats(27009, 19019, 2505, 1513, 1, 107, 277, 134),
    new OptimizationPlan()
  ),
  new Character(
    'Clone Wars Chewbacca',
    new BaseStats(35134, 31433, 2757, 2038, 1, 106, 360, 227),
    new OptimizationPlan()
  ),
  new Character(
    'Colonel Starck',
    new BaseStats(28193, 33480, 2264, 2102, 1, 155, 291, 133),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0 // crit avoidance
    )
  ),
  new Character(
    'Commander Luke Skywalker',
    new BaseStats(25266, 30107, 3164, 1872, 1, 152, 222, 106),
    new OptimizationPlan(
      .25, // health
      .25, // protection
      100, // speed
      30, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0 // crit avoidance
    )
  ),
  new Character(
    'Coruscant Underworld Police',
    new BaseStats(28338, 16817, 2493, 1923, 1, 112, 254, 313),
    new OptimizationPlan()
  ),
  new Character(
    'Count Dooku',
    new BaseStats(19559, 16692, 2187, 2603, .5, 167, 276, 282),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      33, // potency
      50, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'CT-21-0408 "Echo"',
    new BaseStats(29166, 21252, 2453, 3645, .5, 129, 209, 143),
    new OptimizationPlan()
  ),
  new Character(
    'CT-5555 "Fives"',
    new BaseStats(31787, 35342, 2638, 2067, 1, 115, 509, 233),
    new OptimizationPlan()
  ),
  new Character(
    'CT-7567 "Rex"',
    new BaseStats(20916, 17981, 2484, 2723, 1, 140, 194, 180),
    new OptimizationPlan(
      0.25, // health
      0, // protection
      100, // speed
      0, // crit damage
      40, // potency
      75, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance, \n0, // crit avoidance
      true
    )
  ),
  new Character(
    'Darth Maul',
    new BaseStats(26165, 12733, 2852, 1137, 1, 100, 250, 98),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      33, // potency
      10, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance,\n0, // crit avoidance
      true
    )
  ),
  new Character(
    'Darth Nihilus',
    new BaseStats(26259, 38154, 1657, 4345, 0, 120, 308, 265),
    new OptimizationPlan(
      0, // health
      .1, // protection
      100, // speed
      0, // crit damage
      25, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Darth Sidious',
    new BaseStats(23499, 15775, 2791, 2025, 1, 161, 258, 100),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      0, // crit damage
      75, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Darth Sion',
    new BaseStats(33278, 39707, 3001, 2071, 1, 137, 400, 194),
    new OptimizationPlan()
  ),
  new Character(
    'Darth Traya',
    new BaseStats(32072, 38006, 2313, 5007, 0, 134, 188, 161),
    new OptimizationPlan()
  ),
  new Character(
    'Darth Vader',
    new BaseStats(26646, 35283, 2514, 2565, 1, 121, 371, 334),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      30, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      65, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Dathcha',
    new BaseStats(23950, 15245, 2363, 3232, .5, 137, 247, 165),
    new OptimizationPlan()
  ),
  new Character(
    'Death Trooper',
    new BaseStats(26388, 35155, 2429, 2075, 1, 124, 255, 152),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      10, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Dengar',
    new BaseStats(29230, 33112, 2852, 1377, 1, 109, 305, 189),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      10, // crit damage
      50, // potency
      0, // tenacity
      1, // offense
      75, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Director Krennic',
    new BaseStats(24482, 22240, 2195, 4446, 0, 129, 166, 212),
    new OptimizationPlan()
  ),
  new Character(
    'Eeth Koth',
    new BaseStats(26307, 17686, 2152, 3608, .5, 144, 190, 250),
    new OptimizationPlan()
  ),
  new Character(
    'Emperor Palpatine',
    new BaseStats(24999, 18955, 2363, 5300, 0, 122, 142, 223),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Ewok Elder',
    new BaseStats(27549, 26448, 1933, 2127, 1, 122, 314, 225),
    new OptimizationPlan(
      .5, // health
      0, // protection
      100, // speed
      0, // crit damage
      0, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Ewok Scout',
    new BaseStats(25685, 23792, 2737, 1777, 1, 140, 272, 120),
    new OptimizationPlan()
  ),
  new Character(
    'Ezra Bridger',
    new BaseStats(27310, 28928, 2570, 1744, 1, 143, 288, 125),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      5, // tenacity
      1, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Finn',
    new BaseStats(30522, 34100, 2458, 1974, 1, 119, 468, 246),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      10, // speed
      33, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      33, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'First Order Executioner',
    new BaseStats(29216, 34967, 2904, 1574, 1, 111, 308, 176),
    new OptimizationPlan()
  ),
  new Character(
    'First Order Officer',
    new BaseStats(28099, 18375, 2068, 2117, 1, 145, 253, 133),
    new OptimizationPlan()
  ),
  new Character(
    'First Order SF TIE Pilot',
    new BaseStats(27640, 32834, 2325, 2668, .5, 130, 316, 163),
    new OptimizationPlan()
  ),
  new Character(
    'First Order Stormtrooper',
    new BaseStats(32966, 30161, 2801, 1633, 1, 116, 460, 247),
    new OptimizationPlan()
  ),
  new Character(
    'First Order TIE Pilot',
    new BaseStats(24379, 18436, 2958, 1614, 1, 128, 220, 63),
    new OptimizationPlan()
  ),
  new Character(
    'Gamorrean Guard',
    new BaseStats(37232, 33275, 2614, 1742, 1, 118, 352, 313),
    new OptimizationPlan()
  ),
  new Character(
    'Gar Saxon',
    new BaseStats(26701, 30467, 2742, 1847, 1, 127, 404, 247),
    new OptimizationPlan()
  ),
  new Character(
    'Garazeb "Zeb" Orrelios',
    new BaseStats(36749, 33152, 2748, 1439, 1, 115, 352, 102),
    new OptimizationPlan(
      0, // health
      .33, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'General Grievous',
    new BaseStats(32627, 23213, 2819, 1504, 1, 109, 229, 112),
    new OptimizationPlan()
  ),
  new Character(
    'General Kenobi',
    new BaseStats(31124, 44728, 2935, 1989, 1, 127, 386, 352),
    new OptimizationPlan(
      1, // health
      1, // protection
      10, // speed
      0, // crit damage
      0, // potency
      5, // tenacity
      0, // offense
      0, // crit chance
      1, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'General Veers',
    new BaseStats(22449, 30852, 2650, 3616, .5, 137, 218, 209),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      33, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Geonosian Soldier',
    new BaseStats(23655, 17814, 2921, 1869, 1, 154, 263, 96),
    new OptimizationPlan()
  ),
  new Character(
    'Geonosian Spy',
    new BaseStats(25360, 18153, 2683, 1545, 1, 127, 203, 114),
    new OptimizationPlan()
  ),
  new Character(
    'Grand Admiral Thrawn',
    new BaseStats(26987, 30185, 2149, 3825, .5, 150, 303, 207),
    new OptimizationPlan(
      .25, // health
      .25, // protection
      100, // speed
      0, // crit damage
      0, // potency
      50, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Grand Master Yoda',
    new BaseStats(28667, 16325, 2368, 4291, .5, 157, 245, 149),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      33, // crit damage
      33, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Grand Moff Tarkin',
    new BaseStats(25156, 23132, 2292, 3609, .5, 134, 229, 257),
    new OptimizationPlan()
  ),
  new Character(
    'Greedo',
    new BaseStats(25121, 15733, 2835, 1765, 1, 134, 192, 131),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Han Solo',
    new BaseStats(26003, 21291, 2496, 1495, 1, 136, 195, 72),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      5, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Hera Syndulla',
    new BaseStats(24394, 27322, 2390, 2934, 1, 132, 369, 422),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      0, // crit damage
      10, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Hermit Yoda',
    new BaseStats(34851, 41226, 2201, 3562, .5, 160, 238, 207),
    new OptimizationPlan()
  ),
  new Character(
    'HK-47',
    new BaseStats(25598, 30636, 2602, 2471, 1, 103, 283, 220),
    new OptimizationPlan()
  ),
  new Character(
    'Hoth Rebel Scout',
    new BaseStats(24554, 19261, 2645, 2121, 1, 155, 209, 147),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Hoth Rebel Soldier',
    new BaseStats(36251, 32564, 2571, 2105, 1, 98, 337, 238),
    new OptimizationPlan(
      .4, // health
      .4, // protection
      100, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'IG-100 MagnaGuard',
    new BaseStats(37149, 35306, 2770, 1879, 1, 99, 309, 212),
    new OptimizationPlan()
  ),
  new Character(
    'IG-86 Sentinel Droid',
    new BaseStats(24687, 17131, 2717, 1798, 1, 119, 225, 69),
    new OptimizationPlan()
  ),
  new Character(
    'IG-88',
    new BaseStats(23490, 14077, 2757, 1910, 1, 127, 219, 139),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Ima-Gun Di',
    new BaseStats(34443, 28875, 2835, 1967, 1, 125, 305, 143),
    new OptimizationPlan()
  ),
  new Character(
    'Imperial Probe Droid',
    new BaseStats(27089, 32172, 2105, 3491, 1, 132, 290, 282),
    new OptimizationPlan()
  ),
  new Character(
    'Imperial Super Commando',
    new BaseStats(27917, 31001, 2732, 1989, 1, 121, 308, 134),
    new OptimizationPlan()
  ),
  new Character(
    'Jawa',
    new BaseStats(26611, 15314, 2496, 3299, .5, 133, 292, 153),
    new OptimizationPlan()
  ),
  new Character(
    'Jawa Engineer',
    new BaseStats(24555, 16561, 2543, 3187, .5, 153, 325, 212),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Jawa Scavenger',
    new BaseStats(26493, 17427, 2559, 3120, 1, 119, 261, 236),
    new OptimizationPlan()
  ),
  new Character(
    'Jedi Consular',
    new BaseStats(23767, 18689, 2055, 2824, .5, 119, 276, 209),
    new OptimizationPlan()
  ),
  new Character(
    'Jedi Knight Anakin',
    new BaseStats(25059, 25181, 2800, 1974, 1, 144, 292, 76),
    new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Jedi Knight Guardian',
    new BaseStats(28812, 32069, 2751, 1835, 1, 97, 270, 232),
    new OptimizationPlan()
  ),
  new Character(
    'Jyn Erso',
    new BaseStats(23520, 25787, 2804, 1922, 1, 163, 255, 77),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      33, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      75, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'K-2SO',
    new BaseStats(33243, 38185, 2996, 2076, 1, 129, 399, 194),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Kanan Jarrus',
    new BaseStats(31627, 35600, 2813, 1543, 1, 95, 347, 91),
    new OptimizationPlan(
      0, // health
      .4, // protection
      100, // speed
      10, // crit damage
      33, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Kit Fisto',
    new BaseStats(28509, 30319, 2831, 2066, 1, 120, 307, 141),
    new OptimizationPlan()
  ),
  new Character(
    'Kylo Ren',
    new BaseStats(24744, 32983, 2880, 1720, 10, 128, 303, 258),
    new OptimizationPlan()
  ),
  new Character(
    'Kylo Ren (Unmasked)',
    new BaseStats(30428, 36380, 3051, 2067, 1, 132, 332, 190),
    new OptimizationPlan()
  ),
  new Character(
    'Lando Calrissian',
    new BaseStats(23447, 19333, 2217, 2023, 1, 115, 287, 193),
    new OptimizationPlan()
  ),
  new Character(
    'Lobot',
    new BaseStats(28395, 16056, 2236, 4321, 1, 120, 288, 206),
    new OptimizationPlan()
  ),
  new Character(
    'Logray',
    new BaseStats(28431, 30052, 2389, 3409, 1, 127, 285, 196),
    new OptimizationPlan()
  ),
  new Character(
    'Luke Skywalker (Farmboy)',
    new BaseStats(24870, 19920, 2760, 1521, 1, 125, 222, 87),
    new OptimizationPlan()
  ),
  new Character(
    'Luminara Unduli',
    new BaseStats(23103, 20355, 2715, 2176, 1, 124, 233, 167),
    new OptimizationPlan()
  ),
  new Character(
    'Mace Windu',
    new BaseStats(26454, 21383, 2259, 3942, .5, 123, 258, 426),
    new OptimizationPlan()
  ),
  new Character(
    'Magmatrooper',
    new BaseStats(27452, 30192, 3020, 1730, 1, 119, 304, 107),
    new OptimizationPlan()
  ),
  new Character(
    'Mob Enforcer',
    new BaseStats(26961, 26075, 2816, 2597, 1, 132, 300, 157),
    new OptimizationPlan()
  ),
  new Character(
    'Mother Talzin',
    new BaseStats(29274, 35092, 2147, 4826, 0, 122, 217, 182),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      0, // crit damage
      100, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Nightsister Acolyte',
    new BaseStats(23314, 20877, 2245, 4654, .5, 147, 142, 138),
    new OptimizationPlan(
      .2, // health
      0, // protection
      10, // speed
      33, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      75, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Nightsister Initiate',
    new BaseStats(35088, 34708, 3532, 1619, 1, 112, 359, 108),
    new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Nightsister Spirit',
    new BaseStats(24035, 28607, 3052, 1542, 1, 153, 220, 108),
    new OptimizationPlan()
  ),
  new Character(
    'Nightsister Zombie',
    new BaseStats(32201, 38428, 2502, 1808, 1, 120, 357, 158),
    new OptimizationPlan()
  ),
  new Character(
    'Nute Gunray',
    new BaseStats(26623, 14525, 2860, 1590, 1, 156, 245, 90),
    new OptimizationPlan()
  ),
  new Character(
    'Obi-Wan Kenobi (Old Ben)',
    new BaseStats(26248, 31339, 2260, 2643, 1, 118, 435, 353),
    new OptimizationPlan()
  ),
  new Character(
    'Old Daka',
    new BaseStats(28597, 21808, 2381, 3698, 1, 136, 233, 232),
    new OptimizationPlan(
      .5, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Pao',
    new BaseStats(22726, 21220, 2873, 1930, 1, 145, 211, 152),
    new OptimizationPlan()
  ),
  new Character(
    'Paploo',
    new BaseStats(32889, 38447, 2696, 2146, 1, 108, 413, 200),
    new OptimizationPlan()
  ),
  new Character(
    'Plo Koon',
    new BaseStats(25896, 22933, 2474, 3773, .5, 114, 266, 220),
    new OptimizationPlan()
  ),
  new Character(
    'Poe Dameron',
    new BaseStats(25975, 25625, 2475, 2060, 1, 150, 304, 115),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Poggle the Lesser',
    new BaseStats(28801, 20689, 2342, 4641, 1, 144, 221, 172),
    new OptimizationPlan()
  ),
  new Character(
    'Princess Leia',
    new BaseStats(24895, 15836, 2943, 1998, 1, 164, 219, 103),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Qui-Gon Jinn',
    new BaseStats(22288, 19431, 2448, 4333, .5, 145, 191, 194),
    new OptimizationPlan()
  ),
  new Character(
    'R2-D2',
    new BaseStats(32155, 29560, 2239, 3683, .5, 157, 205, 181),
    new OptimizationPlan(
      .25, // health
      0, // protection
      100, // speed
      10, // crit damage
      10, // potency
      8, // tenacity
      1, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Rebel Officer Leia Organa',
    new BaseStats(28176, 36668, 2446, 1984, 1, 152, 283, 144),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      33, // crit damage
      50, // potency
      0, // tenacity
      5, // offense
      20, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Resistance Pilot',
    new BaseStats(23448, 19400, 3047, 1754, 1, 120, 243, 98),
    new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      50, // crit damage
      20, // potency
      0, // tenacity
      2, // offense
      75, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Resistance Trooper',
    new BaseStats(24442, 18525, 2647, 1892, 1, 134, 211, 144),
    new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      50, // crit damage
      30, // potency
      0, // tenacity
      1, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Rey (Jedi Training)',
    new BaseStats(28508, 33993, 2703, 1991, 1, 140, 336, 90),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      100, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      100, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Rey (Scavenger)',
    new BaseStats(23076, 16639, 2699, 1758, 1, 164, 209, 146),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Rose Tico',
    new BaseStats(24272, 28882, 2481, 2286, .5, 141, 289, 104),
    new OptimizationPlan()
  ),
  new Character(
    'Royal Guard',
    new BaseStats(32248, 38614, 2608, 1921, 1, 110, 371, 313),
    new OptimizationPlan()
  ),
  new Character(
    'Sabine Wren',
    new BaseStats(26240, 28240, 2545, 1732, 1, 151, 285, 125),
    new OptimizationPlan(
      .1, // health
      .05, // protection
      100, // speed
      50, // crit damage
      10, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Savage Opress',
    new BaseStats(28749, 30556, 3004, 1843, 1, 123, 294, 149),
    new OptimizationPlan()
  ),
  new Character(
    'Scarif Rebel Pathfinder',
    new BaseStats(35234, 41802, 2515, 1969, 1, 121, 416, 359),
    new OptimizationPlan()
  ),
  new Character(
    'Shoretrooper',
    new BaseStats(32620, 43305, 2790, 2230, 1, 117, 334, 265),
    new OptimizationPlan(
      .4, // health
      .2, // protection
      100, // speed
      0, // crit damage
      10, // potency
      20, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Sith Assassin',
    new BaseStats(26311, 25172, 2881, 1557, 1, 151, 212, 111),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      0, // crit damage
      33, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Sith Marauder',
    new BaseStats(29238, 34972, 2604, 1947, 1, 142, 237, 95),
    new OptimizationPlan()
  ),
  new Character(
    'Sith Trooper',
    new BaseStats(32551, 39372, 2941, 2026, 1, 95, 322, 238),
    new OptimizationPlan(
      .4, // health
      .2, // protection
      100, // speed
      0, // crit damage
      0, // potency
      4, // tenacity
      0, // offense
      0, // crit chance
      20, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Snowtrooper',
    new BaseStats(23985, 26475, 3071, 1975, 1, 118, 210, 223),
    new OptimizationPlan(
      .05, // health
      .05, // protection
      100, // speed
      20, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      75, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Stormtrooper',
    new BaseStats(27508, 33852, 2359, 1960, 1, 125, 286, 202),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      0, // potency
      4, // tenacity
      0, // offense
      0, // crit chance
      10, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Stormtrooper Han',
    new BaseStats(30484, 22350, 2118, 1692, 1, 126, 370, 150),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      20, // potency
      4, // tenacity
      0, // offense
      0, // crit chance
      3, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Sun Fac',
    new BaseStats(30916, 44240, 2386, 1915, 1, 109, 458, 218),
    new OptimizationPlan()
  ),
  new Character(
    'Talia',
    new BaseStats(26646, 20575, 2434, 3920, .5, 115, 253, 249),
    new OptimizationPlan(
      .2, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      4, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Teebo',
    new BaseStats(30035, 31136, 3066, 1930, 1, 118, 315, 196),
    new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      5, // tenacity
      0, // offense
      0, // crit chance
      5, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'TIE Fighter Pilot',
    new BaseStats(24995, 18040, 2910, 1526, 1, 170, 243, 107),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      40, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Tusken Raider',
    new BaseStats(31524, 32750, 3296, 1635, 1, 121, 353, 104),
    new OptimizationPlan()
  ),
  new Character(
    'Tusken Shaman',
    new BaseStats(31609, 28261, 2302, 3159, 1, 131, 243, 155),
    new OptimizationPlan()
  ),
  new Character(
    'Ugnaught',
    new BaseStats(28251, 19469, 2405, 3991, .5, 130, 214, 193),
    new OptimizationPlan()
  ),
  new Character(
    'URoRRuR\'R\'R',
    new BaseStats(30300, 17092, 2577, 3315, 1, 147, 229, 126),
    new OptimizationPlan()
  ),
  new Character(
    'Veteran Smuggler Chewbacca',
    new BaseStats(33412, 39840, 3251, 1521, 1, 102, 372, 181),
    new OptimizationPlan()
  ),
  new Character(
    'Veteran Smuggler Han Solo',
    new BaseStats(26054, 31152, 2520, 1946, 1, 145, 239, 205),
    new OptimizationPlan()
  ),
  new Character(
    'Visas Marr',
    new BaseStats(28028, 33287, 2345, 2241, 1, 126, 246, 137),
    new OptimizationPlan()
  ),
  new Character(
    'Wampa',
    new BaseStats(29260, 34998, 3160, 1667, 1, 127, 263, 117),
    new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      40, // crit damage
      25, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  ),
  new Character(
    'Wedge Antilles',
    new BaseStats(16452, 18177, 2580, 2316, 1, 110, 271, 267),
    new OptimizationPlan(
      .2, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy,
      0, // crit avoidance
      true
    )
  ),
  new Character(
    'Wicket',
    new BaseStats(25913, 30987, 2496, 1550, 1, 146, 315, 226),
    new OptimizationPlan()
  ),
  new Character(
    'Zam Wesell',
    new BaseStats(26032, 19080, 2664, 1689, 1, 163, 208, 148),
    new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      1, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    )
  )
];

const characters = {};

for (let character of charactersArray) {
  characters[character.name] = character;
}

Object.freeze(characters);

export default characters;
