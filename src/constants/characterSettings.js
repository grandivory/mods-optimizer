// @flow

import OptimizationPlan from "../domain/OptimizationPlan";
import optimizationStrategy from "./optimizationStrategy";
import { CharacterSettings, DamageType } from "../domain/CharacterDataClasses";
import TargetStat from "../domain/TargetStat";

const characterSettings = {
  '50RT': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 20, 0, 0, 0, 0, 25, 0, 0, 0, true)]
  ),
  'C3POCHEWBACCA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 80, 10, 0, 50, 0, 25, 0, 0, 0, 0, true)]
  ),
  'AAYLASECURA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 75, 0, 10, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'ADMINISTRATORLANDO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 25, 0, 75, 0, 0, 0, 0, true)]
  ),
  'ADMIRALACKBAR': new CharacterSettings(
    [
      new OptimizationPlan('Survivability', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed
    ],
    ['AA', 'Snackbar', 'ABC']
  ),
  'ADMIRALPIETT': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0, true)]
  ),
  'ADMIRALRADDUS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Protection', 10, 20, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Protection w/ Primaries', 10, 20, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true, {
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %"
      }),
      new OptimizationPlan('Health', 20, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Health w/ Primaries', 20, 10, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
    ],
    [],
    DamageType.special
  ),
  'AHSOKATANO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 0, 100, 50, 0, 0, 25, 0, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 0, 100, 50, 0, 0, 25, 0, 10, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %"
      }),
      new OptimizationPlan('Padme Lead', 10, 0, 100, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow Damage', 25, 0, 0, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Snips']
  ),
  'AMILYNHOLDO': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 50, 25, 0, 0, 0, 5, 5, 0, 0, true)],
    ['Hodor'],
    DamageType.mixed
  ),
  'ANAKINKNIGHT': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 75, 25, 0, 25, 0, 80, 0, 0, 0, 0, true),
      new OptimizationPlan('Padme Lead', 10, 0, 80, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0, true),
      new OptimizationPlan('oQGJ Lead', 0, 0, 100, 100, 10, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Chex Mix', 0, 0, 50, 0, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 20, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow Damage', 25, 0, 0, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 0, 0, 0, 100, 20, 0, 40, 0, 25, 0, 0, 0, 0, true)
    ],
    ['JKA']
  ),
  'APPO': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 50, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, true)],
    ["Vader's Fist"]
  ),
  'ARCTROOPER501ST': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 0, 0, 50, 0, 15, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM', 10, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM/CA', 10, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 100, true),
    ]
  ),
  'ARMORER': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'ASAJVENTRESS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 10, 20, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 25, 25, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 15, 0, 50, 100, 0, 0, 30, 30, 0, 0, 0, 0, 0, true)
    ],
    ['AV', 'Zen', 'NS', 'hSTR NS', 'ABC'],
    DamageType.mixed
  ),
  'AURRA_SING': new CharacterSettings(
    [
      new OptimizationPlan('hSTR Phase 3', 0, 0, 75, 100, 0, 0, 50, 0, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP', 0, 0, 100, 80, 20, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'BADBATCHECHO': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('PvP')]
  ),
  'BADBATCHHUNTER': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0, true)]
  ),
  'BADBATCHOMEGA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 50, 0, 25, 0, 100, 0, 0, 0, 0, 0, 0, true)]
  ),
  'BADBATCHTECH': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('PvP')],
    [],
    DamageType.special
  ),
  'BADBATCHWRECKER': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 30, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'B1BATTLEDROIDV2': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, true)]
  ),
  'B2SUPERBATTLEDROID': new CharacterSettings(
    [
      new OptimizationPlan('Survival', 50, 50, 0, 0, 50, 25, 0, 0, 0, 0, 0, 50, 0, true),
      new OptimizationPlan('Tenacity', 50, 50, 0, 0, 50, 100, 0, 0, 0, 0, 0, 0, 100, true),
      new OptimizationPlan('Potency', 50, 50, 0, 0, 100, 50, 0, 0, 0, 0, 0, 0, 100, true)
    ]
  ),
  'BARRISSOFFEE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 70, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 75, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'BASTILASHAN': new CharacterSettings(
    [
      new OptimizationPlan('Leader', 10, 0, 100, 0, 50, 0, 0, 25, 0, 0, 0, 0, 0, true),
      optimizationStrategy["Special Damage with Potency"].rename('Non-leader'),
      optimizationStrategy["Special Damage"].rename('JKR Lead'),
      new OptimizationPlan('hSTR P2 Jedi', 0, 0, 100, 50, 0, 0, 0, 25, 50, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'BASTILASHANDARK': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Offensive', 0, 0, 100, 50, 5, 0, 0, 25, 0, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'BATCHERS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 30, 50, 10, 0, 20, 0, 10, 0, 0, 0, 0, true)],
    ['New Batch']
  ),
  'BAYLANSKOLL': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ]
  ),
  'BAZEMALBUS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 50, 0, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 50, 0, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "circle": "Health %",
        "cross": "Health %"
      }),
      new OptimizationPlan('PvP Slow', 50, 0, 20, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('PvP Slow w/ Primaries', 50, 0, 20, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "circle": "Health %",
        "cross": "Health %"
      }),
      new OptimizationPlan('Slow Tank', 50, 50, 0, 0, 10, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 10, 10, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Rogue 1', 'Chaze', 'Chiggs']
  ),
  'BB8': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 5, 100, 0, 0, 10, 0, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 10, -5, 100, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed,
      new OptimizationPlan('Tanky', 5, 25, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['bb8', 'Wampanader', 'ABC']
  ),
  'BENSOLO': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 100, 0, 10, 0, 0, 70, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'BIGGSDARKLIGHTER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Wiggs', 'Chiggs']
  ),
  'BISTAN': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Rogue 1', 'SuperStar2D2']
  ),
  'BOBAFETT': new CharacterSettings(
    [
      new OptimizationPlan('PvE', 0, 0, 50, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 100, 75, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 20, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'BOBAFETTSCION': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true)
    ]
  ),
  'BODHIROOK': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1']
  ),
  'BOKATAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 0, 50, 0, 0, 0, 0, true)]
  ),
  'BOOMADIER': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 3, 100, 9, 3, 10, 25, 10, 0, 2, 2, 3, 3, true)]
  ),
  'BOSSK': new CharacterSettings(
    [
      new OptimizationPlan('Leader', 10, 10, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-leader', 10, 0, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'BOSSNASS': new CharacterSettings(
    [new OptimizationPlan('PvP', 4, 22, 100, 0, 28, 15, 2, 3, 2, 2, 2, 0, 0, true)]
  ),
  'BOUSHH': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 0, 100, 0, 10, 0, 0, 20, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 5, 0, 100, 0, 10, 0, 0, 20, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 5, 0, 100, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %"
      }, {
        "speed": 1,
        "potency": 1
      })
    ],
    [],
    DamageType.special
  ),
  'BT1': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 5, 0, 80, 0, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 0, 0, 100, 50, 5, 0, 50, 0, 10, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Critical Damage %",
        "cross": "Offense %"
      })
    ]
  ),
  'C3POLEGENDARY': new CharacterSettings(
    [
      optimizationStrategy["Speedy debuffer"],
      optimizationStrategy.Speed,
      new OptimizationPlan('hSTR Phase 1', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Anti-Malak', 10, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'CADBANE': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
  ),
  'CALKESTIS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 40, 0, 0, 0, -10, 15, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }, {
        "health": 2,
        "defense": 1
      })
    ]
  ),
  'CANDEROUSORDO': new CharacterSettings(
    [
      new OptimizationPlan('Maul Lead', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    ]
  ),
  'CAPTAINDROGAN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 10, 0, 100, 0, 10, 10, 0, 70, 20, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %",
        "circle": "Health %"
      }, {
        "offense": 1,
        "health": 1
      })
    ],
    [],
    DamageType.special
  ),
  'CAPTAINENOCH': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 20, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 10, 20, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 10, 20, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }, {
        "speed": 1,
        "defense": 1,
      }),
    ],
  ),
  'CAPTAINREX': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Chance %",
        "cross": "Potency %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 0, 100, 0, 60, 10, 0, 0, 100, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Chance %",
        "cross": "Potency %",
        "circle": "Health %"
      }, {
        "potency": 1,
        "critchance": 1,
        "health": 1
      })
    ]
  ),
  'CAPTAINTARPALS': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 3, 100, 9, 3, 10, 25, 10, 0, 2, 2, 3, 3, true)]
  ),
  'CARADUNE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 80, 100, 20, 0, 25, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Mothma Lead', 10, 10, 100, 0, 20, 20, 5, 0, 0, 5, 0, 0, 0, true)
    ]
  ),
  'CARTHONASI': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
  ),
  'CASSIANANDOR': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('AdRad', 10, 20, 100, 0, 25, 0, 0, 10, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('AdRad w/ Primaries', 10, 20, 100, 0, 25, 0, 0, 10, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Chance %",
        "cross": "Potency %",
        "circle": "Protection %"
      }),
    ],
    ['Rogue 1', 'SuperStar2D2'],
    DamageType.mixed
  ),
  'CC2224': new CharacterSettings(
    [
      new OptimizationPlan('Leader', 0, 0, 100, 50, 25, 0, 25, 0, 50, 12.5, 12.5, 0, 0, true),
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Non-leader')
    ],
    ['zody'],
    DamageType.mixed
  ),
  'CEREJUNDA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 40, 15, 20, 0, 0, 10, 10, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }, {
        "health": 2,
        "defense": 1
      })
    ]
  ),
  'CHEWBACCALEGENDARY': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('Tenacity', 25, 25, 100, 0, 0, 80, 10, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Chew Mix', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 75, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Chex Mix']
  ),
  'CHIEFCHIRPA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 12, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }, {
        "speed": 1,
        "health": 1
      }),
      optimizationStrategy.Speed.rename('Speed'),
      new OptimizationPlan('Speed w/ Primaries', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Chance %",
        "cross": "Protection %",
        "circle": "Protection %"
      })
    ],
    ['Murderbears']
  ),
  'CHIEFNEBIT': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Detonator', 60, 60, 100, 0, 0, 0, 0, 0, 0, 50, 0, 0, 25, true)
    ],
    ['nebs']
  ),
  'CHIRRUTIMWE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 20, 25, 0, 50, 0, 0, 0, 0, true),
      optimizationStrategy["Speedy Chex Mix"].rename('Chex Mix')
    ],
    ['Rogue 1', 'Chaze', 'Chiggs', 'Chex Mix']
  ),
  'CHOPPERS3': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "cross": "Tenacity %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 50, 0, 100, 0, 20, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "cross": "Tenacity %",
        "circle": "Health %"
      }, {
        "health": 3
      })
    ]
  ),
  'CLONESERGEANTPHASEI': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Sarge']
  ),
  'CLONEWARSCHEWBACCA': new CharacterSettings(
    [new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['CWC']
  ),
  'COLONELSTARCK': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 10, 5, 0, 5, 0, 5, 0, 0, 0, 0)],
    ['Tony Stark', 'Troopers']
  ),
  'COMMANDERAHSOKA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 0, 100, 50, 0, 0, 0, 30, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Health', 10, 0, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Crit.Dmg', 5, 0, 25, 100, 0, 0, 0, 30, 0, 0, 0, 0, 0, true)
    ],
    ['CAT'],
    DamageType.special
  ),
  'COMMANDERLUKESKYWALKER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Chewpio', 10, 10, 100, 0, 10, 50, 50, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy["Speedy Chex Mix"].rename('Chex Mix'),
      new OptimizationPlan('Raids', 0, 0, 100, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow and Strong', 0, 0, 0, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true)
    ],
    ['CLS', 'Wampanader', 'Chex Mix', 'ABC', 'Titans']
  ),
  'CORUSCANTUNDERWORLDPOLICE': new CharacterSettings(
    [new OptimizationPlan('Why?', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['CUP']
  ),
  'COUNTDOOKU': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 50, 25, 25, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.mixed
  ),
  'CROSSHAIRS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 40, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)],
    ['New Batch']
  ),
  'CT5555': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 30, 50, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM', 30, 15, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM/CA', 30, 15, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, true)
    ]
  ),
  'CT7567': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 0, 100, 0, 5, 10, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM', 10, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed.rename('Chex Mix')
    ],
    ['Titans']
  ),
  'CT210408': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 50, 0, 75, 75, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 0, 0, 50, 100, 0, 0, 75, 75, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM', 5, 0, 50, 100, 0, 0, 20, 20, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM/CA', 5, 0, 50, 100, 0, 0, 20, 20, 50, 0, 0, 0, 100, true)
    ],
    [],
    DamageType.mixed
  ),
  'DAKA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 0, 25, 15, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 75, 0, 100, 0, 30, 15, 0, 0, 0, 0, 0, 0, 100, true),
      new OptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 50, 0, 75, 0, 15, 0, 5, 0, 0, 0, 0, 0, 0, true)
    ],
    ['NS', 'hSTR NS']
  ),
  'DARKREY': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Health', 25, 0, 100, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, true,
        {
          "arrow": "Health %",
          "triangle": "Health %",
          "cross": "Health %",
          "circle": "Health %"
        },
        {
          "health": 1,
          "speed": 1
        }
      )
    ]
  ),
  'DARKTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 50, 0, 0, 5, 60, 0, 0, 2.5, 2.5, 0, 0, true)]
  ),
  'DARTHBANE': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 3, 100, 9, 3, 10, 25, 10, 0, 2, 2, 3, 3, true)]
  ),
  'DARTHMALAK': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 50, 100, 0, 10, 0, 10, 0, 0, 10, 0, 0, 0, true),
      new OptimizationPlan('Tenacity', 0, 50, 100, 0, 10, 100, 10, 0, 0, 10, 0, 0, 0, true)
    ]
  ),
  'DARTHMALGUS': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 10, 100, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, true)]
  ),
  'DARTHNIHILUS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 30, 0, 100, 0, 50, 60, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 40, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 100, true)
    ],
    ['Nightmare'],
    DamageType.special
  ),
  'DARTHREVAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 0, 100, 50, 5, 0, 0, 10, 5, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'DARTHSIDIOUS': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 50, 0, 0, 0, 0, 0, 0)],
    ['Auto Lightzader']
  ),
  'DARTHSION': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 30, 100, 0, 5, 0, 0, 0, 0, 20, 0, 0, 0, true),
      new OptimizationPlan('PvP/CA', 25, 30, 100, 0, 5, 0, 0, 0, 0, 20, 0, 0, 100, true)
    ],
    ['Nightmare']
  ),
  'DARTHTALON': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 25, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'DARTHTRAYA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 10, 100, 0, 5, 0, 0, 15, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 25, 75, 65, 0, 0, 65, 0, 0, 0, 0, 0, 0, 100, true)
    ],
    [],
    DamageType.special
  ),
  'DASHRENDAR': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 0, 100, 60, 5, 0, 50, 0, 10, 0, 0, 0, 0, true)]
  ),
  'DATHCHA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      new OptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100, true)
    ],
    [],
    DamageType.mixed
  ),
  'DEATHTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Iden Lead', 10, 10, 100, 100, 40, 0, 25, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true, {}, {},
        [new TargetStat('Speed', '+', 175, 179)]
      )
    ],
    ['Troopers', 'Chex Mix']
  ),
  'DEATHTROOPERPERIDEA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 24, 100, 10, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries & Sets', 0, 0, 24, 100, 10, 0, 0, 0, 0, 0, 0, 0, 0, true, {
          "arrow": "Speed",
          "triangle": "Critical Damage %",
          "cross": "Offense %"
        }, {
          "critdamage": 1,
        },
      ),
    ],
  ),
  'DENGAR': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 60, 0, 0, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'DIRECTORKRENNIC': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Special Damage, Potency"].rename('PvP')],
    ['Imperial Grancor Maneuver'],
    DamageType.special
  ),
  'DISGUISEDCLONETROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 20, 100, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, true)],
    ["Vader's Fist"]
  ),
  'DOCTORAPHRA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 90, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'DROIDEKA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 10, 0, 0, 10, 20, 100, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Maul Kickstarter', 0, 5, 100, 0, 5, 5, 20, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'EETHKOTH': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Special Damage, Potency"].rename('PvP')],
    [],
    DamageType.mixed
  ),
  'EIGHTHBROTHER': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 50, 0, 0, 30, 0, 5, 0, 0, 0, 0, true)]
  ),
  'EMBO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 20, 100, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 50, 25, 0, 0, 75, 0, 100, 0, 0, 0, 0, true)
    ]
  ),
  'EMPERORPALPATINE': new CharacterSettings(
    [
      optimizationStrategy["Special Damage with Potency"].rename('PvP'),
      new OptimizationPlan('Tanky', 0, 100, 70, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, true),
    ],
    ['EP', 'Palp', 'EzPz', 'Nightmare'],
    DamageType.special
  ),
  'ENFYSNEST': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 50, 25, 100, 10, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Speedy', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Offense'),
      new OptimizationPlan('Tenacity', 10, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 25, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Nesty', 'Baby Wampa', 'solo']
  ),
  'EPIXFINN': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 0, 25, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'EPIXPOE': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 0, 20, 20, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'EWOKELDER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Tenacity %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 25, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Tenacity %",
        "circle": "Health %"
      }, {
        "health": 3
      })
    ],
    ['EE', 'Murderbears']
  ),
  'EWOKSCOUT': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, true, {
        "triangle": "Offense %",
        "cross": "Potency %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 15, 0, 100, 0, 50, 0, 50, 0, 20, 0, 0, 0, 0, true, {
        "triangle": "Offense %",
        "cross": "Potency %",
        "circle": "Health %"
      }, {
        "offense": 1,
        "potency": 1
      }),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Murderbears']
  ),
  'EZRABRIDGERS3': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 5, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %"
      }),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 75, 0, 75, 0, 0, 0, 0, true)
    ]
  ),
  'EZRAEXILE': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 10, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'FENNECSHAND': new CharacterSettings(
    [
      new OptimizationPlan('PvP - Offense', 0, 0, 100, 0, 0, 0, 0, 75, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP - Crit.Dmg', 0, 0, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'FIFTHBROTHER': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'FINN': new CharacterSettings(
    [
      optimizationStrategy["Slow Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('Tanky', 30, 100, 100, 0, 5, 5, 50, 0, 0, 10, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 0, -5, 80, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0, true)
    ],
    ['Zinn']
  ),
  'FIRSTORDEREXECUTIONER': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true)],
    ['Fox', 'Panda', 'Foe', 'FO']
  ),
  'FIRSTORDEROFFICERMALE': new CharacterSettings(
    [optimizationStrategy.Speed.rename('Speed')],
    ['Foo', 'FO']
  ),
  'FIRSTORDERSPECIALFORCESPILOT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Mixed Damage, Potency"].rename('PvP')],
    ['SFTP', 'FO'],
    DamageType.mixed
  ),
  'FIRSTORDERTIEPILOT': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 100, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0, true)],
    ['FOTP', 'FO']
  ),
  'FIRSTORDERTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 30, 40, 100, 0, 0, 10, 0, 0, 0, 30, 0, 0, 0, true)],
    ['FOST', 'FO']
  ),
  'FOSITHTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 25, 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 40, 0, 100, 50, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'FULCRUMAHSOKA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('Omicron', 10, 0, 50, 100, 0, -30, 75, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Omicron w/ Primaries', 10, 0, 50, 0, 0, -30, 100, 0, 50, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Critical Damage %",
        "cross": "Offense %"
      }),
    ],
    ['ATF', 'FAT']
  ),
  'GAMORREANGUARD': new CharacterSettings(
    [new OptimizationPlan('PvP', 75, 0, 100, 0, 75, 100, 0, 0, 0, 50, 0, 0, 0, true)],
    ['Piggy']
  ),
  'GARSAXON': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Offense %"
      }, {
        "offense": 1,
        "potency": 1
      })
    ]
  ),
  'GENERALHUX': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 15, true)],
    [],
    DamageType.special
  ),
  'GENERALKENOBI': new CharacterSettings(
    [
      new OptimizationPlan('Speedy Tank', 25, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('Balanced', 50, 100, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('Slow Tank', 50, 100, 0, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('Padme Lead', 100, 0, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('JMK Lead', 100, 0, 0, 0, 0, 50, 0, 0, 0, 50, 0, 0, 0, true),
      new OptimizationPlan('hSTR P2 Jedi', 0, 100, 50, 0, 0, 0, 10, 0, 25, 100, 0, 0, 0, true)
    ],
    ['GK', 'Titans']
  ),
  'GENERALSKYWALKER': new CharacterSettings(
    [
      new OptimizationPlan('PvP - Defense', 10, 25, 100, 0, 20, 0, 10, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('PvP - Offense', 0, 0, 100, 100, 20, 0, 20, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP - Parry', 0, 75, 100, 0, 25, 0, 50, 0, 0, 10, 0, 0, 0, true)
    ],
    ['GAS']
  ),
  'GENERALSYNDULLA': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 10, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'GEONOSIANBROODALPHA': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 20, 20, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Offense', 0, 0, 100, 50, 0, 10, 20, 0, 20, 0, 0, 0, 0, true)
    ]
  ),
  'GEONOSIANSOLDIER': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 80, 90, 0, 0, 50, 0, 100, 0, 0, 0, 0, true)]
  ),
  'GEONOSIANSPY': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')]
  ),
  'GLAHSOKATANO': new CharacterSettings(
    [new OptimizationPlan('PvP', 15, 0, 100, 0, 0, 0, 0, 0, 0, 18, 18, 0, 0, true)]
  ),
  'GLLEIA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "circle": "Health %",
        "cross": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 15, 100, 0, 15, 0, 5, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "circle": "Health %",
        "cross": "Health %"
      }, {
        "speed": 1
      })
    ],
    ['Murderbears']
  ),
  'GLREY': new CharacterSettings(
    [
      new OptimizationPlan('PvP - Health', 50, 0, 100, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP - Offense', 15, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'GRANDADMIRALTHRAWN': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 20, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans'],
    DamageType.special
  ),
  'GRANDINQUISITOR': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 50, 0, 0, 30, 0, 5, 0, 0, 0, 0, true)]
  ),
  'GRANDMASTERLUKE': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 25, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['GMLS', 'JMLS', 'GLLS'],
    DamageType.special
  ),
  'GRANDMASTERYODA': new CharacterSettings(
    [
      new OptimizationPlan('Speedy', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Offense', 0, 0, 50, 100, 0, 0, 0, 100, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Health', 20, 0, 100, 0, 5, 0, 0, 20, 5, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Yodalicious', 0, -5, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P2 Bastila', 0, 0, 60, 100, 0, 0, 0, 75, 80, 0, 0, 0, 0, true)
    ],
    ['GMY'],
    DamageType.special
  ),
  'GRANDMOFFTARKIN': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 15, 15, 50, 0, 0, 0, 0, true)],
    ['GMT', 'Auto Lightzader', 'Imperial Grancor Maneuver'],
    DamageType.mixed
  ),
  'GREATMOTHERS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 16, true),
      new OptimizationPlan('PvP w/ Primaries & Sets', 10, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 16, true, {
          "triangle": "Health %",
          "cross": "Health %",
          "circle": "Health %",
        }, {
          "health": 1,
          "speed": 1,
        },
      ),
    ],
    ['NS'],
    DamageType.special
  ),
  'GREEDO': new CharacterSettings(
    [
      new OptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {}, {},
        [new TargetStat('Speed', '+', 170, 174)]
      )
    ]
  ),
  'GREEFKARGA': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 0, 5, 10, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'GRIEVOUS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 100, 0, 80, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Fast', 20, 0, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['GG']
  ),
  'GUNGANPHALANX': new CharacterSettings(
    [new OptimizationPlan('PvP', 12, 44, 100, 0, 15, 0, 0, 0, 0, 5, 5, 0, 0, true)]
  ),
  'HANSOLO': new CharacterSettings(
    [
      new OptimizationPlan('Fast Han', 0, 0, 100, 100, 10, 0, 25, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow Han', 0, 0, 0, 100, 25, 0, 50, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-relic', 0, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Chex Mix', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {}, {},
        [new TargetStat('Speed', '+', 170, 174)]
      )
    ],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans']
  ),
  'HERASYNDULLAS3': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %"
      }, {
        "speed": 1,
        "health": 1
      })
    ]
  ),
  'HERMITYODA': new CharacterSettings(
    [optimizationStrategy.Speed],
    ['Hyoda', 'Hoboda', 'Hobo', 'HY'],
    DamageType.mixed
  ),
  'HK47': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 75, 0, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'HONDO': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 5, 100, 75, 0, 0, 0, 75, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'HOTHHAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['CHS', 'CHolo', 'Snolo', 'Hoth Han']
  ),
  'HOTHLEIA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 25, 0, 30, 0, 0, 0, 0, true)],
    ['ROLO']
  ),
  'HOTHREBELSCOUT': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      new OptimizationPlan('Mothma Lead', 5, 10, 100, 0, 5, 5, 75, 0, 100, 5, 0, 0, 0, true)
    ],
    ['HRS', 'Hoth Bros']
  ),
  'HOTHREBELSOLDIER': new CharacterSettings(
    [new OptimizationPlan('PvE', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['HRS', 'Hoth Bros']
  ),
  'HUMANTHUG': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
  ),
  'HUNTERS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 20, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['New Batch']
  ),
  'HUYANG': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 100, 50, 0, 0, 25, 0, 10, 0, 0, 0, 0, true)]
  ),
  'IDENVERSIOEMPIRE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 50, 0, 25, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Wampa Slayer', 0, 0, 100, 30, 100, 0, 10, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'IG11': new CharacterSettings(
    [new OptimizationPlan('Tanky', 25, 0, 50, 0, 0, 10, 5, 0, 5, 5, 5, 0, 0, true)]
  ),
  'IG12': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 5, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "health": 1,
        "speed": 1,
      })
    ]
  ),
  'IG86SENTINELDROID': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')]
  ),
  'IG88': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('Damage'),
      new OptimizationPlan('Nuke', 0, 0, 100, 25, 50, 0, 25, 0, 75, 0, 0, 0, 0, true)
    ]
  ),
  'IMAGUNDI': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['IGD']
  ),
  'IMPERIALPROBEDROID': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Offense', 0, 0, 100, 80, 50, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 50, 50, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['IPD']
  ),
  'IMPERIALSUPERCOMMANDO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Offense %",
        "circle": "Protection %",
        "cross": "Offense %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 0, 15, 100, 0, 20, 0, 100, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Offense %",
        "circle": "Protection %",
        "cross": "Offense %"
      }, {
        "offense": 1
      })
    ],
    ['ISC']
  ),
  'JANGOFETT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
  ),
  'JABBATHEHUTT': new CharacterSettings(
    [new OptimizationPlan('PvP', 15, 0, 100, 0, 25, 50, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'JARJARBINKS': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 20, 100, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'JAWA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Mixed Damage, Potency"].rename('PvE'),
      new OptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100, true),
    ],
    [],
    DamageType.mixed
  ),
  'JAWAENGINEER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 0, 50, 10, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Detonator', 20, 10, 100, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, true),
    ],
    [],
    DamageType.mixed
  ),
  'JAWASCAVENGER': new CharacterSettings(
    [
      new OptimizationPlan('PvE', 0, 0, 100, 25, 50, 0, 25, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('Detonator', 100, 100, 0, 0, 0, 0, 0, 0, 0, 80, 0, 0, 100, true),
    ]
  ),
  'JEDIKNIGHTCAL': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 25, 0, 0, 75, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 25, 0, 100, 25, 0, 0, 75, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "circle": "Health %",
        "cross": "Offense %",
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 25, 0, 100, 25, 0, 0, 75, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "circle": "Health %",
        "cross": "Offense %",
      }, {
        "health": 1,
        "offense": 1
      }),
      new OptimizationPlan('PvP Debuffer', 5, 0, 100, 0, 35, 0, 20, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP Debuffer w/ Primaries', 5, 0, 100, 0, 35, 0, 20, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Potency %",
        "circle": "Health %",
      }),
      new OptimizationPlan('PvP Debuffer w/ Primaries & Sets', 5, 0, 100, 0, 35, 0, 20, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Potency %",
        "circle": "Health %",
      }, {
        "potency": 1
      })
    ],
    ['JKCK']
  ),
  'JEDIKNIGHTCONSULAR': new CharacterSettings(
    [new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['JC'],
    DamageType.mixed
  ),
  'JEDIKNIGHTGUARDIAN': new CharacterSettings(
    [new OptimizationPlan('PvE', 40, 20, 100, 0, 50, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['JKG']
  ),
  'JEDIKNIGHTLUKE': new CharacterSettings(
    [
      new OptimizationPlan('Leader', 5, 5, 0, 100, 25, 0, 50, 0, 15, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-leader', 5, 5, 25, 100, 25, 0, 50, 0, 15, 0, 0, 0, 0, true)
    ],
    ['JKL']
  ),
  'JEDIKNIGHTREVAN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 0, 10, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Health', 10, 0, 100, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'JEDIMASTERKENOBI': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 0, 100, 25, 0, 0, 10, 0, 0, 0, 0, 0, 0, true)],
    ['JMK']
  ),
  'JOCASTANU': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 50, 100, 10, 0, 0, 30, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'JOLEEBINDO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 50, 0, 75, 0, 0, 100, 0, 0, 0, 0, 0, 0, 100, true),
      new OptimizationPlan('Health and Speed', 100, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Healer', 30, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'JUHANI': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 100, 90, 0, 5, 0, 0, 0, 0, 15, 0, 0, 0, true)]
  ),
  'JYNERSO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0, true),
      new OptimizationPlan('AdRad', 10, 0, 100, 100, 25, 0, 20, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('AdRad w/ Primaries', 10, 0, 100, 0, 25, 0, 20, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %"
      }),
    ],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2']
  ),
  'K2SO': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('AdRad', 20, 40, 50, 0, 50, 50, 0, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('AdRad w/ Primaries', 20, 40, 50, 0, 50, 50, 0, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Tenacity %",
        "circle": "Protection %"
      }),
    ],
    ['Rogue 1', 'Cass-2SO', 'K2']
  ),
  'KANANJARRUSS3': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 40, 0, 100, 0, 0, 0, 10, 0, 30, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }, {
        "health": 2,
        "tenacity": 1
      })
    ]
  ),
  'KELLERANBEQ': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Protection %",
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }, {
        "health": 3,
      })
    ]
  ),
  'KIADIMUNDI': new CharacterSettings(
    [
      new OptimizationPlan('Balanced', 10, 10, 100, 50, 20, 0, 50, 0, 25, 10, 10, 0, 0, true),
      new OptimizationPlan('Offense', 0, 0, 100, 50, 20, 0, 75, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Defense', 20, 20, 100, 0, 20, 10, 0, 0, 0, 15, 15, 0, 0, true)
    ]
  ),
  'KITFISTO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE')],
    ['Fisty', 'Fister']
  ),
  'KRRSANTAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 30, 30, 100, 0, 10, 10, 0, 0, 0, 25, 0, 0, 0, true)]
  ),
  'KUIIL': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'KYLEKATARN': new CharacterSettings(
    [new OptimizationPlan('Mothma Lead', 5, 0, 100, 0, 5, 5, 50, 0, 0, 5, 0, 0, 0, true)]
  ),
  'KYLOREN': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 25, 0, 25, 0, 0, 0, 0, true)],
    ['Old Kylo', 'zylo', 'FO']
  ),
  'KYLORENUNMASKED': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 75, 50, 100, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 100, 100, 50, 0, 0, 75, 0, 0, 0, 37.5, 37.5, 0, 0, true),
      new OptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['kru', 'matt', 'Snape', 'FO']
  ),
  'L3_37': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 40, 20, 50, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('Speedy', 40, 20, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)
    ],
    ['solo']
  ),
  'LOBOT': new CharacterSettings(
    [new OptimizationPlan('PvE', 0, 0, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'LOGRAY': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 10, 0, 100, 40, 50, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %"
      }, {
        "potency": 1,
        "health": 2
      }),
      new OptimizationPlan('hSTR Phase 2', 5, 5, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Murderbears']
  ),
  'LORDVADER': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 15, 100, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, true)]
  ),
  'LUKESKYWALKER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['farmboi']
  ),
  'LUMINARAUNDULI': new CharacterSettings(
    [new OptimizationPlan('PvE', 40, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'LUTHENRAEL': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 10, 100, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Luthen'],
    DamageType.mixed
  ),
  'MACEWINDU': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 0, 100, 0, 50, 0, 0, 50, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow/Tanky', 100, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'MAGMATROOPER': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      new OptimizationPlan('Anti-Traya', 0, 0, 25, 25, 50, 0, 25, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'MAGNAGUARD': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 30, 30, 100, 0, 20, 20, 0, 0, 0, 25, 0, 0, 100, true),
      new OptimizationPlan('Balanced', 20, 20, 100, 25, 50, 25, 25, 0, 25, 12.5, 12.5, 0, 0, true)
    ]
  ),
  'MANDALORBOKATAN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 80, 0, 0, 0, 100, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 10, 0, 80, 0, 0, 0, 100, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Offense %",
        "cross": "Offense %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 10, 0, 80, 0, 0, 0, 100, 0, 0, 12.5, 12.5, 0, 0, true, {
        "arrow": "Offense %",
        "triangle": "Offense %",
        "cross": "Offense %",
        "circle": "Health %"
      }, {
        "offense": 1
      })
    ]
  ),
  'MARAJADE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 10, 100, 25, 25, 0, 0, 25, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('Survivability', 0, 10, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'MARROK': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'MASTERQUIGON': new CharacterSettings(
    [new OptimizationPlan('PvP', 15, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['MQG', 'Quadme', 'Queeni'],
    DamageType.special
  ),
  'MAUL': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')]
  ),
  'MAULS7': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 25, 100, 0, 15, 0, 50, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('DS Mando', 0, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'MERRIN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 15, 0, 0, 0, 100, 0, 0, 40, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %",
        "circle": "Health %"
      }, {
        "potency": 3
      }),
      new OptimizationPlan('Tenacity', 15, 0, 0, 0, 20, 60, 0, 30, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Tenacity w/ Primaries', 15, 0, 0, 0, 20, 60, 0, 30, 0, 0, 0, 0, 0, true, {
        "cross": "Tenacity %",
        "circle": "Health %"
      }),
      new OptimizationPlan('Tenacity w/ Primaries & Sets', 15, 0, 0, 0, 0, 60, 0, 30, 0, 0, 0, 0, 0, true, {
        "cross": "Tenacity %",
        "circle": "Health %"
      }, {
        "tenacity": 2,
        "potency": 1
      })
    ],
    [],
    DamageType.special
  ),
  'MISSIONVAO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0, true)]
  ),
  'MOFFGIDEONS1': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'MOFFGIDEONS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 3, 20, 100, 0, 4, 3, 2, 3, 4, 4, 4, 0, 0, true)]
  ),
  'MONMOTHMA': new CharacterSettings(
    [new OptimizationPlan('Leader', 5, 5, 100, 0, 0, 25, 10, 0, 0, 0, 0, 0, 0, true)],
    ['MM']
  ),
  'MORGANELSBETH': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Morgan', 'NS']
  ),
  'MOTHERTALZIN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 0, 25, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 0, 75, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, -5, 0, 0, 10, 0, 0, 100, 0, 0, 0, 0, 0, true)
    ],
    ['MT', 'NS', 'hSTR NS'],
    DamageType.special
  ),
  'NIGHTSISTERACOLYTE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 50, 80, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 100, 100, 0, 0, 100, 100, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 50, 50, 100, 0, 0, 0, 0, true)
    ],
    ['NA', 'NS'],
    DamageType.mixed
  ),
  'NIGHTSISTERINITIATE': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE'),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, true)
    ],
    ['NI', 'NS']
  ),
  'NIGHTSISTERSPIRIT': new CharacterSettings(
    [
      new OptimizationPlan('PvE', 0, 0, 100, 50, 25, 0, 75, 0, 50, 0, 0, 0, 0, true),
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 40, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['NS']
  ),
  'NIGHTSISTERZOMBIE': new CharacterSettings(
    [
      new OptimizationPlan('Strong Zombie', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Weak Zombie', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false),
      new OptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, true)
    ],
    ['NS', 'hSTR NS']
  ),
  'NIGHTTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 0, 100, 10, 0, 10, 25, 0, 0, 0, 0, 0, 0, true)],
    ['NS', 'NT']
  ),
  'NINTHSISTER': new CharacterSettings(
    [new OptimizationPlan('PvP', 40, 50, 100, 0, 0, 40, 0, 0, 0, 30, 0, 0, 0, true)]
  ),
  'NUTEGUNRAY': new CharacterSettings(
    [
      optimizationStrategy["Speed with survivability"].rename('PvP'),
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('Damage')
    ]
  ),
  'OLDBENKENOBI': new CharacterSettings(
    [new OptimizationPlan('Speed', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['OB']
  ),
  'OMEGAS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true)],
    ['New Batch'],
    DamageType.special
  ),
  'OPERATIVE': new CharacterSettings(
    [new OptimizationPlan('PvP', 40, 0, 100, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, true)],
    ["Vader's Fist"]
  ),
  'PADAWANOBIWAN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 40, 78, 5, 0, 65, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries & Sets', 0, 0, 40, 78, 5, 0, 65, 0, 0, 0, 0, 0, 0, true, {
          "triangle": "Critical Damage %",
          "cross": "Offense %",
        }, {
          "offense": 1,
          "potency": 1,
        },
    ),
    ],
    ['POW', 'Quadme', 'Queeni']
  ),
  'PADAWANSABINE': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 20, 0, 0, 25, 0, 10, 0, 0, 0, 0, true)]
  ),
  'PADMEAMIDALA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 35, 0, 100, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow', 50, 0, 0, 25, 15, 0, 10, 0, 10, 0, 0, 0, 0, true)
    ],
    ['Padme']
  ),
  'PAO': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('Mothma Lead', 10, 30, 100, 0, 5, 5, 100, 0, 0, 5, 0, 0, 0, true),
      optimizationStrategy["Speedy Chex Mix"].rename('Chex Mix')
    ],
    ['Rogue 1', 'Chex Mix']
  ),
  'PAPLOO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 0, 100, 0, 0, 10, 0, 0, 0, 5, 5, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }, {
        "health": 3
      }),
      new OptimizationPlan('Fast Tank', 25, 25, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
    ],
    ['Murderbears']
  ),
  'PAZVIZSLA': new CharacterSettings(
    [
      new OptimizationPlan('Health', 75, 50, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('Health w/ Primaries', 75, 50, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }),
      new OptimizationPlan('Health w/ Primaries & Sets', 75, 50, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %",
      }, {
        "health": 3,
      }),
      new OptimizationPlan('Protection', 50, 75, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('Protection w/ Primaries', 50, 75, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }),
      new OptimizationPlan('Protection w/ Primaries & Sets', 50, 75, 100, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, true, {
        "triangle": "Protection %",
        "cross": "Protection %",
        "circle": "Protection %",
      }, {
        "health": 3,
      })
    ]
  ),
  'PHASMA': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['FO']
  ),
  'PLOKOON': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'POE': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 10, 100, 0, 40, 20, 0, 0, 0, 5, 0, 0, 0, true)]
  ),
  'POGGLETHELESSER': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('PvE')]
  ),
  'PRINCESSKNEESAA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 20, 0, 100, 50, 40, 0, 10, 0, 80, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "cross": "Potency %",
        "circle": "Health %"
      }, {
        "potency": 1,
        "critchance": 1,
        "health": 1
      })
    ]
  ),
  'PRINCESSLEIA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0, true)
    ],
    ['Machine Gun']
  ),
  'QIRA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 10, 0, 50, 0, 25, 0, 0, 0, 0, true)],
    ['solo']
  ),
  'QUEENAMIDALA': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Quadme', 'Queeni']
  ),
  'QUIGONJINN': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Special Damage, Potency"].rename('PvP'),
      new OptimizationPlan('Omicron', 0, 0, 0, 0, 0, 0, 100, 100, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 25, 25, 50, 0, 0, 0, 0, true)
    ],
    ['QGJ'],
    DamageType.mixed
  ),
  'R2D2_LEGENDARY': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 5, 100, 0, 25, 10, 0, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 10, -5, 100, 25, 25, 0, 25, 0, 50, 0, 0, 0, 0, true)
    ],
    ['Trashcan', 'R2z2', 'SuperStar2D2'],
    DamageType.mixed
  ),
  'RANGETROOPER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Troopers']
  ),
  'RESISTANCEPILOT': new CharacterSettings(
    [optimizationStrategy["Slow Crit, Physical Damage, Potency"].rename('PvP')],
    ['RP']
  ),
  'RESISTANCETROOPER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 10, 100, 25, 0, 50, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 0, -5, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['RT', 'res trooper']
  ),
  'REY': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['scav rey']
  ),
  'REYJEDITRAINING': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 20, 0, 20, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 50, 0, 50, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR p1 C3PO', 0, -5, 90, 100, 60, 60, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['JTR', 'RJT', 'Jedi Rey', 'Jey Z']
  ),
  'ROSETICO': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 50, 30, 0, 20, 20, 25, 0, 0, 0, 0, true)],
    [],
    DamageType.mixed
  ),
  'ROYALGUARD': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 50, 50, 25, 0, 0, 25, 0, 0, 0, 5, 5, 0, 0, true),
      new OptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['RG', 'Red Guard']
  ),
  'SABINEWRENS3': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 20, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'SANASTARROS': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 5, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'SAVAGEOPRESS': new CharacterSettings(
    [
      new OptimizationPlan('PvP/Omicron', 100, 0, 0, 0, 0, 0, 10, 0, 0, 50, 0, 0, 0, true),
      new OptimizationPlan('Balanced', 50, 0, 100, 25, 25, 25, 25, 0, 25, 12.5, 12.5, 0, 0, true)
    ],
    ['zavage']
  ),
  'SAWGERRERA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 0, 100, 0, 20, 0, 20, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'SCARIFREBEL': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 30, 10, 100, 0, 25, 10, 0, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 30, 10, 100, 0, 25, 10, 0, 0, 0, 10, 10, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Health %",
        "cross": "Health %"
      }),
      new OptimizationPlan('hSTR Phase 2', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Rogue 1', 'SRP']
  ),
  'SCORCH': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 20, 100, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, true)],
    ["Vader's Fist"]
  ),
  'SCOUTTROOPER_V3': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Potency %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 5, 10, 100, 0, 30, 10, 15, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Offense %",
        "cross": "Potency %"
      }, {
        "speed": 1,
        "potency": 1
      })
    ],
    ['Rogue 1', 'SRP']
  ),
  'SECONDSISTER': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 75, 0, 0, 0, 100, 30, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'SEVENTHSISTER': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'SHAAKTI': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 25, 25, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('KAM/CA', 20, 10, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, true)
    ]
  ),
  'SHINHATI': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 0, 100, 10, 0, 10, 25, 0, 0, 0, 0, 0, 0, true)]
  ),
  'SHORETROOPER': new CharacterSettings(
    [
      new OptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['ShT', 'Troopers', 'Imperial Grancor Maneuver']
  ),
  'SITHASSASSIN': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')],
    ['SA', 'Sassy']
  ),
  'SITHMARAUDER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['SM']
  ),
  'SITHPALPATINE': new CharacterSettings(
    [new OptimizationPlan('PvP', 40, 5, 100, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, true)],
    ['SEE'],
    DamageType.special
  ),
  'SITHTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 25, 50, 0, 0, 15, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('DR Lead', 25, 50, 15, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['SiT', 'Nightmare']
  ),
  'SMUGGLERCHEWBACCA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      new OptimizationPlan('PvP', 0, 0, 100, 80, 25, 0, 60, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Vets']
  ),
  'SMUGGLERHAN': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      new OptimizationPlan('PvP', 0, 0, 100, 80, 25, 0, 60, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Vets']
  ),
  'SNOWTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Iden Lead', 10, 10, 50, 100, 10, 0, 30, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Troopers']
  ),
  'STAP': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 10, 10, 0, 50, 0, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 0, 0, 100, 10, 10, 0, 50, 0, 10, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "cross": "Offense %",
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 0, 0, 100, 10, 10, 0, 50, 0, 10, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "triangle": "Critical Damage %",
        "cross": "Offense %",
      }, {
        "speed": 1,
      })
    ]
  ),
  'STARKILLER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 25, 0, 100, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %"
      }),
      new OptimizationPlan('Speedy', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Speedy w/ Primaries', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %"
      })
    ]
  ),
  'STORMTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('Speedy Tank', 25, 25, 50, 0, 0, 25, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('LV Lead', 100, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Iden Lead', 0, 75, 50, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, true),
      new OptimizationPlan('Iden Lead w/ Primaries', 0, 100, 50, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, true, {
        "arrow": "Defense %",
        "triangle": "Defense %",
        "cross": "Defense %"
      })
    ],
    ['Troopers']
  ),
  'STORMTROOPERHAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 50, 50, 0, 100, 10, 0, 0, 0, 20, 0, 0, 0, true)],
    ['STHan']
  ),
  'SUNFAC': new CharacterSettings(
    [new OptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'SUPREMELEADERKYLOREN': new CharacterSettings(
    [
      new OptimizationPlan('PvP - Speed', 10, 0, 100, 50, 0, 0, 30, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP - Offense', 20, 0, 100, 100, 0, 0, 40, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'T3_M4': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('Damage', 10, 20, 100, 50, 50, 10, 0, 20, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 10, 50, 100, 0, 25, 10, 0, 0, 10, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'TALIA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Mixed Damage"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 0, 0, 0, 100, 100, 100, 0, 0, 0, 0, true)
    ],
    ['NS', 'hSTR NS'],
    DamageType.mixed
  ),
  'TARFFUL': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 30, 0, 100, 0, 0, 0, 0, 0, 0, 50, 50, 0, 0, true, {
        "arrow": "Health %",
        "triangle": "Health %",
        "cross": "Health %",
        "circle": "Health %"
      }, {
        "defense": 3
      })
    ]
  ),
  'TARONMALICOS': new CharacterSettings(
    [
      new OptimizationPlan('Fast Build', 20, 0, 100, 50, 0, 0, 40, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Fast Build w/ Primaries', 20, 0, 100, 50, 0, 0, 40, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %"
      }),
      new OptimizationPlan('Fast Build w/ Primaries & Sets', 20, 0, 100, 50, 0, 0, 40, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %"
      }, {
        "offense": 1,
        "health": 1
      }),
      new OptimizationPlan('Slow Build', 40, 0, 100, 50, 0, 0, 60, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow Build w/ Primaries', 40, 0, 100, 50, 0, 0, 60, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %"
      }),
      new OptimizationPlan('Slow Build w/ Primaries & Sets', 40, 0, 100, 50, 0, 0, 60, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %"
      }, {
        "offense": 1,
        "health": 1
      }),
    ]
  ),
  'TEEBO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Potency %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 10, 0, 100, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, true, {
        "triangle": "Health %",
        "cross": "Potency %",
        "circle": "Health %"
      }, {
        "potency": 3
      })
    ],
    ['Teebotine', 'Murderbears']
  ),
  'THEMANDALORIAN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 5, 100, 15, 0, 0, 5, 0, 30, 0, 0, 0, 0, true),
      new OptimizationPlan('Relic 7', 0, 0, 100, 80, 0, 0, 20, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-relic', 0, 0, 100, 80, 0, 0, 10, 0, 20, 0, 0, 0, 0, true)
    ]
  ),
  'THEMANDALORIANBESKARARMOR': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 0, 15, 0, 30, 0, 0, 0, 0, 0, 0, true)]
  ),
  'THIRDSISTER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 30, 5, 100, 50, 0, 0, 50, 0, 0, 5, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 30, 5, 100, 0, 0, 0, 50, 0, 0, 5, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "circle": "Health %",
        "cross": "Health %"
      })
    ]
  ),
  'TIEFIGHTERPILOT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['TFP', 'Auto Lightzader']
  ),
  'TRENCH': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 30, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'TRIPLEZERO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 30, 0, 0, 20, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'TUSKENCHIEFTAIN': new CharacterSettings(
    [new OptimizationPlan('PvP', 15, 10, 100, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'TUSKENHUNTRESS': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 75, 10, 0, 40, 0, 10, 0, 0, 0, 0, true)]
  ),
  'TUSKENRAIDER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')]
  ),
  'TUSKENSHAMAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 5, 100, 0, 30, 10, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'UGNAUGHT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Mixed Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'UNDERCOVERLANDO': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 0, 100, 50, 0, 0, 25, 0, 25, 0, 0, 0, 0, true)]
  ),
  'URORRURRR': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 20, 100, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, true)]
  ),
  'VADER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 40, 0, 20, 0, 20, 0, 0, 0, 0, true),
      new OptimizationPlan('Raids', 0, 0, 100, 50, 25, 0, 25, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Auto Lightzader', 'Wampanader', 'Nightmare']
  ),
  'VEERS': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Mixed Damage, Potency"].rename('PvP')],
    ['Troopers'],
    DamageType.mixed
  ),
  'VISASMARR': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 50, 0, 25, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 25, -5, 0, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0, true)
    ]
  ),
  'WAMPA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 80, 100, 10, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Omicron', 100, 0, 75, 0, 0, 75, 50, 0, 0, 20, 0, 0, 0, true),
      new OptimizationPlan('Omicron/Health', 100, 0, 75, 0, 0, 10, 10, 0, 0, 10, 0, 0, 0, true),
      new OptimizationPlan('Omicron/Tenacity', 30, 0, 15, 0, 0, 100, 30, 0, 0, 20, 0, 0, 0, true),
      new OptimizationPlan('Raids', 10, 0, 80, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['beast', 'Wampanader']
  ),
  'WATTAMBOR': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 30, 0, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'WEDGEANTILLES': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Wiggs', 'chiggs', 'SuperStar2D2']
  ),
  'WICKET': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 0, 100, 100, 0, 0, 40, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 5, 0, 100, 100, 0, 0, 40, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 5, 0, 100, 100, 0, 0, 60, 0, 50, 0, 0, 0, 0, true, {
        "triangle": "Critical Damage %",
        "cross": "Offense %",
        "circle": "Health %"
      }, {
        "critdamage": 1,
        "health": 1
      }),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 80, 50, 0, 0, 100, 0, 10, 0, 0, 0, 0, true)
    ],
    ['Murderbears']
  ),
  'WRECKERS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 100, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['New Batch']
  ),
  'YOUNGCHEWBACCA': new CharacterSettings(
    [
      new OptimizationPlan('PvE', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 100, 0, 50, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, true)
    ],
    ['Dwight', 'solo']
  ),
  'YOUNGHAN': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('HAAT', 0, 0, 80, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, true)
    ],
    ['YOLO', 'solo', 'Jim']
  ),
  'YOUNGLANDO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['solo']
  ),
  'ZAALBAR': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 50, 25, 0, 25, 50, 0, 0, 0, 0, 0, 0, 50, true)]
  ),
  'ZAMWESELL': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0, true),
      new OptimizationPlan('Omicron', 10, 10, 100, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'ZEBS3': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('PvP w/ Primaries', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, true, {
        "cross": "Potency %"
      }),
      new OptimizationPlan('PvP w/ Primaries & Sets', 40, 0, 100, 0, 50, 0, 20, 0, 0, 0, 0, 0, 0, true, {
        "arrow": "Speed",
        "cross": "Potency %"
      }, {
        "health": 3
      })
    ]
  ),
  'ZORIIBLISS_V2': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 10, 100, 50, 10, 0, 20, 0, 0, 0, 0, 0, 0, true)]
  )
};

for (let charID in characterSettings) {
  Object.freeze(characterSettings[charID]);
}

Object.freeze(characterSettings);

export default characterSettings;
