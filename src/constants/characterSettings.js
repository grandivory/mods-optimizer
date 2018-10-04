// @flow

import OptimizationPlan from "../domain/OptimizationPlan";
import optimizationStrategy from "./optimizationStrategy";
import {CharacterSettings, DamageType} from "../domain/CharacterDataClasses";

// TODO: Don't have "Crew Member" in extra tags - get it from a data source
const characterSettings = {
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
    [new OptimizationPlan('Survivability', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true)],
    ['AA', 'Snackbar', 'ABC', 'Crew Member']
  ),
  'AHSOKATANO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Snips', 'Crew Member']
  ),
  'AMILYNHOLDO': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 10, 100, 0, 50, 25, 0, 0, 0, 5, 5, 0, 0, true)],
    ['Hodor'],
    DamageType.mixed
  ),
  'ANAKINKNIGHT': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 75, 25, 0, 25, 0, 80, 0, 0, 0, 0, true),
      new OptimizationPlan('Chex Mix', 0, 0, 50, 0, 0, 0, 100, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 20, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0, true)
    ],
    ['JKA']
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
      new OptimizationPlan('hSTR P2 Jedi', 0, 0, 100, 50, 0, 0, 0, 25, 50, 0, 0, 0, 0, true)
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
      new OptimizationPlan('hSTR Phase 1', 10, -5, 100, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, true)
    ],
    ['bb8', 'Wampanader', 'ABC']
  ),
  'BIGGSDARKLIGHTER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Wiggs', 'Chiggs', 'Crew Member']
  ),
  'BISTAN': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Rogue 1', 'SuperStar2D2', 'Crew Member']
  ),
  'BOBAFETT': new CharacterSettings(
    [
      new OptimizationPlan('PvE', 0, 0, 50, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true),
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
      new OptimizationPlan('hSTR Phase 2', 0, 0, 100, 75, 0, 0, 25, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Crew Member']
  ),
  'BODHIROOK': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1']
  ),
  'BOSSK': new CharacterSettings(
    [
      new OptimizationPlan('Leader', 20, 20, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('Non-leader', 20, 0, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0, true)
    ],
    ['Crew Member']
  ),
  'CADBANE': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Crew Member']
  ),
  'CASSIANANDOR': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1', 'SuperStar2D2', 'Crew Member'],
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
      new OptimizationPlan('Chew Mix', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
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
    [new OptimizationPlan('PvP', 20, 40, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Crew Member']
  ),
  'CLONESERGEANTPHASEI': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Sarge', 'Crew Member']
  ),
  'CLONEWARSCHEWBACCA': new CharacterSettings(
    [new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['CWC']
  ),
  'COLONELSTARCK': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Tony Stark', 'Troopers']
  ),
  'COMMANDERLUKESKYWALKER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0, true),
      optimizationStrategy["Speedy Chex Mix"].rename('Chex Mix'),
      new OptimizationPlan('Raids', 0, 0, 100, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0, true)
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
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Crew Member']
  ),
  'CT7567': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 100, 0, 10, 20, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Titans', 'Crew Member']
  ),
  'CT210408': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
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
  'DARTHNIHILUS': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Nightmare'],
    DamageType.special
  ),
  'DARTHSIDIOUS': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')],
    ['Auto Lightzader']
  ),
  'DARTHSION': new CharacterSettings(
    [new OptimizationPlan('PvP', 15, 15, 100, 20, 15, 0, 20, 0, 20, 0, 0, 0, 0, true)],
    ['Nightmare']
  ),
  'DARTHTRAYA': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 0, 50, 10, 0, 0, 0, 0, true)],
    [],
    DamageType.special
  ),
  'DATHCHA': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    [],
    DamageType.mixed
  ),
  'DEATHTROOPER': new CharacterSettings(
    [new OptimizationPlan('Damage', 0, 0, 80, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0, true)],
    ['Troopers', 'Chex Mix', 'Crew Member']
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
      new OptimizationPlan('hSTR Phase 3', 25, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    ],
    ['Nesty', 'Baby Wampa', '#solo']
  ),
  'EWOKELDER': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, true)],
    ['EE', 'Murderbears']
  ),
  'EWOKSCOUT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Murderbears']
  ),
  'EZRABRIDGERS3': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 75, 0, 75, 0, 0, 0, 0, true)
    ],
    ['Crew Member']
  ),
  'FINN': new CharacterSettings(
    [optimizationStrategy["Slow Crit, Physical Damage, Potency"].rename('PvP')],
    ['Zinn', 'Crew Member']
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
    ['SFTP', 'FO', 'Crew Member'],
    DamageType.mixed
  ),
  'FIRSTORDERTIEPILOT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['FOTP', 'FO', 'Crew Member']
  ),
  'FIRSTORDERTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 20, 20, 100, 50, 50, 25, 0, 0, 0, 5, 5, 0, 0, true)],
    ['FOST', 'FO', 'Crew Member']
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
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['Crew Member']
  ),
  'GENERALKENOBI': new CharacterSettings(
    [
      new OptimizationPlan('Speedy Tank', 25, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('Balanced', 50, 100, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('Slow Tank', 50, 100, 0, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0, true),
      new OptimizationPlan('hSTR P2 Jedi', 0, 100, 50, 0, 0, 0, 10, 0, 25, 100, 0, 0, 0, true)
    ],
    ['GK', 'Titans']
  ),
  'GEONOSIANSOLDIER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Crew Member']
  ),
  'GEONOSIANSPY': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Crew Member']
  ),
  'GRANDADMIRALTHRAWN': new CharacterSettings(
    [optimizationStrategy["Speed with survivability"].rename('PvP')],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans', 'Crew Member'],
    DamageType.special
  ),
  'GRANDMASTERYODA': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 0, 75, 80, 0, 0, 0, 0, true)
    ],
    ['GMY'],
    DamageType.special
  ),
  'GRANDMOFFTARKIN': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 15, 15, 50, 0, 0, 0, 0, true)],
    ['GMT', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'Crew Member'],
    DamageType.mixed
  ),
  'GREEDO': new CharacterSettings(
    [new OptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0, true)]
  ),
  'GRIEVOUS': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['GG']
  ),
  'HANSOLO': new CharacterSettings(
    [
      optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Fast Han'),
      new OptimizationPlan('Slow Han', 0, 0, 0, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0, true)
    ],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans']
  ),
  'HERASYNDULLAS3': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('Speed')],
    ['Crew Member']
  ),
  'HERMITYODA': new CharacterSettings(
    [optimizationStrategy.Speed.rename('Speed')],
    ['Hyoda', 'Hoboda', 'Hobo', 'HY'],
    DamageType.mixed
  ),
  'HK47': new CharacterSettings(
    [new OptimizationPlan('Leader', 0, 0, 100, 50, 50, 0, 25, 0, 100, 0, 0, 0, 0, true)]
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
  'IG86SENTINELDROID': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')]
  ),
  'IG88': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('Damage')],
    ['Crew Member']
  ),
  'IMAGUNDI': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['IGD']
  ),
  'IMPERIALPROBEDROID': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      new OptimizationPlan('Offense', 0, 0, 100, 80, 50, 0, 25, 0, 50, 0, 0, 0, 0, true)
    ],
    ['IPD']
  ),
  'IMPERIALSUPERCOMMANDO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['ISC', 'Crew Member']
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
    ['JC', 'Crew Member'],
    DamageType.mixed
  ),
  'JEDIKNIGHTGUARDIAN': new CharacterSettings(
    [new OptimizationPlan('PvE', 40, 20, 100, 0, 50, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['JKG']
  ),
  'JOLEEBINDO': new CharacterSettings(
    [new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true)]
  ),
  'JYNERSO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0, true)],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2', 'Crew Member']
  ),
  'K2SO': new CharacterSettings(
    [new OptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Rogue 1', 'Cass-2SO', 'K2', 'Crew Member']
  ),
  'KANANJARRUSS3': new CharacterSettings(
    [new OptimizationPlan('Tanky', 0, 40, 100, 0, 30, 0, 0, 0, 50, 0, 0, 0, 0, true)],
    ['Crew Member']
  ),
  'KITFISTO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE')],
    ['Fisty', 'Fister']
  ),
  'KYLOREN': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Old Kylo', 'zylo', 'FO', 'Crew Member']
  ),
  'KYLORENUNMASKED': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['kru', 'matt', 'Snape', 'FO', 'Crew Member']
  ),
  'L3_37': new CharacterSettings(
    [
      new OptimizationPlan('Tanky', 40, 20, 50, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true),
      new OptimizationPlan('Speedy', 40, 20, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)
    ],
    ['#solo', 'Crew Member']
  ),
  'LOBOT': new CharacterSettings(
    [new OptimizationPlan('PvE', 0, 0, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)]
  ),
  'LOGRAY': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0, true)],
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
    ['Crew Member'],
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
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')],
    ['Crew Member']
  ),
  'MISSIONVAO': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0, true)]
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
      new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 50, 0, 100, 0, 0, 0, 0, true)
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
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Damage')]
  ),
  'OLDBENKENOBI': new CharacterSettings(
    [new OptimizationPlan('Speed', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['OB']
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
    ['FO', 'Crew Member']
  ),
  'PLOKOON': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['Crew Member'],
    DamageType.mixed
  ),
  'POE': new CharacterSettings(
    [optimizationStrategy["Speedy debuffer"].rename('Speed')],
    ['Crew Member']
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
    ['#solo']
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
    ['RP', 'Crew Member']
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
    ['scav rey', 'Crew Member']
  ),
  'REYJEDITRAINING': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 100, 20, 0, 20, 0, 50, 0, 0, 0, 0, true),
      new OptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 50, 0, 50, 0, 0, 0, 0, 0, 0, true)
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
    ],
    ['Crew Member']
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
    ['Rogue 1', 'SRP', 'Crew Member']
  ),
  'SHORETROOPER': new CharacterSettings(
    [new OptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, true)],
    ['ShT', 'Troopers', 'Imperial Grancor Maneuver', 'Crew Member']
  ),
  'SITHASSASSIN': new CharacterSettings(
    [optimizationStrategy["Special Damage with Potency"].rename('PvP')],
    ['SA', 'Sassy', 'Crew Member']
  ),
  'SITHMARAUDER': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['SM']
  ),
  'SITHTROOPER': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 25, 50, 0, 0, 15, 0, 0, 0, 25, 25, 0, 0, true)],
    ['SiT', 'Nightmare']
  ),
  'SMUGGLERCHEWBACCA': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['Vets']
  ),
  'SMUGGLERHAN': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['Vets']
  ),
  'SNOWTROOPER': new CharacterSettings(
    [
      new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 50, 0, 100, 0, 0, 0, 0, true),
      new OptimizationPlan('PvE', 0, 0, 80, 50, 0, 0, 25, 0, 100, 0, 0, 0, 0, true)
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
    [new OptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0, true)],
    ['Crew Member']
  ),
  'T3_M4': new CharacterSettings(
    [new OptimizationPlan('PvP', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0, true)],
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
  'TIEFIGHTERPILOT': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')],
    ['TFP', 'Auto Lightzader', 'Crew Member']
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
    ['Auto Lightzader', 'Wampanader', 'Nightmare', 'Crew Member']
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
  'WEDGEANTILLES': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Wiggs', 'chiggs', 'SuperStar2D2', 'Crew Member']
  ),
  'WICKET': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')],
    ['Murderbears']
  ),
  'YOUNGCHEWBACCA': new CharacterSettings(
    [new OptimizationPlan('PvE', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0, true)],
    ['Dwight', '#solo']
  ),
  'YOUNGHAN': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['YOLO', '#solo', 'Jim']
  ),
  'YOUNGLANDO': new CharacterSettings(
    [optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')],
    ['#solo', 'Crew Member']
  ),
  'ZAALBAR': new CharacterSettings(
    [new OptimizationPlan('PvP', 25, 25, 100, 0, 25, 0, 10, 0, 20, 0, 0, 0, 0, true)]
  ),
  'ZAMWESELL': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0, true)]
  ),
  'ZEBS3': new CharacterSettings(
    [new OptimizationPlan('PvP', 0, 40, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, true)],
    ['Crew Member']
  )
};

for (let charID in characterSettings) {
  Object.freeze(characterSettings[charID]);
}

Object.freeze(characterSettings);

export default characterSettings;
