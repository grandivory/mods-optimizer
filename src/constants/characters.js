// @flow

import Character from "../domain/Character";
import {DamageType} from "../domain/Character";
import OptimizationPlan from "../domain/OptimizationPlan";
import optimizationStrategy from "./optimizationStrategy";

let charactersArray = [
  Character.statlessCharacter(
    'Aayla Secura',
    'AAYLASECURA',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 75, 50, 0, 25, 0, 100, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 75, 50, 0, 25, 0, 100, 0, 0, 0, 0),
      'hSTR P1 Jedi': new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Jedi', 'Galactic Republic', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Admiral Ackbar',
    'ADMIRALACKBAR',
    DamageType.physical,
    new OptimizationPlan('Survivability', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0),
    {
      'Survivability': new OptimizationPlan('Survivability', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Support', 'Fleet Commander', 'Crew Member'],
    ['AA', 'Snackbar', 'ABC'],
    true
  ),
  Character.statlessCharacter(
    'Ahsoka Tano',
    'AHSOKATANO',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Light Side', 'Jedi', 'Galactic Republic', 'Attacker', 'Crew Member'],
    ['Snips'],
    true
  ),
  Character.statlessCharacter(
    'Ahsoka Tano (Fulcrum)',
    'FULCRUMAHSOKA',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Light Side', 'Rebel', 'Attacker'],
    ['ATF', 'FAT'],
    false
  ),
  Character.statlessCharacter(
    'Amilyn Holdo',
    'AMILYNHOLDO',
    DamageType.mixed,
    new OptimizationPlan('PvP', 20, 10, 100, 0, 50, 25, 0, 0, 0, 5, 5, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 20, 10, 100, 0, 50, 25, 0, 0, 0, 5, 5, 0, 0)
    },
    ['Light Side', 'Resistance', 'Tank'],
    ['Hodor'],
    false
  ),
  Character.statlessCharacter(
    'Asajj Ventress',
    'ASAJVENTRESS',
    DamageType.mixed,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 10, 20, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 10, 10, 20, 0, 0, 0, 0),
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 15, 0, 50, 100, 0, 0, 30, 30, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Separatist', 'Support'],
    ['AV', 'Zen', 'NS', 'hSTR NS', 'ABC'],
    false
  ),
  Character.statlessCharacter(
    'Aurra Sing',
    'AURRA_SING',
    DamageType.physical,
    new OptimizationPlan('hSTR Phase 3', 0, 0, 75, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0),
    {
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, 0, 75, 100, 0, 0, 50, 0, 10, 0, 0, 0, 0),
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 80, 20, 0, 50, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    []
  ),
  Character.statlessCharacter(
    'B2 Super Battle Droid',
    'B2SUPERBATTLEDROID',
    DamageType.physical,
    new OptimizationPlan('Survival', 50, 50, 0, 0, 50, 25, 0, 0, 0, 0, 0, 50, 0),
    {
      'Survival': new OptimizationPlan('Survival', 50, 50, 0, 0, 50, 25, 0, 0, 0, 0, 0, 50, 0)
    },
    ['Dark Side', 'Separatist', 'Droid', 'Tank'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Barriss Offee',
    'BARRISSOFFEE',
    DamageType.physical,
    new OptimizationPlan('PvP', 50, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 50, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      'hSTR P1 Jedi': new OptimizationPlan('hSTR P1 Jedi', 75, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Jedi', 'Galactic Republic', 'Healer'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Bastila Shan',
    'BASTILASHAN',
    DamageType.special,
    new OptimizationPlan('Leader', 10, 0, 100, 0, 50, 0, 0, 25, 0, 0, 0, 0, 0),
    {
      'Leader': new OptimizationPlan('Leader', 10, 0, 100, 0, 50, 0, 0, 25, 0, 0, 0, 0, 0),
      'Non-leader': optimizationStrategy["Special Damage with Potency"].rename('Non-leader'),
      'hSTR P2 Jedi': new OptimizationPlan('hSTR P2 Jedi', 0, 0, 100, 50, 0, 0, 0, 25, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Jedi', 'Old Republic', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Baze Malbus',
    'BAZEMALBUS',
    DamageType.physical,
    new OptimizationPlan('Slow Tank', 50, 50, 0, 0, 10, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'Slow Tank': new OptimizationPlan('Slow Tank', 50, 50, 0, 0, 10, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 10, 10, -100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Tank'],
    ['Rogue 1', 'Chaze', 'Chiggs'],
    false
  ),
  Character.statlessCharacter(
    'BB-8',
    'BB8',
    DamageType.physical,
    new OptimizationPlan('PvP', 5, 5, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 5, 5, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0),
      'hSTR Phase 1': new OptimizationPlan('hSTR Phase 1', 10, -5, 100, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Resistance', 'Droid', 'Support'],
    ['bb8', 'Wampanader', 'ABC'],
    false
  ),
  Character.statlessCharacter(
    'Biggs Darklighter',
    'BIGGSDARKLIGHTER',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, and Physical Damage'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, and Physical Damage'].rename('PvP')
    },
    ['Light Side', 'Rebel', 'Support', 'Crew Member'],
    ['Wiggs', 'Chiggs'],
    true
  ),
  Character.statlessCharacter(
    'Bistan',
    'BISTAN',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker', 'Crew Member'],
    ['Rogue 1', 'SuperStar2D2'],
    true
  ),
  Character.statlessCharacter(
    'Boba Fett',
    'BOBAFETT',
    DamageType.physical,
    new OptimizationPlan('PvE', 0, 0, 50, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 0, 0, 50, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0),
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
      'hSTR Phase 2': new OptimizationPlan('hSTR Phase 2', 0, 0, 100, 75, 0, 0, 25, 0, 50, 0, 0, 0, 0),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Bodhi Rook',
    'BODHIROOK',
    DamageType.physical,
    new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Support'],
    ['Rogue 1'],
    false
  ),
  Character.statlessCharacter(
    'Bossk',
    'BOSSK',
    DamageType.physical,
    new OptimizationPlan('Leader', 20, 20, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0),
    {
      'Leader': new OptimizationPlan('Leader', 20, 20, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0),
      'Non-leader': new OptimizationPlan('Non-leader', 20, 0, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Tank'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Cad Bane',
    'CADBANE',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Support'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Captain Han Solo',
    'HOTHHAN',
    DamageType.physical,
    new OptimizationPlan('PvP', 20, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 20, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Rebel', 'Support'],
    ['CHS', 'CHolo', 'Snolo', 'Hoth Han'],
    false
  ),
  Character.statlessCharacter(
    'Captain Phasma',
    'PHASMA',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 25, 25, 0, 25, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'First Order', 'Support', 'Crew Member'],
    ['FO'],
    true
  ),
  Character.statlessCharacter(
    'Cassian Andor',
    'CASSIANANDOR',
    DamageType.mixed,
    new OptimizationPlan('PvP', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 20, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Support', 'Crew Member'],
    ['Rogue 1', 'SuperStar2D2'],
    true
  ),
  Character.statlessCharacter(
    'CC-2224 "Cody"',
    'CC2224',
    DamageType.mixed,
    new OptimizationPlan('Leader', 0, 0, 100, 50, 25, 0, 25, 0, 50, 12.5, 12.5, 0, 0),
    {
      'Leader': new OptimizationPlan('Leader', 0, 0, 100, 50, 25, 0, 25, 0, 50, 12.5, 12.5, 0, 0),
      'Non-leader': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Non-leader')
    },
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Attacker'],
    ['zody'],
    false
  ),
  Character.statlessCharacter(
    'Chewbacca',
    'CHEWBACCALEGENDARY',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      'Chew Mix': new OptimizationPlan('Chew Mix', 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, true)
    },
    ['Light Side', 'Rebel', 'Scoundrel', 'Smuggler', 'Attacker'],
    ['Chex Mix'],
    false
  ),
  Character.statlessCharacter(
    'Chief Chirpa',
    'CHIEFCHIRPA',
    DamageType.physical,
    optimizationStrategy.Speed,
    {
      'Speed': optimizationStrategy.Speed
    },
    ['Light Side', 'Ewok', 'Support'],
    ['Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'Chief Nebit',
    'CHIEFNEBIT',
    DamageType.physical,
    new OptimizationPlan('PvP', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Jawa', 'Tank'],
    ['nebs'],
    false
  ),
  Character.statlessCharacter(
    'Chirrut Îmwe',
    'CHIRRUTIMWE',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 20, 25, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 20, 25, 0, 50, 0, 0, 0, 0),
      'Chex Mix': optimizationStrategy['Speedy Chex Mix'].rename('Chex Mix')
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker'],
    ['Rogue 1', 'Chaze', 'Chiggs', 'Chex Mix'],
    false
  ),
  Character.statlessCharacter(
    'Chopper',
    'CHOPPERS3',
    DamageType.physical,
    new OptimizationPlan('PvP', 20, 40, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 20, 40, 100, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Phoenix', 'Droid', 'Support', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Clone Sergeant - Phase I',
    'CLONESERGEANTPHASEI',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Attacker', 'Crew Member'],
    ['Sarge'],
    true
  ),
  Character.statlessCharacter(
    'Clone Wars Chewbacca',
    'CLONEWARSCHEWBACCA',
    DamageType.physical,
    new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Scoundrel', 'Tank'],
    ['CWC'],
    false
  ),
  Character.statlessCharacter(
    'Colonel Starck',
    'COLONELSTARCK',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 10, 5, 0, 5, 0, 5, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 10, 5, 0, 5, 0, 5, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Support'],
    ['Tony Stark', 'Troopers'],
    false
  ),
  Character.statlessCharacter(
    'Commander Luke Skywalker',
    'COMMANDERLUKESKYWALKER',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 25, 0, 50, 0, 0, 0, 0),
      'Chex Mix': optimizationStrategy['Speedy Chex Mix'].rename('Chex Mix'),
      'Raids': new OptimizationPlan('Raids', 0, 0, 100, 0, 25, 0, 25, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Attacker'],
    ['CLS', 'Wampanader', 'Chex Mix', 'ABC', 'Titans'],
    false
  ),
  Character.statlessCharacter(
    'Coruscant Underworld Police',
    'CORUSCANTUNDERWORLDPOLICE',
    DamageType.physical,
    new OptimizationPlan('Why?', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'Why?': new OptimizationPlan('Why?', 0, 0, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Support'],
    ['CUP'],
    false
  ),
  Character.statlessCharacter(
    'Count Dooku',
    'COUNTDOOKU',
    DamageType.mixed,
    new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 50, 25, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 50, 25, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Separatist', 'Sith', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'CT-21-0408 "Echo"',
    'CT210408',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'CT-5555 "Fives"',
    'CT5555',
    DamageType.physical,
    new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Tank', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'CT-7567 "Rex"',
    'CT7567',
    DamageType.physical,
    new OptimizationPlan('PvP', 10, 0, 100, 0, 10, 20, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 0, 100, 0, 10, 20, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Clone Trooper', 'Support', 'Crew Member'],
    ['Titans'],
    true
  ),
  Character.statlessCharacter(
    'Darth Maul',
    'MAUL',
    DamageType.physical,
    optimizationStrategy['Special Damage with Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Special Damage with Potency'].rename('PvP')
    },
    ['Dark Side', 'Sith', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Darth Nihilus',
    'DARTHNIHILUS',
    DamageType.special,
    new OptimizationPlan('PvP', 10, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Sith', 'Support'],
    ['Nightmare'],
    false
  ),
  Character.statlessCharacter(
    'Darth Sidious',
    'DARTHSIDIOUS',
    DamageType.physical,
    optimizationStrategy['Special Damage with Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Special Damage with Potency'].rename('PvP')
    },
    ['Dark Side', 'Sith', 'Attacker'],
    ['Auto Lightzader'],
    false
  ),
  Character.statlessCharacter(
    'Darth Sion',
    'DARTHSION',
    DamageType.physical,
    new OptimizationPlan('PvP', 15, 15, 100, 20, 15, 0, 20, 0, 20, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 15, 15, 100, 20, 15, 0, 20, 0, 20, 0, 0, 0, 0)
    },
    ['Dark Side', 'Sith', 'Tank'],
    ['Nightmare'],
    false
  ),
  Character.statlessCharacter(
    'Darth Traya',
    'DARTHTRAYA',
    DamageType.special,
    new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 0, 50, 10, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 0, 0, 50, 10, 0, 0, 0, 0)
    },
    ['Dark Side', 'Sith', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Darth Vader',
    'VADER',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
      'Raids': new OptimizationPlan('Raids', 0, 0, 100, 50, 25, 0, 25, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Sith', 'Attacker', 'Crew Member'],
    ['Auto Lightzader', 'Wampanader', 'Nightmare'],
    true
  ),
  Character.statlessCharacter(
    'Dathcha',
    'DATHCHA',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Jawa', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Death Trooper',
    'DEATHTROOPER',
    DamageType.physical,
    new OptimizationPlan('Damage', 0, 0, 80, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0),
    {
      'Damage': new OptimizationPlan('Damage', 0, 0, 80, 100, 25, 0, 25, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Attacker', 'Crew Member'],
    ['Troopers', 'Chex Mix'],
    true
  ),
  Character.statlessCharacter(
    'Dengar',
    'DENGAR',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 25, 0, 75, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 25, 0, 75, 0, 0, 0, 0),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 50, 0, 0, 100, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Director Krennic',
    'DIRECTORKRENNIC',
    DamageType.special,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Support'],
    ['Imperial Grancor Maneuver'],
    false
  ),
  Character.statlessCharacter(
    'Eeth Koth',
    'EETHKOTH',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Embo',
    'EMBO',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 20, 100, 100, 0, 0, 25, 0, 25, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 20, 100, 100, 0, 0, 25, 0, 25, 0, 0, 0, 0),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, 0, 50, 25, 0, 0, 75, 0, 100, 0, 0, 0, 0)
    },
    ['Dark Side', 'Bounty Hunter', 'Scoundrel', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Emperor Palpatine',
    'EMPERORPALPATINE',
    DamageType.special,
    optimizationStrategy['Special Damage with Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Special Damage with Potency'].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Sith', 'Support'],
    ['EP', 'Palp', 'EzPz', 'Nightmare'],
    false
  ),
  Character.statlessCharacter(
    'Enfys Nest',
    'ENFYSNEST',
    DamageType.physical,
    new OptimizationPlan('Speedy', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'Speedy': new OptimizationPlan('Speedy', 0, 0, 100, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0),
      'Offense': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Offense'),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 25, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['Nesty', 'Baby Wampa', '#solo'],
    false
  ),
  Character.statlessCharacter(
    'Ewok Elder',
    'EWOKELDER',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 0, 100, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Ewok', 'Healer'],
    ['EE', 'Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'Ewok Scout',
    'EWOKSCOUT',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Light Side', 'Ewok', 'Attacker'],
    ['Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'Ezra Bridger',
    'EZRABRIDGERS3',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
      'hSTR P1 Jedi': new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 50, 0, 50, 0, 0, 0, 0),
      'hSTR P2 Jedi': new OptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 75, 0, 75, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Phoenix', 'Jedi', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Finn',
    'FINN',
    DamageType.physical,
    optimizationStrategy['Slow Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Slow Crit, Physical Damage, Potency'].rename('PvP')
    },
    ['Light Side', 'Resistance', 'Tank', 'Crew Member'],
    ['Zinn'],
    true
  ),
  Character.statlessCharacter(
    'First Order Executioner',
    'FIRSTORDEREXECUTIONER',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 0, 100, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0)
    },
    ['Dark Side', 'First Order', 'Attacker'],
    ['Fox', 'Panda', 'Foe', 'FO'],
    false
  ),
  Character.statlessCharacter(
    'First Order Officer',
    'FIRSTORDEROFFICERMALE',
    DamageType.physical,
    optimizationStrategy.Speed,
    {
      'Speed': optimizationStrategy.Speed
    },
    ['Dark Side', 'First Order', 'Support'],
    ['Foo', 'FO'],
    false
  ),
  Character.statlessCharacter(
    'First Order SF TIE Pilot',
    'FIRSTORDERSPECIALFORCESPILOT',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'First Order', 'Attacker', 'Crew Member'],
    ['SFTP', 'FO'],
    true
  ),
  Character.statlessCharacter(
    'First Order Stormtrooper',
    'FIRSTORDERTROOPER',
    DamageType.physical,
    new OptimizationPlan('PvP', 20, 20, 100, 50, 50, 25, 0, 0, 0, 5, 5, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 20, 20, 100, 50, 50, 25, 0, 0, 0, 5, 5, 0, 0)
    },
    ['Dark Side', 'First Order', 'Tank', 'Crew Member'],
    ['FOST', 'FO'],
    true
  ),
  Character.statlessCharacter(
    'First Order TIE Pilot',
    'FIRSTORDERTIEPILOT',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'First Order', 'Attacker', 'Crew Member'],
    ['FOTP', 'FO'],
    true
  ),
  Character.statlessCharacter(
    'Gamorrean Guard',
    'GAMORREANGUARD',
    DamageType.physical,
    new OptimizationPlan('PvP', 20, 0, 100, 0, 50, 25, 25, 0, 0, 5, 5, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 20, 0, 100, 0, 50, 25, 25, 0, 0, 5, 5, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Tank'],
    ['Piggy'],
    false
  ),
  Character.statlessCharacter(
    'Gar Saxon',
    'GARSAXON',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Tank', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Garazeb "Zeb" Orrelios',
    'ZEBS3',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 40, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 40, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Phoenix', 'Tank', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'General Grievous',
    'GRIEVOUS',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Separatist', 'Droid', 'Attacker'],
    ['GG'],
    false
  ),
  Character.statlessCharacter(
    'General Kenobi',
    'GENERALKENOBI',
    DamageType.physical,
    new OptimizationPlan('Balanced', 50, 100, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0),
    {
      'Speedy Tank': new OptimizationPlan('Speedy Tank', 25, 50, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      'Balanced': new OptimizationPlan('Balanced', 50, 100, 50, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0),
      'Slow Tank': new OptimizationPlan('Slow Tank', 50, 100, 0, 0, 0, 50, 0, 0, 0, 25, 25, 0, 0),
      'hSTR P2 Jedi': new OptimizationPlan('hSTR P2 Jedi', 0, 100, 50, 0, 0, 0, 10, 0, 25, 100, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank'],
    ['GK', 'Titans'],
    false
  ),
  Character.statlessCharacter(
    'General Veers',
    'VEERS',
    DamageType.mixed,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Support'],
    ['Troopers'],
    false
  ),
  Character.statlessCharacter(
    'Geonosian Soldier',
    'GEONOSIANSOLDIER',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Dark Side', 'Separatist', 'Geonosian', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Geonosian Spy',
    'GEONOSIANSPY',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Dark Side', 'Separatist', 'Geonosian', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Grand Admiral Thrawn',
    'GRANDADMIRALTHRAWN',
    DamageType.special,
    optimizationStrategy['Speed with survivability'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed with survivability'].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Support', 'Fleet Commander', 'Crew Member'],
    ['GAT', 'Imperial Grancor Maneuver', 'Wampanader', 'ABC', 'Titans'],
    true
  ),
  Character.statlessCharacter(
    'Grand Master Yoda',
    'GRANDMASTERYODA',
    DamageType.special,
    new OptimizationPlan('PvP', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 50, 25, 0, 0, 80, 25, 0, 0, 0, 0),
      'hSTR P1 Jedi': new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 100, 0, 0, 0, 100, 50, 0, 0, 0, 0),
      'hSTR P2 Jedi': new OptimizationPlan('hSTR P2 Jedi', 0, 0, 60, 100, 0, 0, 0, 75, 80, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    ['GMY'],
    false
  ),
  Character.statlessCharacter(
    'Grand Moff Tarkin',
    'GRANDMOFFTARKIN',
    DamageType.mixed,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 15, 15, 50, 0, 0, 0 ),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 25, 0, 15, 15, 50, 0, 0, 0 )
    },
    ['Dark Side', 'Empire', 'Support', 'Fleet Commander', 'Crew Member'],
    ['GMT', 'Auto Lightzader', 'Imperial Grancor Maneuver'],
    true
  ),
  Character.statlessCharacter(
    'Greedo',
    'GREEDO',
    DamageType.physical,
    new OptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0),
    {
      'Crits': new OptimizationPlan('Crits', 0, 0, 100, 50, 25, 0, 25, 0, 100, 0, 0, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Han Solo',
    'HANSOLO',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('Fast Han'),
    {
      'Fast Han': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('Fast Han'),
      'Slow Han': new OptimizationPlan('Slow Han', 0, 0, 0, 100, 25, 0, 50, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Rebel', 'Attacker'],
    ['Raid Han', 'rHan', 'OG Han', 'Zolo', 'Chex Mix', 'Titans'],
    false
  ),
  Character.statlessCharacter(
    'Hera Syndulla',
    'HERASYNDULLAS3',
    DamageType.physical,
    optimizationStrategy['Speedy debuffer'].rename('Speed'),
    {
      'Speed': optimizationStrategy['Speedy debuffer'].rename('Speed')
    },
    ['Light Side', 'Rebel', 'Phoenix', 'Support', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Hermit Yoda',
    'HERMITYODA',
    DamageType.mixed,
    optimizationStrategy.Speed,
    {
      'Speed': optimizationStrategy.Speed
    },
    ['Light Side', 'Jedi', 'Support'],
    ['Hyoda', 'Hoboda', 'Hobo', 'HY'],
    false
  ),
  Character.statlessCharacter(
    'HK-47',
    'HK47',
    DamageType.physical,
    new OptimizationPlan('Leader', 0, 0, 100, 50, 50, 0, 25, 0, 100, 0, 0, 0, 0),
    {
      'Leader': new OptimizationPlan('Leader', 0, 0, 100, 50, 50, 0, 25, 0, 100, 0, 0, 0, 0)
    },
    ['Dark Side', 'Droid', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Hoth Rebel Scout',
    'HOTHREBELSCOUT',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvE'),
    {
      'PvE': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvE')
    },
    ['Light Side', 'Rebel', 'Attacker'],
    ['HRS', 'Hoth Bros'],
    false
  ),
  Character.statlessCharacter(
    'Hoth Rebel Soldier',
    'HOTHREBELSOLDIER',
    DamageType.physical,
    new OptimizationPlan('PvE', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 25, 25, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Support'],
    ['HRS', 'Hoth Bros'],
    false
  ),
  Character.statlessCharacter(
    'IG-100 MagnaGuard',
    'MAGNAGUARD',
    DamageType.physical,
    new OptimizationPlan('Balanced', 20, 20, 100, 25, 50, 25, 25, 0, 25, 12.5, 12.5, 0, 0),
    {
      'Balanced': new OptimizationPlan('Balanced', 20, 20, 100, 25, 50, 25, 25, 0, 25, 12.5, 12.5, 0, 0)
    },
    ['Dark Side', 'Separatist', 'Droid', 'Tank'],
    [],
    false
  ),
  Character.statlessCharacter(
    'IG-86 Sentinel Droid',
    'IG86SENTINELDROID',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Dark Side', 'Droid', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'IG-88',
    'IG88',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('Damage'),
    {
      'Damage': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('Damage')
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Droid', 'Attacker'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Ima-Gun Di',
    'IMAGUNDI',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    ['IGD'],
    false
  ),
  Character.statlessCharacter(
    'Imperial Probe Droid',
    'IMPERIALPROBEDROID',
    DamageType.physical,
    new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 50, 50, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      'Offense': new OptimizationPlan('Offense', 0, 0, 100, 80, 50, 0, 25, 0, 50, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Droid', 'Support'],
    ['IPD'],
    false
  ),
  Character.statlessCharacter(
    'Imperial Super Commando',
    'IMPERIALSUPERCOMMANDO',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Attacker', 'Crew Member'],
    ['ISC'],
    true
  ),
  Character.statlessCharacter(
    'Jango Fett',
    'JANGOFETT',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Attacker', 'Bounty Hunter', 'Scoundrel'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Jawa',
    'JAWA',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Jawa', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Jawa Engineer',
    'JAWAENGINEER',
    DamageType.mixed,
    new OptimizationPlan('PvP', 10, 0, 100, 0, 50, 10, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 0, 100, 0, 50, 10, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Jawa', 'Healer'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Jawa Scavenger',
    'JAWASCAVENGER',
    DamageType.physical,
    new OptimizationPlan('PvE', 0, 0, 100, 25, 50, 0, 25, 0, 100, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 0, 0, 100, 25, 50, 0, 25, 0, 100, 0, 0, 0, 0)
    },
    ['Light Side', 'Jawa', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Jedi Consular',
    'JEDIKNIGHTCONSULAR',
    DamageType.mixed,
    new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'Healer': new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Healer', 'Crew Member'],
    ['JC'],
    true
  ),
  Character.statlessCharacter(
    'Jedi Knight Anakin',
    'ANAKINKNIGHT',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 75, 25, 0, 25, 0, 80, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 75, 25, 0, 25, 0, 80, 0, 0, 0, 0),
      'Chex Mix': new OptimizationPlan('Chex Mix', 0, 0, 50, 0, 0, 0, 100, 0, 25, 0, 0, 0, 0),
      'hSTR P1 Jedi': new OptimizationPlan('hSTR P1 Jedi', 0, -5, 20, 100, 0, 0, 50, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Attacker'],
    ['JKA'],
    false
  ),
  Character.statlessCharacter(
    'Jedi Knight Guardian',
    'JEDIKNIGHTGUARDIAN',
    DamageType.physical,
    new OptimizationPlan('PvE', 40, 20, 100, 0, 50, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 40, 20, 100, 0, 50, 25, 0, 0, 0, 12.5, 12.5, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank'],
    ['JKG'],
    false
  ),
  Character.statlessCharacter(
    'Jolee Bindo',
    'JOLEEBINDO',
    DamageType.physical,
    new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'Healer': new OptimizationPlan('Healer', 50, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Jedi', 'Old Republic', 'Healer'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Jyn Erso',
    'JYNERSO',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 20, 0, 75, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker', 'Crew Member'],
    ['Rogue 1', 'Auto Lightzader', 'Imperial Grancor Maneuver', 'SuperStar2D2'],
    false
  ),
  Character.statlessCharacter(
    'K-2SO',
    'K2SO',
    DamageType.physical,
    new OptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 20, 20, 100, 0, 50, 50, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Droid', 'Tank', 'Crew Member'],
    ['Rogue 1', 'Cass-2SO', 'K2'],
    true
  ),
  Character.statlessCharacter(
    'Kanan Jarrus',
    'KANANJARRUSS3',
    DamageType.physical,
    new OptimizationPlan('Tanky', 0, 40, 100, 0, 30, 0, 0, 0, 50, 0, 0, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 0, 40, 100, 0, 30, 0, 0, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Phoenix', 'Tank', 'Crew Member', 'Jedi'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Kit Fisto',
    'KITFISTO',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE')
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Attacker'],
    ['Fisty', 'Fister'],
    false
  ),
  Character.statlessCharacter(
    'Kylo Ren',
    'KYLOREN',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Dark Side', 'First Order', 'Attacker', 'Crew Member'],
    ['Old Kylo', 'zylo', 'FO'],
    true
  ),
  Character.statlessCharacter(
    'Kylo Ren (Unmasked)',
    'KYLORENUNMASKED',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Dark Side', 'First Order', 'Tank', 'Crew Member'],
    ['kru', 'matt', 'Snape', 'FO'],
    true
  ),
  Character.statlessCharacter(
    'L3-37',
    'L3_37',
    DamageType.physical,
    new OptimizationPlan('Tanky', 40, 20, 50, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 40, 20, 50, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
      'Speedy': new OptimizationPlan('Speedy', 40, 20, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Droid', 'Tank'],
    ['#solo'],
    true
  ),
  Character.statlessCharacter(
    'Lando Calrissian',
    'ADMINISTRATORLANDO',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 25, 0, 75, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 25, 0, 75, 0, 0, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Rebel', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Lobot',
    'LOBOT',
    DamageType.physical,
    new OptimizationPlan('PvE', 0, 0, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 0, 0, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0)
    },
    ['Light Side', 'Rebel', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Logray',
    'LOGRAY',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 0, 25, 20, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Ewok', 'Support'],
    ['Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'Luke Skywalker (Farmboy)',
    'LUKESKYWALKER',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Rebel', 'Attacker'],
    ['farmboi'],
    false
  ),
  Character.statlessCharacter(
    'Luminara Unduli',
    'LUMINARAUNDULI',
    DamageType.physical,
    new OptimizationPlan('PvE', 40, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 40, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Healer'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Mace Windu',
    'MACEWINDU',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE')
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank', 'Fleet Commander', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Magmatrooper',
    'MAGMATROOPER',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
      'Anti-Traya': new OptimizationPlan('Anti-Traya', 0, 0, 25, 25, 50, 0, 25, 0, 25, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Mission Vao',
    'MISSIONVAO',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 75, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Old Republic', 'Scoundrel', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Mob Enforcer',
    'HUMANTHUG',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Really?'),
    {
      'Really?': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Really?')
    },
    ['Dark Side', 'Scoundrel', 'Tank'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Mother Talzin',
    'MOTHERTALZIN',
    DamageType.special,
    new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 0, 25, 10, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 0, 50, 0, 0, 25, 10, 0, 0, 0, 0),
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 0, 75, 25, 0, 0, 0, 0),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, -5, 0, 0, 10, 0, 0, 100, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Support'],
    ['MT', 'NS', 'hSTR NS'],
    false
  ),
  Character.statlessCharacter(
    'Nightsister Acolyte',
    'NIGHTSISTERACOLYTE',
    DamageType.mixed,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 0, 80, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 50, 0, 80, 0, 0, 0, 0),
      'hSTR Phase 2': new OptimizationPlan('hSTR Phase 2', 0, 0, 100, 100, 0, 0, 100, 0, 100, 0, 0, 0, 0),
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 100, 0, 0, 50, 0, 100, 0, 0, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Attacker'],
    ['NA', 'NS'],
    false
  ),
  Character.statlessCharacter(
    'Nightsister Initiate',
    'NIGHTSISTERINITIATE',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvE'),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 0, 0, 0, 50, 0, 100, 0, 0, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Attacker'],
    ['NI', 'NS'],
    false
  ),
  Character.statlessCharacter(
    'Nightsister Spirit',
    'NIGHTSISTERSPIRIT',
    DamageType.physical,
    new OptimizationPlan('PvE', 0, 0, 100, 50, 25, 0, 75, 0, 50, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 0, 0, 100, 50, 25, 0, 75, 0, 50, 0, 0, 0, 0),
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"],
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 0, 0, 0, 40, 0, 0, 100, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Attacker'],
    ['NS'],
    false
  ),
  Character.statlessCharacter(
    'Nightsister Zombie',
    'NIGHTSISTERZOMBIE',
    DamageType.physical,
    new OptimizationPlan('Weak Zombie', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false),
    {
      'Weak Zombie': new OptimizationPlan('Weak Zombie', 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, false),
      'Strong Zombie': new OptimizationPlan('Strong Zombie', 20, 20, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0),
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, true),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Tank'],
    ['NS', 'hSTR NS'],
    false
  ),
  Character.statlessCharacter(
    'Nute Gunray',
    'NUTEGUNRAY',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Damage'),
    {
      'Damage': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('Damage')
    },
    ['Dark Side', 'Scoundrel', 'Separatist', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Obi-Wan Kenobi (Old Ben)',
    'OLDBENKENOBI',
    DamageType.physical,
    new OptimizationPlan('Speed', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'Speed': new OptimizationPlan('Speed', 10, 10, 100, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Jedi', 'Tank'],
    ['OB'],
    false
  ),
  Character.statlessCharacter(
    'Old Daka',
    'DAKA',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 0, 100, 0, 25, 15, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 0, 100, 0, 25, 15, 0, 0, 0, 0, 0, 0, 0),
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
      'hSTR Phase 3': new OptimizationPlan('hSTR Phase 3', 50, 0, 75, 0, 15, 0, 5, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Nightsister', 'Healer'],
    ['NS', 'hSTR NS'],
    false
  ),
  Character.statlessCharacter(
    'Pao',
    'PAO',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
      'Chex Mix': optimizationStrategy["Speedy Chex Mix"].rename('Chex Mix')
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Attacker'],
    ['Rogue 1', 'Chex Mix'],
    false
  ),
  Character.statlessCharacter(
    'Paploo',
    'PAPLOO',
    DamageType.physical,
    new OptimizationPlan('Fast Tank', 25, 25, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'Fast Tank': new OptimizationPlan('Fast Tank', 25, 25, 100, 0, 0, 25, 0, 0, 0, 12.5, 12.5, 0, 0)
    },
    ['Light Side', 'Ewok', 'Tank'],
    ['Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'Plo Koon',
    'PLOKOON',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Tank', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Poe Dameron',
    'POE',
    DamageType.physical,
    optimizationStrategy['Speedy debuffer'].rename('Speed'),
    {
      'Speed': optimizationStrategy['Speedy debuffer'].rename('Speed')
    },
    ['Light Side', 'Resistance', 'Tank', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Poggle the Lesser',
    'POGGLETHELESSER',
    DamageType.physical,
    new OptimizationPlan('PvE', 0, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 0, 0, 100, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Separatist', 'Geonosian', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Princess Leia',
    'PRINCESSLEIA',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, and Physical Damage'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, and Physical Damage'].rename('PvP'),
      'hSTR Phase 2': new OptimizationPlan('hSTR Phase 2', 0, 0, 50, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Attacker'],
    ['Machine Gun'],
    false
  ),
  Character.statlessCharacter(
    'Qi\'ra',
    'QIRA',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Light Side', 'Scoundrel', 'Support'],
    ['#solo'],
    false
  ),
  Character.statlessCharacter(
    'Qui-Gon Jinn',
    'QUIGONJINN',
    DamageType.mixed,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
      'hSTR P1 Jedi': new OptimizationPlan('hSTR P1 Jedi', 0, -5, 100, 75, 0, 0, 25, 25, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Jedi', 'Support'],
    ['QGJ'],
    false
  ),
  Character.statlessCharacter(
    'R2-D2',
    'R2D2_LEGENDARY',
    DamageType.mixed,
    new OptimizationPlan('PvP', 5, 5, 100, 0, 25, 10, 0, 0, 25, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 5, 5, 100, 0, 25, 10, 0, 0, 25, 0, 0, 0, 0),
      'hSTR Phase 1': new OptimizationPlan('hSTR Phase 1', 10, -5, 100, 25, 25, 0, 25, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Galactic Republic', 'Rebel', 'Resistance', 'Droid', 'Support'],
    ['Trashcan', 'R2z2', 'SuperStar2D2'],
    false
  ),
  Character.statlessCharacter(
    'Range Trooper',
    'RANGETROOPER',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Dark Side', 'Support', 'Empire', 'Imperial Trooper'],
    ['Troopers'],
    false
  ),
  Character.statlessCharacter(
    'Rebel Officer Leia Organa',
    'HOTHLEIA',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 25, 0, 30, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 50, 50, 0, 25, 0, 30, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Attacker'],
    ['ROLO'],
    false
  ),
  Character.statlessCharacter(
    'Resistance Pilot',
    'RESISTANCEPILOT',
    DamageType.physical,
    optimizationStrategy['Slow Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Slow Crit, Physical Damage, Potency'].rename('PvP')
    },
    ['Light Side', 'Resistance', 'Attacker', 'Crew Member'],
    ['RP'],
    true
  ),
  Character.statlessCharacter(
    'Resistance Trooper',
    'RESISTANCETROOPER',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 10, 100, 25, 0, 50, 0, 100, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 10, 100, 25, 0, 50, 0, 100, 0, 0, 0, 0),
      'hSTR Phase 1': new OptimizationPlan('hSTR Phase 1', 0, -5, 0, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Resistance', 'Attacker'],
    ['RT', 'res trooper'],
    false
  ),
  Character.statlessCharacter(
    'Rey (Jedi Training)',
    'REYJEDITRAINING',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 20, 0, 20, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 20, 0, 20, 0, 50, 0, 0, 0, 0),
      'hSTR Phase 1': new OptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 50, 0, 50, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Resistance', 'Tank'],
    ['JTR', 'RJT', 'Jedi Rey', 'Jey Z'],
    false
  ),
  Character.statlessCharacter(
    'Rey (Scavenger)',
    'REY',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 100, 0, 0, 25, 0, 50, 0, 0, 0, 0),
      'hSTR Phase 1': new OptimizationPlan('hSTR Phase 1', 0, -5, 90, 100, 0, 0, 50, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Resistance', 'Attacker', 'Crew Member'],
    ['scav rey'],
    true
  ),
  Character.statlessCharacter(
    'Rose Tico',
    'ROSETICO',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Resistance', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Royal Guard',
    'ROYALGUARD',
    DamageType.physical,
    new OptimizationPlan('Tanky', 50, 50, 25, 0, 0, 25, 0, 0, 0, 5, 5, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 50, 50, 25, 0, 0, 25, 0, 0, 0, 5, 5, 0, 0)
    },
    ['Dark Side', 'Empire', 'Tank'],
    ['RG', 'Red Guard'],
    false
  ),
  Character.statlessCharacter(
    'Sabine Wren',
    'SABINEWRENS3',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
      'hSTR Phase 2': new OptimizationPlan('hSTR Phase 2', 20, 20, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Phoenix', 'Attacker', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'Savage Opress',
    'SAVAGEOPRESS',
    DamageType.physical,
    new OptimizationPlan('Balanced', 50, 0, 100, 25, 25, 25, 25, 0, 25, 12.5, 12.5, 0, 0),
    {
      'Balanced': new OptimizationPlan('Balanced', 50, 0, 100, 25, 25, 25, 25, 0, 25, 12.5, 12.5, 0, 0)
    },
    ['Dark Side', 'Sith', 'Attacker'],
    ['zavage'],
    false
  ),
  Character.statlessCharacter(
    'Scarif Rebel Pathfinder',
    'SCARIFREBEL',
    DamageType.physical,
    new OptimizationPlan('PvP', 20, 20, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 20, 20, 100, 0, 25, 10, 0, 0, 0, 0, 0, 0, 0),
      'hSTR Phase 2': new OptimizationPlan('hSTR Phase 2', 20, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Rebel', 'Rogue One', 'Tank', 'Crew Member'],
    ['Rogue 1', 'SRP'],
    true
  ),
  Character.statlessCharacter(
    'Shoretrooper',
    'SHORETROOPER',
    DamageType.physical,
    new OptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0),
    {
      'Speedy Tank': new OptimizationPlan('Speedy Tank', 50, 50, 100, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Tank', 'Crew Member'],
    ['ShT', 'Troopers', 'Imperial Grancor Maneuver'],
    true
  ),
  Character.statlessCharacter(
    'Sith Assassin',
    'SITHASSASSIN',
    DamageType.physical,
    optimizationStrategy['Special Damage with Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Special Damage with Potency'].rename('PvP')
    },
    ['Dark Side', 'Sith', 'Attacker'],
    ['SA', 'Sassy'],
    true
  ),
  Character.statlessCharacter(
    'Sith Marauder',
    'SITHMARAUDER',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvP')
    },
    ['Dark Side', 'Sith', 'Attacker'],
    ['SM'],
    false
  ),
  Character.statlessCharacter(
    'Sith Trooper',
    'SITHTROOPER',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 25, 50, 0, 0, 15, 0, 0, 0, 25, 25, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 25, 50, 0, 0, 15, 0, 0, 0, 25, 25, 0, 0)
    },
    ['Dark Side', 'Sith', 'Tank'],
    ['SiT', 'Nightmare'],
    false
  ),
  Character.statlessCharacter(
    'Snowtrooper',
    'SNOWTROOPER',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 0, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 0, 100, 0, 0, 50, 0, 25, 0, 0, 0, 0),
      'Fast PvP': new OptimizationPlan('PvP', 0, 0, 100, 50, 0, 0, 50, 0, 100, 0, 0, 0, 0),
      'Fast PvE': new OptimizationPlan('PvE', 0, 0, 80, 50, 0, 0, 25, 0, 100, 0, 0, 0, 0)
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Attacker'],
    ['Troopers'],
    false
  ),
  Character.statlessCharacter(
    'Stormtrooper',
    'STORMTROOPER',
    DamageType.physical,
    new OptimizationPlan('Speedy Tank', 25, 25, 50, 0, 0, 25, 0, 0, 0, 25, 25, 0, 0),
    {
      'Speedy Tank': new OptimizationPlan('Speedy Tank', 25, 25, 50, 0, 0, 25, 0, 0, 0, 25, 25, 0, 0)
    },
    ['Dark Side', 'Empire', 'Imperial Trooper', 'Tank'],
    ['Troopers'],
    false
  ),
  Character.statlessCharacter(
    'Stormtrooper Han',
    'STORMTROOPERHAN',
    DamageType.physical,
    optimizationStrategy.Speed,
    {
      'Speed': optimizationStrategy.Speed,
      'PvE': new OptimizationPlan('PvE', 50, 50, 50, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Rebel', 'Tank'],
    ['STHan'],
    false
  ),
  Character.statlessCharacter(
    'Sun Fac',
    'SUNFAC',
    DamageType.physical,
    new OptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0),
    {
      'Tanky': new OptimizationPlan('Tanky', 40, 40, 100, 0, 25, 25, 0, 0, 0, 12.5, 12.5, 0, 0)
    },
    ['Dark Side', 'Separatist', 'Geonosian', 'Tank', 'Crew Member'],
    [],
    true
  ),
  Character.statlessCharacter(
    'T3-M4',
    'T3_M4',
    DamageType.special,
    new OptimizationPlan('PvP', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 10, 100, 0, 25, 10, 0, 10, 10, 0, 0, 0, 0)
    },
    ['Light Side', 'Old Republic', 'Droid', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Talia',
    'TALIA',
    DamageType.mixed,
    new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 0, 0, 0, 100, 0, 100, 0, 0, 0, 0, true),
    {
      'hSTR Phase 4': new OptimizationPlan('hSTR Phase 4', 0, 0, 0, 0, 0, 0, 100, 0, 100, 0, 0, 0, 0, true)
    },
    ['Dark Side', 'Nightsister', 'Healer'],
    ['NS', 'hSTR NS'],
    false
  ),
  Character.statlessCharacter(
    'Teebo',
    'TEEBO',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 25, 100, 0, 50, 25, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 25, 100, 0, 50, 25, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Light Side', 'Ewok', 'Tank'],
    ['Teebotine', 'Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'TIE Fighter Pilot',
    'TIEFIGHTERPILOT',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, Physical Damage, Potency'].rename('PvP')
    },
    ['Dark Side', 'Empire', 'Attacker', 'Crew Member'],
    ['TFP', 'Auto Lightzader'],
    true
  ),
  Character.statlessCharacter(
    'Tusken Raider',
    'TUSKENRAIDER',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Dark Side', 'Tusken', 'Attacker'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Tusken Shaman',
    'TUSKENSHAMAN',
    DamageType.physical,
    new OptimizationPlan('PvE', 0, 0, 100, 0, 50, 25, 0, 0, 0, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 0, 0, 100, 0, 50, 25, 0, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Tusken', 'Healer'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Ugnaught',
    'UGNAUGHT',
    DamageType.mixed,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'URoRRuR\'R\'R',
    'URORRURRR',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Dark Side', 'Tusken', 'Support'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Vandor Chewbacca',
    'YOUNGCHEWBACCA',
    DamageType.physical,
    new OptimizationPlan('PvE', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0),
    {
      'PvE': new OptimizationPlan('PvE', 50, 0, 100, 50, 0, 0, 25, 0, 50, 0, 0, 0, 0)
    },
    ['Light Side', 'Scoundrel', 'Tank'],
    ['Dwight', '#solo'],
    false
  ),
  Character.statlessCharacter(
    'Veteran Smuggler Chewbacca',
    'SMUGGLERCHEWBACCA',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['Vets'],
    false
  ),
  Character.statlessCharacter(
    'Veteran Smuggler Han Solo',
    'SMUGGLERHAN',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['Vets'],
    false
  ),
  Character.statlessCharacter(
    'Visas Marr',
    'VISASMARR',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 0, 100, 50, 0, 25, 50, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 0, 100, 50, 0, 25, 50, 0, 50, 0, 0, 0, 0),
      'hSTR Phase 1': new OptimizationPlan('hSTR Phase 1', 25, -5, 0, 100, 0, 0, 50, 0, 75, 0, 0, 0, 0)
    },
    ['Light Side', 'Healer'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Wampa',
    'WAMPA',
    DamageType.physical,
    new OptimizationPlan('PvP', 10, 0, 80, 100, 10, 0, 50, 0, 50, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 10, 0, 80, 100, 10, 0, 50, 0, 50, 0, 0, 0, 0),
      'Raids': new OptimizationPlan('Raids', 10, 0, 80, 100, 10, 0, 50, 0, 0, 0, 0, 0, 0)
    },
    ['Dark Side', 'Attacker'],
    ['beast', 'Wampanader'],
    false
  ),
  Character.statlessCharacter(
    'Wedge Antilles',
    'WEDGEANTILLES',
    DamageType.physical,
    optimizationStrategy['Speed, Crit, and Physical Damage'].rename('PvP'),
    {
      'PvP': optimizationStrategy['Speed, Crit, and Physical Damage'].rename('PvP')
    },
    ['Light Side', 'Rebel', 'Attacker', 'Crew Member'],
    ['Wiggs', 'chiggs', 'SuperStar2D2'],
    true
  ),
  Character.statlessCharacter(
    'Wicket',
    'WICKET',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP'),
    {
      'PvP': optimizationStrategy["Speed, Crit, and Physical Damage"].rename('PvP')
    },
    ['Light Side', 'Ewok', 'Attacker'],
    ['Murderbears'],
    false
  ),
  Character.statlessCharacter(
    'Young Han Solo',
    'YOUNGHAN',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['YOLO', '#solo', 'Jim'],
    true
  ),
  Character.statlessCharacter(
    'Young Lando Calrissian',
    'YOUNGLANDO',
    DamageType.physical,
    optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE'),
    {
      'PvE': optimizationStrategy["Speed, Crit, Physical Damage, Potency"].rename('PvE')
    },
    ['Light Side', 'Scoundrel', 'Attacker'],
    ['#solo'],
    true
  ),
  Character.statlessCharacter(
    'Zaalbar',
    'ZAALBAR',
    DamageType.physical,
    new OptimizationPlan('PvP', 25, 25, 100, 0, 25, 0, 10, 0, 20, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 25, 25, 100, 0, 25, 0, 10, 0, 20, 0, 0, 0, 0)
    },
    ['Light Side', 'Old Republic', 'Scoundrel', 'Tank'],
    [],
    false
  ),
  Character.statlessCharacter(
    'Zam Wesell',
    'ZAMWESELL',
    DamageType.physical,
    new OptimizationPlan('PvP', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0),
    {
      'PvP': new OptimizationPlan('PvP', 0, 0, 100, 40, 50, 0, 25, 0, 40, 0, 0, 0, 0)
    },
    ['Dark Side', 'Scoundrel', 'Bounty Hunter', 'Attacker'],
    [],
    false
  )
];

const characters = {};
const charDefaults = {};

for (let character of charactersArray) {
  characters[character.name] = character;
  charDefaults[character.baseID] = character.clone();
  // Object.freeze(characters[character.name]);
  Object.freeze(charDefaults[character.baseID]);
}

Object.freeze(characters);
Object.freeze(charDefaults);

export {characters, charDefaults};
