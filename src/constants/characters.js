import {BasicCharacter, DamageType} from "../domain/Character";
import OptimizationPlan from "../domain/OptimizationPlan";
import optimizationStrategy from "./optimizationStrategy";

let charactersArray = [
  new BasicCharacter(
    'Aayla Secura',
    'AAYLASECURA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jedi', 'Galactic Republic', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Admiral Ackbar',
    'ADMIRALACKBAR',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Support', 'Fleet Commander', 'Crew Member'],
    ['AA', 'Snackbar', 'ABC'],
    true
  ),
  new BasicCharacter(
    'Ahsoka Tano',
    'AHSOKATANO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jedi', 'Galactic Republic', 'Attacker', 'Crew Member'],
    ['Snips'],
    true
  ),
  new BasicCharacter(
    'Ahsoka Tano (Fulcrum)',
    'FULCRUMAHSOKA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker'],
    ['ATF', 'FAT'],
    false
  ),
  new BasicCharacter(
    'Amilyn Holdo',
    'AMILYNHOLDO',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Tank'],
    ['Hodor'],
    false
  ),
  new BasicCharacter(
    'Asajj Ventress',
    'ASAJVENTRESS',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Separatist', 'Support'],
    ['AV', 'Zen', 'NS', 'hSTR NS', 'ABC'],
    false
  ),
  new BasicCharacter(
    'B2 Super Battle Droid',
    'B2SUPERBATTLEDROID',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Droid', 'Tank'],
    [],
    false
  ),
  new BasicCharacter(
    'Barriss Offee',
    'BARRISSOFFEE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jedi', 'Galactic Republic', 'Healer'],
    [],
    false
  ),
  new BasicCharacter(
    'Baze Malbus',
    'BAZEMALBUS',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Tank'],
    ['Rogue 1', 'Chaze', 'Chiggs'],
    false
  ),
  new BasicCharacter(
    'BB-8',
    'BB8',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Droid', 'Support'],
    ['bb8', 'Wampanader', 'ABC'],
    false
  ),
  new BasicCharacter(
    'Biggs Darklighter',
    'BIGGSDARKLIGHTER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Support', 'Crew Member'],
    ['Wiggs', 'Chiggs'],
    true
  ),
  new BasicCharacter(
    'Bistan',
    'BISTAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker', 'Crew Member'],
    ['Rogue 1', 'SuperStar2D2'],
    true
  ),
  new BasicCharacter(
    'Boba Fett',
    'BOBAFETT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Bodhi Rook',
    'BODHIROOK',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Support'],
    ['Rogue 1'],
    false
  ),
  new BasicCharacter(
    'Bossk',
    'BOSSK',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Tank'],
    [],
    false
  ),
  new BasicCharacter(
    'Cad Bane',
    'CADBANE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Captain Han Solo',
    'HOTHHAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scountrel', 'Rebel', 'Support'],
    ['CHS', 'CHolo', 'Snolo', 'Hoth Han'],
    false
  ),
  new BasicCharacter(
    'Captain Phasma',
    'PHASMA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Support', 'Crew Member'],
    ['FO'],
    true
  ),
  new BasicCharacter(
    'Cassian Andor',
    'CASSIANANDOR',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Support', 'Crew Member'],
    ['Rogue 1', 'SuperStar2D2'],
    true
  ),
  new BasicCharacter(
    'CC-2224 "Cody"',
    'CC2224',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Attacker'],
    ['zody'],
    false
  ),
  new BasicCharacter(
    'Chief Chirpa',
    'CHIEFCHIRPA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Support'],
    ['Murderbears'],
    false
  ),
  new BasicCharacter(
    'Chief Nebit',
    'CHIEFNEBIT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jawa', 'Tank'],
    ['nebs'],
    false
  ),
  new BasicCharacter(
    'Chirrut Îmwe',
    'CHIRRUTIMWE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker'],
    ['Rogue 1', 'Chaze', 'Chiggs', 'Chex Mix'],
    false
  ),
  new BasicCharacter(
    'Chopper',
    'CHOPPERS3',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Phoenix', 'Droid', 'Support', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Clone Sergeant - Phase I',
    'CLONESERGEANTPHASEI',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Attacker', 'Crew Member'],
    ['Sarge'],
    true
  ),
  new BasicCharacter(
    'Clone Wars Chewbacca',
    'CLONEWARSCHEWBACCA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Scoundrel', 'Tank'],
    ['CWC'],
    false
  ),
  new BasicCharacter(
    'Colonel Starck',
    'COLONELSTARCK',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Support'],
    ['Tony Stark', 'Troopers'],
    false
  ),
  new BasicCharacter(
    'Commander Luke Skywalker',
    'COMMANDERLUKESKYWALKER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker'],
    ['CLS', 'Wampanader', 'Chex Mix', 'ABC', 'Titans'],
    false
  ),
  new BasicCharacter(
    'Coruscant Underworld Police',
    'CORUSCANTUNDERWORLDPOLICE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Support'],
    ['CUP'],
    false
  ),
  new BasicCharacter(
    'Count Dooku',
    'COUNTDOOKU',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Sith', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'CT-21-0408 "Echo"',
    'CT210408',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'CT-5555 "Fives"',
    'CT5555',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'CT-7567 "Rex"',
    'CT7567',
    DamageType.physical,
    new OptimizationPlan(
      10, // health
      0, // protection
      100, // speed
      0, // crit damage
      10, // potency
      20, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    ),
    {},
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Support', 'Crew Member'],
    ['Titans'],
    true
  ),
  new BasicCharacter(
    'Darth Maul',
    'MAUL',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Darth Nihilus',
    'DARTHNIHILUS',
    DamageType.special,
    new OptimizationPlan(
      0, // health
      10, // protection
      100, // speed
      0, // crit damage
      25, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    ),
    {},
    ['Dark Side', 'Sith', 'Support'],
    ['Nightmare'],
    false
  ),
  new BasicCharacter(
    'Darth Sidious',
    'DARTHSIDIOUS',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Attacker'],
    ['Auto Lightzader'],
    false
  ),
  new BasicCharacter(
    'Darth Sion',
    'DARTHSION',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Tank'],
    ['Nightmare'],
    false
  ),
  new BasicCharacter(
    'Darth Traya',
    'DARTHTRAYA',
    DamageType.special,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Darth Vader',
    'VADER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Sith', 'Attacker', 'Crew Member'],
    ['Auto Lightzader', 'Wampanader', 'Nightmare'],
    true
  ),
  new BasicCharacter(
    'Dathcha',
    'DATHCHA',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jawa', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Death Trooper',
    'DEATHTROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Attacker', 'Crew Member'],
    ['Troopers', 'Chex Mix'],
    true
  ),
  new BasicCharacter(
    'Dengar',
    'DENGAR',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Director Krennic',
    'DIRECTORKRENNIC',
    DamageType.special,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Support'],
    ['Imperial Grancor Maneuver'],
    false
  ),
  new BasicCharacter(
    'Eeth Koth',
    'EETHKOTH',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Emperor Palpatine',
    'EMPERORPALPATINE',
    DamageType.special,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Sith', 'Support'],
    ['EP', 'Palp', 'EzPz', 'Nightmare'],
    false
  ),
  new BasicCharacter(
    'Enfys Nest',
    'ENFYSNEST',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['Nesty', 'Baby Wampa', '#solo'],
    false
  ),
  new BasicCharacter(
    'Ewok Elder',
    'EWOKELDER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Healer'],
    ['EE', 'Murderbears'],
    false
  ),
  new BasicCharacter(
    'Ewok Scout',
    'EWOKSCOUT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Attacker'],
    ['Murderbears'],
    false
  ),
  new BasicCharacter(
    'Ezra Bridger',
    'EZRABRIDGERS3',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Phoenix', 'Jedi', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Finn',
    'FINN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Tank', 'Crew Member'],
    ['Zinn'],
    true
  ),
  new BasicCharacter(
    'First Order Executioner',
    'FIRSTORDEREXECUTIONER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Attacker'],
    ['Fox', 'Panda', 'Foe', 'FO'],
    false
  ),
  new BasicCharacter(
    'First Order Officer',
    'FIRSTORDEROFFICERMALE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Support'],
    ['Foo', 'FO'],
    false
  ),
  new BasicCharacter(
    'First Order SF TIE Pilot',
    'FIRSTORDERSPECIALFORCESPILOT',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Attacker', 'Crew Member'],
    ['SFTP', 'FO'],
    true
  ),
  new BasicCharacter(
    'First Order Stormtrooper',
    'FIRSTORDERTROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Tank', 'Crew Member'],
    ['FOST', 'FO'],
    true
  ),
  new BasicCharacter(
    'First Order TIE Pilot',
    'FIRSTORDERTIEPILOT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Attacker', 'Crew Member'],
    ['FOTP', 'FO'],
    true
  ),
  new BasicCharacter(
    'Gamorrean Guard',
    'GAMORREANGUARD',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Tank'],
    ['Piggy'],
    false
  ),
  new BasicCharacter(
    'Gar Saxon',
    'GARSAXON',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Garazeb "Zeb" Orrelios',
    'ZEBS3',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Phoenix', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'General Grievous',
    'GRIEVOUS',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Droid', 'Attacker'],
    ['GG'],
    false
  ),
  new BasicCharacter(
    'General Kenobi',
    'GENERALKENOBI',
    DamageType.physical,
    new OptimizationPlan(
      50, // health
      100, // protection
      100, // speed
      0, // crit damage
      0, // potency
      50, // tenacity
      0, // offense
      0, // crit chance
      50, // defense
      0, // accuracy
      0 // crit avoidance
    ),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank'],
    ['GK', 'Titans'],
    false
  ),
  new BasicCharacter(
    'General Veers',
    'VEERS',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Support'],
    ['Troopers'],
    false
  ),
  new BasicCharacter(
    'Geonosian Soldier',
    'GEONOSIANSOLDIER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Geonosian', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Geonosian Spy',
    'GEONOSIANSPY',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Geonosian', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Grand Admiral Thrawn',
    'GRANDADMIRALTHRAWN',
    DamageType.special,
    optimizationStrategy['Speed with survivability'],
    {},
    ['Dark Side', 'Empire', 'Support', 'Fleet Commander', 'Crew Member'],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans'],
    true
  ),
  new BasicCharacter(
    'Grand Master Yoda',
    'GRANDMASTERYODA',
    DamageType.special,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    ['GMY'],
    false
  ),
  new BasicCharacter(
    'Grand Moff Tarkin',
    'GRANDMOFFTARKIN',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Support', 'Fleet Commander', 'Crew Member'],
    ['GMT', 'Auto Lightzader', 'Imperial Grancor Maneuver'],
    true
  ),
  new BasicCharacter(
    'Greedo',
    'GREEDO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Han Solo',
    'HANSOLO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Rebel', 'Attacker'],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans'],
    false
  ),
  new BasicCharacter(
    'Hera Syndulla',
    'HERASYNDULLAS3',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Phoenix', 'Support', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Hermit Yoda',
    'HERMITYODA',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jedi', 'Support'],
    ['Hyoda', 'Hoboda', 'Hobo', 'HY'],
    false
  ),
  new BasicCharacter(
    'HK-47',
    'HK47',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Droid', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Hoth Rebel Scout',
    'HOTHREBELSCOUT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker'],
    ['HRS', 'Hoth Bros'],
    false
  ),
  new BasicCharacter(
    'Hoth Rebel Soldier',
    'HOTHREBELSOLDIER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Support'],
    ['HRS', 'Hoth Bros'],
    false
  ),
  new BasicCharacter(
    'IG-100 MagnaGuard',
    'MAGNAGUARD',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Droid', 'Tank'],
    [],
    false
  ),
  new BasicCharacter(
    'IG-86 Sentinel Droid',
    'IG86SENTINELDROID',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Droid', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'IG-88',
    'IG88',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Droid', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Ima-Gun Di',
    'IMAGUNDI',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    ['IGD'],
    false
  ),
  new BasicCharacter(
    'Imperial Probe Droid',
    'IMPERIALPROBEDROID',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Droid', 'Support'],
    ['IPD'],
    false
  ),
  new BasicCharacter(
    'Imperial Super Commando',
    'IMPERIALSUPERCOMMANDO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Attacker', 'Crew Member'],
    ['ISC'],
    true
  ),
  new BasicCharacter(
    'Jawa',
    'JAWA',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jawa', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Jawa Engineer',
    'JAWAENGINEER',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jawa', 'Healer'],
    [],
    false
  ),
  new BasicCharacter(
    'Jawa Scavenger',
    'JAWASCAVENGER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Jawa', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Jedi Consular',
    'JEDIKNIGHTCONSULAR',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Healer', 'Crew Member'],
    ['JC'],
    true
  ),
  new BasicCharacter(
    'Jedi Knight Anakin',
    'ANAKINKNIGHT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Attacker'],
    ['JKA'],
    false
  ),
  new BasicCharacter(
    'Jedi Knight Guardian',
    'JEDIKNIGHTGUARDIAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank'],
    ['JKG'],
    false
  ),
  new BasicCharacter(
    'Jyn Erso',
    'JYNERSO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker', 'Crew Member'],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2'],
    false
  ),
  new BasicCharacter(
    'K-2SO',
    'K2SO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Droid', 'Tank', 'Crew Member'],
    ['Rogue 1', 'Cass-2SO', 'K2'],
    true
  ),
  new BasicCharacter(
    'Kanan Jarrus',
    'KANANJARRUSS3',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Phoenix', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Kit Fisto',
    'KITFISTO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Attacker'],
    ['Fisty', 'Fister'],
    false
  ),
  new BasicCharacter(
    'Kylo Ren',
    'KYLOREN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Attacker', 'Crew Member'],
    ['Old Kylo', 'zylo', 'FO'],
    true
  ),
  new BasicCharacter(
    'Kylo Ren (Unmasked)',
    'KYLORENUNMASKED',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'First Order', 'Tank', 'Crew Member'],
    ['kru', 'matt', 'Snape', 'FO'],
    true
  ),
  new BasicCharacter(
    'L3-37',
    'L3_37',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Droid', 'Tank'],
    ['#solo'],
    true
  ),
  new BasicCharacter(
    'Lando Calrissian',
    'ADMINISTRATORLANDO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Rebel', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Lobot',
    'LOBOT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Logray',
    'LOGRAY',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Support'],
    ['Murderbears'],
    false
  ),
  new BasicCharacter(
    'Luke Skywalker (Farmboy)',
    'LUKESKYWALKER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker'],
    ['farmboi'],
    false
  ),
  new BasicCharacter(
    'Luminara Unduli',
    'LUMINARAUNDULI',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Healer'],
    [],
    false
  ),
  new BasicCharacter(
    'Mace Windu',
    'MACEWINDU',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank', 'Fleet Commander', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Magmatrooper',
    'MAGMATROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Mob Enforcer',
    'HUMANTHUG',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Tank'],
    [],
    false
  ),
  new BasicCharacter(
    'Mother Talzin',
    'MOTHERTALZIN',
    DamageType.special,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Support'],
    ['MT', 'NS', 'hSTR NS'],
    false
  ),
  new BasicCharacter(
    'Nightsister Acolyte',
    'NIGHTSISTERACOLYTE',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Attacker'],
    ['NA', 'NS'],
    false
  ),
  new BasicCharacter(
    'Nightsister Initiate',
    'NIGHTSISTERINITIATE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Attacker'],
    ['NI', 'NS'],
    false
  ),
  new BasicCharacter(
    'Nightsister Spirit',
    'NIGHTSISTERSPIRIT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Attacker'],
    ['NS'],
    false
  ),
  new BasicCharacter(
    'Nightsister Zombie',
    'NIGHTSISTERZOMBIE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Tank'],
    ['NS', 'hSTR NS'],
    false
  ),
  new BasicCharacter(
    'Nute Gunray',
    'NUTEGUNRAY',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Separatist', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Obi-Wan Kenobi (Old Ben)',
    'OLDBENKENOBI',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Jedi', 'Tank'],
    ['OB'],
    false
  ),
  new BasicCharacter(
    'Old Daka',
    'DAKA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Healer'],
    ['NS', 'hSTR NS'],
    false
  ),
  new BasicCharacter(
    'Pao',
    'PAO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker'],
    ['Rogue 1', 'Chex Mix'],
    false
  ),
  new BasicCharacter(
    'Paploo',
    'PAPLOO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Tank'],
    ['Murderbears'],
    false
  ),
  new BasicCharacter(
    'Plo Koon',
    'PLOKOON',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Poe Dameron',
    'POE',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Poggle the Lesser',
    'POGGLETHELESSER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Geonosian', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Princess Leia',
    'PRINCESSLEIA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker'],
    ['Machine Gun'],
    false
  ),
  new BasicCharacter(
    'Qi\'ra',
    'QIRA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Support'],
    ['#solo'],
    false
  ),
  new BasicCharacter(
    'Qui-Gon Jinn',
    'QUIGONJINN',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    ['QGJ'],
    false
  ),
  new BasicCharacter(
    'R2-D2',
    'R2D2_LEGENDARY',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Galactic Republic', 'Rebel', 'Resistance', 'Droid', 'Support'],
    ['Trashcan', 'R2z2', 'SuperStar2D2'],
    false
  ),
  new BasicCharacter(
    'Range Trooper',
    'RANGETROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Support', 'Empire', 'Imperial Trooper'],
    ['Troopers'],
    false
  ),
  new BasicCharacter(
    'Rebel Officer Leia Organa',
    'HOTHLEIA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker'],
    ['ROLO'],
    false
  ),
  new BasicCharacter(
    'Resistance Pilot',
    'RESISTANCEPILOT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Attacker', 'Crew Member'],
    ['RP'],
    true
  ),
  new BasicCharacter(
    'Resistance Trooper',
    'RESISTANCETROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Attacker'],
    ['RT', 'res trooper'],
    false
  ),
  new BasicCharacter(
    'Rey (Jedi Training)',
    'REYJEDITRAINING',
    DamageType.physical,
    new OptimizationPlan(10, -5, 100, 100, 50, 0, 50, 0, 0, 0, 0),
    {
      'hSTR': new OptimizationPlan(10, -5, 100, 100, 50, 0, 50, 0, 0, 0, 0),
      'Arena': new OptimizationPlan(0, 0, 100, 100, 20, 0, 20, 50, 0, 0, 0)
    },
    ['Light Side', 'Resistance', 'Tank'],
    ['JTR', 'RJT', 'Jedi Rey', 'Jey Z'],
    false
  ),
  new BasicCharacter(
    'Rey (Scavenger)',
    'REY',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Attacker', 'Crew Member'],
    ['scav rey'],
    true
  ),
  new BasicCharacter(
    'Rose Tico',
    'ROSETICO',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Resistance', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Royal Guard',
    'ROYALGUARD',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Tank'],
    ['RG', 'Red Guard'],
    false
  ),
  new BasicCharacter(
    'Sabine Wren',
    'SABINEWRENS3',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Phoenix', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Savage Opress',
    'SAVAGEOPRESS',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Attacker'],
    ['zavage'],
    false
  ),
  new BasicCharacter(
    'Scarif Rebel Pathfinder',
    'SCARIFREBEL',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Rogue One', 'Tank', 'Crew Member'],
    ['Rogue 1', 'SRP'],
    true
  ),
  new BasicCharacter(
    'Shoretrooper',
    'SHORETROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Tank', 'Crew Member'],
    ['ShT', 'Troopers', 'Imperial Grancor Maneuver'],
    true
  ),
  new BasicCharacter(
    'Sith Assassin',
    'SITHASSASSIN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Attacker'],
    ['SA', 'Sassy'],
    false
  ),
  new BasicCharacter(
    'Sith Marauder',
    'SITHMARAUDER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Attacker'],
    ['SM'],
    false
  ),
  new BasicCharacter(
    'Sith Trooper',
    'SITHTROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Sith', 'Tank'],
    ['SiT', 'Nightmare'],
    false
  ),
  new BasicCharacter(
    'Snowtrooper',
    'SNOWTROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Attacker'],
    ['Troopers'],
    false
  ),
  new BasicCharacter(
    'Stormtrooper',
    'STORMTROOPER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Tank'],
    ['Troopers'],
    false
  ),
  new BasicCharacter(
    'Stormtrooper Han',
    'STORMTROOPERHAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Rebel', 'Tank'],
    ['STHan'],
    false
  ),
  new BasicCharacter(
    'Sun Fac',
    'SUNFAC',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Separatist', 'Geonosian', 'Tank', 'Crew Member'],
    [],
    true
  ),
  new BasicCharacter(
    'Talia',
    'TALIA',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Nightsister', 'Healer'],
    ['NS', 'hSTR NS'],
    false
  ),
  new BasicCharacter(
    'Teebo',
    'TEEBO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Tank'],
    ['Teebotine', 'Murderbears'],
    false
  ),
  new BasicCharacter(
    'TIE Fighter Pilot',
    'TIEFIGHTERPILOT',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Empire', 'Attacker', 'Crew Member'],
    ['TFP', 'Auto Lightzader'],
    true
  ),
  new BasicCharacter(
    'Tusken Raider',
    'TUSKENRAIDER',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Tusken', 'Attacker'],
    [],
    false
  ),
  new BasicCharacter(
    'Tusken Shaman',
    'TUSKENSHAMAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Tusken', 'Healer'],
    [],
    false
  ),
  new BasicCharacter(
    'Ugnaught',
    'UGNAUGHT',
    DamageType.mixed,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'URoRRuR\'R\'R',
    'URORRURRR',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Tusken', 'Support'],
    [],
    false
  ),
  new BasicCharacter(
    'Vandor Chewbacca',
    'YOUNGCHEWBACCA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Tank'],
    ['Dwight', '#solo'],
    false
  ),
  new BasicCharacter(
    'Veteran Smuggler Chewbacca',
    'SMUGGLERCHEWBACCA',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['Vets'],
    false
  ),
  new BasicCharacter(
    'Veteran Smuggler Han Solo',
    'SMUGGLERHAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['Vets'],
    false
  ),
  new BasicCharacter(
    'Visas Marr',
    'VISASMARR',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Healer'],
    [],
    false
  ),
  new BasicCharacter(
    'Wampa',
    'WAMPA',
    DamageType.physical,
    new OptimizationPlan(
      10, // health
      0, // protection
      100, // speed
      100, // crit damage
      10, // potency
      0, // tenacity
      50, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      0 // crit avoidance
    ),
    {},
    ['Dark Side', 'Attacker'],
    ['beast', 'Wampanader'],
    false
  ),
  new BasicCharacter(
    'Wedge Antilles',
    'WEDGEANTILLES',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Rebel', 'Attacker', 'Crew Member'],
    ['Wiggs', 'chiggs', 'SuperStar2D2'],
    true
  ),
  new BasicCharacter(
    'Wicket',
    'WICKET',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Ewok', 'Attacker'],
    ['Murderbears'],
    false
  ),
  new BasicCharacter(
    'Young Han Solo',
    'YOUNGHAN',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['YOLO', '#solo', 'Jim'],
    true
  ),
  new BasicCharacter(
    'Young Lando Calrissian',
    'YOUNGLANDO',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['#solo'],
    true
  ),
  new BasicCharacter(
    'Zam Wesell',
    'ZAMWESELL',
    DamageType.physical,
    new OptimizationPlan(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {},
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    [],
    false
  )
];

const characters = {};
const charDefaults = {};

for (let character of charactersArray) {
  characters[character.name] = character;
  charDefaults[character.name] = new BasicCharacter(
    character.name,
    character.baseId,
    character.physDmgPercent,
    character.optimizationPlan
  );
  Object.freeze(charDefaults[character.name]);
}

Object.freeze(characters);
Object.freeze(charDefaults);

export {characters, charDefaults};
