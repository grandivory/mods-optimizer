// @flow

import OptimizationPlan from "../domain/OptimizationPlan";
import optimizationStrategy from "./optimizationStrategy";
import { CharacterSettings, DamageType } from "../domain/CharacterDataClasses";
import TargetStat from "../domain/TargetStat";

const characterSettings = {
  'C3POCHEWBACCA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 80, 10, 0, 50, 0, 25, 0, 0, 0, 0, true)]
  ),
  'AAYLASECURA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 75, 50, 0, 25, 0, 100, 0, 0, 0, 0, true),
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
    [new OptimizationPlan('PvP', 0, 0, 100, 25, 15, 0, 20, 0, 10, 0, 0, 0, 0, true)]
  ),
  'AHSOKATANO': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
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
      new OptimizationPlan('Chex Mix', 0, 0, 50, 0, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 20, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Slow Damage', 25, 0, 0, 100, 25, 0, 25, 0, 40, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 0, 0, 0, 100, 20, 0, 40, 0, 25, 0, 0, 0, 0, true)
    ],
    ['JKA']
  ),
  'ARCTROOPER501ST': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 80, 25, 0, 0, 100, 0, 10, 0, 0, 0, 0, true)],
  ),
  'ARMORER': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, true)],
  ),
  'ASAJVENTRESS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 10, 20, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, true),
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
  'B1BATTLEDROIDV2': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 75, 0, 0, 0, 0, 0, 0, true)]
  ),
  'B2SUPERBATTLEDROID': new CharacterSettings(
    [new OptimizationPlan('Survival', 50, 50, 0, 0, 50, 25, 0, 0, 0, 0, 0, 50, 0, true)]
  ),
  'BARRISSOFFEE': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 50, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
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
      new OptimizationPlan('7-star', 0, 0, 100, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Low Star', 10, 20, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'BAZEMALBUS': new CharacterSettings(
    [
      new OptimizationPlan('Slow Tank', 50, 50, 0, 0, 10, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 10, 10, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Rogue 1', 'Chaze', 'Chiggs']
  ),
  'BB8': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 5, 5, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 10, -5, 100, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed,
      new OptimizationPlan('Tanky', 5, 25, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['bb8', 'Wampanader', 'ABC']
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
  'BODHIROOK': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1']
  ),
  'BOSSK': new CharacterSettings(
    [
      new OptimizationPlan('Leader', 10, 10, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-leader', 10, 0, 100, 0, 10, 25, 0, 0, 0, 0, 0, 0, 0, true)
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
  'CANDEROUSORDO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')]
  ),
  'CARADUNE': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 80, 100, 20, 0, 25, 0, 0, 0, 0, 0, 0, true)]
  ),
  'CARTHONASI': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
  ),
  'CASSIANANDOR': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
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
  'CHEWBACCALEGENDARY': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('Chew Mix', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3 Greedo', 0, 0, 75, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Chex Mix']
  ),
  'CHIEFCHIRPA': new CharacterSettings(
    [optimizationStrategy.Speed.rename('Speed')],
    ['Murderbears']
  ),
  'CHIEFNEBIT': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
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
    [new OptimizationPlan('PvP', 20, 40, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)]
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
  'COMMANDERLUKESKYWALKER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0, true),
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
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 50, 25, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.mixed
  ),
  'CT5555': new CharacterSettings(
    [new OptimizationPlan('PvP', 30, 30, 50, 0, 15, 0, 25, 0, 0, 0, 0, 0, 0, true)]
  ),
  'CT7567': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 100, 0, 10, 20, 0, 0, 0, 0, 0, 0, 0, true),
      optimizationStrategy.Speed.rename('Chex Mix')
    ],
    ['Titans']
  ),
  'CT210408': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 50, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 0, 0, 50, 100, 0, 0, 75, 0, 25, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.mixed
  ),
  'DAKA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 0, 25, 15, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 50, 0, 75, 0, 15, 0, 5, 0, 0, 0, 0, 0, 0, true)
    ],
    ['NS', 'hSTR NS']
  ),
  'DARKTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 50, 0, 0, 5, 60, 0, 0, 2.5, 2.5, 0, 0, true)]
  ),
  'DARTHMALAK': new CharacterSettings(
    [new OptimizationPlan('PvP', 15, 25, 100, 10, 10, 0, 10, 0, 10, 0, 0, 0, 0, true)]
  ),
  'DARTHNIHILUS': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Nightmare'],
    DamageType.special
  ),
  'DARTHREVAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 10, 0, 0, 15, 10, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'DARTHSIDIOUS': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')],
    ['Auto Lightzader']
  ),
  'DARTHSION': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 15, 15, 100, 20, 15, 0, 20, 0, 20, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 20, 20, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Nightmare']
  ),
  'DARTHTRAYA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 0, 50, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('Tanky', 25, 75, 65, 0, 0, 65, 0, 0, 0, 0, 0, 0, 100, true)
    ],
    [],
    DamageType.special
  ),
  'DATHCHA': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'DEATHTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('Damage', 0, 0, 80, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true, {}, {},
        [new TargetStat('Speed', 175, 179)]
      )
    ],
    ['Troopers', 'Chex Mix']
  ),
  'DENGAR': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 25, 0, 75, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'DIRECTORKRENNIC': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Imperial Grancor Maneuver'],
    DamageType.special
  ),
  'DROIDEKA': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 50, 0, 0, 10, 100, 0, 25, 20, 20, 0, 0, true)]
  ),
  'EETHKOTH': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    [],
    DamageType.mixed
  ),
  'EMBO': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 20, 100, 100, 0, 0, 25, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 50, 25, 0, 0, 75, 0, 100, 0, 0, 0, 0, true)
    ]
  ),
  'EMPERORPALPATINE': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')],
    ['EP', 'Palp', 'EzPz', 'Nightmare'],
    DamageType.special
  ),
  'ENFYSNEST': new CharacterSettings(
    [
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
    [new OptimizationPlan('PvP', 25, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true)],
    ['EE', 'Murderbears']
  ),
  'EWOKSCOUT': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Murderbears']
  ),
  'EZRABRIDGERS3': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 75, 0, 75, 0, 0, 0, 0, true)
    ]
  ),
  'FINN': new CharacterSettings(
    [
      optimizationStrategy["Slow Crit, Physical Damage, Potency"].rename('PvP'),
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
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['SFTP', 'FO'],
    DamageType.mixed
  ),
  'FIRSTORDERTIEPILOT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['FOTP', 'FO']
  ),
  'FIRSTORDERTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 20, 100, 50, 50, 25, 0, 0, 0, 5, 5, 0, 0, true)],
    ['FOST', 'FO']
  ),
  'FOSITHTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 25, 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, true)]
  ),
  'FULCRUMAHSOKA': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['ATF', 'FAT']
  ),
  'GAMORREANGUARD': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 100, 0, 50, 25, 25, 0, 0, 5, 5, 0, 0, true)],
    ['Piggy']
  ),
  'GARSAXON': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
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
      new OptimizationPlan('hSTR P2 Jedi', 0, 100, 50, 0, 0, 0, 10, 0, 25, 100, 0, 0, 0, true)
    ],
    ['GK', 'Titans']
  ),
  'GENERALSKYWALKER': new CharacterSettings(
    [
      new OptimizationPlan('PvP - Defense', 10, 25, 100, 0, 20, 0, 10, 0, 0, 10, 10, 0, 0, true),
      new OptimizationPlan('PvP - Offense', 0, 0, 100, 100, 20, 0, 20, 0, 0, 0, 0, 0, 0, true)
    ],
    ['GAS']
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
  'GLREY': new CharacterSettings(
    [new OptimizationPlan('PvP', 50, 0, 100, 50, 0, 10, 25, 0, 0, 0, 0, 0, 0, true)]
  ),
  'GRANDADMIRALTHRAWN': new CharacterSettings(
    [optimizationStrategy["Speed with survivability"].rename('PvP')],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans'],
    DamageType.special
  ),
  'GRANDMASTERLUKE': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 20, 100, 25, 15, 0, 0, 10, 0, 0, 0, 0, 0, true)],
    ['GMLS', 'JMLS', 'GLLS'],
    DamageType.special
  ),
  'GRANDMASTERYODA': new CharacterSettings(
    [
      new OptimizationPlan('Speedy', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Offense', 0, 0, 50, 100, 0, 0, 0, 100, 25, 0, 0, 0, 0, true),
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
  'GREEDO': new CharacterSettings(
    [
      new OptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {}, {},
        [new TargetStat('Speed', 170, 174)]
      )
    ]
  ),
  'GREEFKARGA': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 100, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'GRIEVOUS': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 100, 0, 80, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 100, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['GG']
  ),
  'HANSOLO': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Fast Han'),
      new OptimizationPlan('Slow Han', 0, 0, 0, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('Chex Mix', 0, 0, 0, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true, {}, {},
        [new TargetStat('Speed', 170, 174)]
      )
    ],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans']
  ),
  'HERASYNDULLAS3': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('Speed')]
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
  'HOTHHAN': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['CHS', 'CHolo', 'Snolo', 'Hoth Han']
  ),
  'HOTHLEIA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 25, 0, 30, 0, 0, 0, 0, true)],
    ['ROLO']
  ),
  'HOTHREBELSCOUT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['HRS', 'Hoth Bros']
  ),
  'HOTHREBELSOLDIER': new CharacterSettings(
    [new OptimizationPlan('PvE', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['HRS', 'Hoth Bros']
  ),
  'HUMANTHUG': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Really?')]
  ),
  'IG11': new CharacterSettings(
    [new OptimizationPlan('Tanky', 25, 0, 50, 0, 0, 10, 5, 0, 5, 5, 5, 0, 0, true)]
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
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['ISC']
  ),
  'JANGOFETT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')]
  ),
  'JAWA': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'JAWAENGINEER': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 100, 0, 50, 10, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.mixed
  ),
  'JAWASCAVENGER': new CharacterSettings(
    [new OptimizationPlan('PvE', 0, 0, 100, 25, 50, 0, 25, 0, 100, 0, 0, 0, 0, true)]
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
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 0, 10, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'JOLEEBINDO': new CharacterSettings(
    [
      new OptimizationPlan('Health and Speed', 100, 0, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Healer', 30, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'JUHANI': new CharacterSettings(
    [new OptimizationPlan('Tank', 50, 25, 100, 0, 25, 0, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'JYNERSO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0, true)],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2']
  ),
  'K2SO': new CharacterSettings(
    [new OptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1', 'Cass-2SO', 'K2']
  ),
  'KANANJARRUSS3': new CharacterSettings(
    [new OptimizationPlan('Tanky', 0, 40, 100, 0, 30, 0, 0, 0, 50, 0, 0, 0, 0, true)]
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
  'KUIIL': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'KYLOREN': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Old Kylo', 'zylo', 'FO']
  ),
  'KYLORENUNMASKED': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('Tanky', 100, 100, 50, 0, 0, 75, 0, 0, 0, 37.5, 37.5, 0, 0, true)
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
      new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 2', 5, 5, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Murderbears']
  ),
  'LUKESKYWALKER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['farmboi']
  ),
  'LUMINARAUNDULI': new CharacterSettings(
    [new OptimizationPlan('PvE', 40, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'MACEWINDU': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'MAGMATROOPER': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      new OptimizationPlan('Anti-Traya', 0, 0, 25, 25, 50, 0, 25, 0, 25, 0, 0, 0, 0, true)
    ]
  ),
  'MAGNAGUARD': new CharacterSettings(
    [new OptimizationPlan('Balanced', 20, 20, 100, 25, 50, 25, 25, 0, 25, 12.5, 12.5, 0, 0, true)]
  ),
  'MAUL': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')]
  ),
  'MISSIONVAO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0, true)]
  ),
  'MOFFGIDEONS1': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'MONMOTHMA': new CharacterSettings(
    [new OptimizationPlan('Leader', 5, 5, 100, 0, 0, 25, 10, 0, 0, 0, 0, 0, 0, true)],
    ['MM']
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
      new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 0, 80, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 100, 100, 0, 0, 100, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 50, 0, 100, 0, 0, 0, 0, true)
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
      optimizationStrategy["Speedy Chex Mix"].rename('Chex Mix')
    ],
    ['Rogue 1', 'Chex Mix']
  ),
  'PAPLOO': new CharacterSettings(
    [new OptimizationPlan('Fast Tank', 25, 25, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['Murderbears']
  ),
  'PHASMA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0, true)],
    ['FO']
  ),
  'PLOKOON': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'POE': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('Speed')]
  ),
  'POGGLETHELESSER': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('PvE')]
  ),
  'PRINCESSLEIA': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0, true)
    ],
    ['Machine Gun']
  ),
  'QIRA': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['solo']
  ),
  'QUIGONJINN': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
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
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'ROYALGUARD': new CharacterSettings(
    [new OptimizationPlan('Tanky', 50, 50, 25, 0, 0, 25, 0, 0, 0, 5, 5, 0, 0, true)],
    ['RG', 'Red Guard']
  ),
  'SABINEWRENS3': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 20, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'SAVAGEOPRESS': new CharacterSettings(
    [new OptimizationPlan('Balanced', 50, 0, 100, 25, 25, 25, 25, 0, 25, 12.5, 12.5, 0, 0, true)],
    ['zavage']
  ),
  'SCARIFREBEL': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 20, 20, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 2', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Rogue 1', 'SRP']
  ),
  'SHAAKTI': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 25, 25, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)
    ]
  ),
  'SHORETROOPER': new CharacterSettings(
    [new OptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true)],
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
    [new OptimizationPlan('PvP', 5, 5, 100, 25, 0, 0, 0, 20, 10, 0, 0, 0, 0, true)],
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
      new OptimizationPlan('PvP', 0, 0, 0, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Fast PvP', 0, 0, 100, 50, 0, 0, 50, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('Fast PvE', 0, 0, 80, 50, 0, 0, 25, 0, 100, 0, 0, 0, 0, true)
    ],
    ['Troopers']
  ),
  'STORMTROOPER': new CharacterSettings(
    [new OptimizationPlan('Speedy Tank', 25, 25, 50, 0, 0, 25, 0, 0, 0, 25, 25, 0, 0, true)],
    ['Troopers']
  ),
  'STORMTROOPERHAN': new CharacterSettings(
    [
      optimizationStrategy.Speed.rename('Speed'),
      new OptimizationPlan('PvE', 50, 50, 50, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, true)
    ],
    ['STHan']
  ),
  'SUNFAC': new CharacterSettings(
    [new OptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'SUPREMELEADERKYLOREN': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 0, 80, 100, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)]
  ),
  'T3_M4': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0, true),
      new OptimizationPlan('Nuke', 10, 50, 100, 0, 25, 10, 0, 0, 10, 0, 0, 0, 0, true)
    ],
    [],
    DamageType.special
  ),
  'TALIA': new CharacterSettings(
    [new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 0, 0, 0, 100, 0, 100, 0, 0, 0, 0, true)],
    ['NS', 'hSTR NS'],
    DamageType.mixed
  ),
  'TEEBO': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 25, 100, 0, 50, 25, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Teebotine', 'Murderbears']
  ),
  'THEMANDALORIAN': new CharacterSettings(
    [
      new OptimizationPlan('Relic 7', 0, 0, 100, 80, 0, 0, 20, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-relic', 0, 0, 100, 80, 0, 0, 10, 0, 20, 0, 0, 0, 0, true)
    ]
  ),
  'THEMANDALORIANBESKARARMOR': new CharacterSettings(
    [new OptimizationPlan('PvP', 5, 5, 100, 0, 15, 0, 30, 0, 0, 0, 0, 0, 0, true)]
  ),
  'TIEFIGHTERPILOT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['TFP', 'Auto Lightzader']
  ),
  'TUSKENRAIDER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')]
  ),
  'TUSKENSHAMAN': new CharacterSettings(
    [new OptimizationPlan('PvE', 0, 0, 100, 0, 50, 25, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'UGNAUGHT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'URORRURRR': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')]
  ),
  'VADER': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('Raids', 0, 0, 100, 50, 25, 0, 25, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Auto Lightzader', 'Wampanader', 'Nightmare']
  ),
  'VEERS': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Troopers'],
    DamageType.mixed
  ),
  'VISASMARR': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 25, 0, 100, 50, 0, 25, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 25, -5, 0, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0, true)
    ]
  ),
  'WAMPA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 10, 0, 80, 100, 10, 0, 50, 0, 50, 0, 0, 0, 0, true),
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
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 80, 50, 0, 0, 100, 0, 10, 0, 0, 0, 0, true)
    ],
    ['Murderbears']
  ),
  'YOUNGCHEWBACCA': new CharacterSettings(
    [new OptimizationPlan('PvE', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0, true)],
    ['Dwight', 'solo']
  ),
  'YOUNGHAN': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
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
    [new OptimizationPlan('PvP', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0, true)]
  ),
  'ZEBS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 40, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  )
};

for (let charID in characterSettings) {
  Object.freeze(characterSettings[charID]);
}

Object.freeze(characterSettings);

export default characterSettings;
