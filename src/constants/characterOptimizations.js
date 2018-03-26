import characters from "./characters";
import OptimizationPlan from "../domain/OptimizationPlan";

const characterOptimizations = {
  'Aayla Secura': {
    character: characters['Aayla Secura'],
    optimizationPlan: new OptimizationPlan()
  },
  'Admiral Ackbar': {
    character: characters['Admiral Ackbar'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .4, // protection
      100, // speed
      0, // crit damage
      0, // potency
      75, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Ahsoka Tano': {
    character: characters['Ahsoka Tano'],
    optimizationPlan: new OptimizationPlan()
  },
  'Ahsoka Tano (Fulcrum)': {
    character: characters['Ahsoka Tano (Fulcrum)'],
    optimizationPlan: new OptimizationPlan()
  },
  'Amilyn Holdo': {
    character: characters['Amilyn Holdo'],
    optimizationPlan: new OptimizationPlan()
  },
  'Asajj Ventress': {
    character: characters['Asajj Ventress'],
    optimizationPlan: new OptimizationPlan(
      .4, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      4, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'B2 Super Battle Droid': {
    character: characters['B2 Super Battle Droid'],
    optimizationPlan: new OptimizationPlan()
  },
  'Barriss Offee': {
    character: characters['Barriss Offee'],
    optimizationPlan: new OptimizationPlan()
  },
  'Baze Malbus': {
    character: characters['Baze Malbus'],
    optimizationPlan: new OptimizationPlan(
      1, // health
      1, // protection
      100, // speed
      0, // crit damage
      10, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'BB-8': {
    character: characters['BB-8'],
    optimizationPlan: new OptimizationPlan(
      .25, // health
      0, // protection
      100, // speed
      0, // crit damage
      0, // potency
      50, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Biggs Darklighter': {
    character: characters['Biggs Darklighter'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Bistan': {
    character: characters['Bistan'],
    optimizationPlan: new OptimizationPlan()
  },
  'Boba Fett': {
    character: characters['Boba Fett'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Bodhi Rook': {
    character: characters['Bodhi Rook'],
    optimizationPlan: new OptimizationPlan()
  },
  'Cad Bane': {
    character: characters['Cad Bane'],
    optimizationPlan: new OptimizationPlan()
  },
  'Captain Han Solo': {
    character: characters['Captain Han Solo'],
    optimizationPlan: new OptimizationPlan(
      .5, // health
      0, // protection
      100, // speed
      10, // crit damage
      50, // potency
      0, // tenacity
      .5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Captain Phasma': {
    character: characters['Captain Phasma'],
    optimizationPlan: new OptimizationPlan()
  },
  'Cassian Andor': {
    character: characters['Cassian Andor'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .4, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'CC-2224 "Cody"': {
    character: characters['CC-2224 "Cody"'],
    optimizationPlan: new OptimizationPlan()
  },
  'Chief Chirpa': {
    character: characters['Chief Chirpa'],
    optimizationPlan: new OptimizationPlan()
  },
  'Chief Nebit': {
    character: characters['Chief Nebit'],
    optimizationPlan: new OptimizationPlan()
  },
  'Chirrut Îmwe': {
    character: characters['Chirrut Îmwe'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Chopper': {
    character: characters['Chopper'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .33, // protection
      100, // speed
      0, // crit damage
      0, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Clone Sergeant - Phase I': {
    character: characters['Clone Sergeant - Phase I'],
    optimizationPlan: new OptimizationPlan()
  },
  'Clone Wars Chewbacca': {
    character: characters['Clone Wars Chewbacca'],
    optimizationPlan: new OptimizationPlan()
  },
  'Colonel Starck': {
    character: characters['Colonel Starck'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Commander Luke Skywalker': {
    character: characters['Commander Luke Skywalker'],
    optimizationPlan: new OptimizationPlan(
      .25, // health
      .25, // protection
      100, // speed
      30, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Coruscant Underworld Police': {
    character: characters['Coruscant Underworld Police'],
    optimizationPlan: new OptimizationPlan()
  },
  'Count Dooku': {
    character: characters['Count Dooku'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      33, // potency
      50, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'CT-21-0408 "Echo"': {
    character: characters['CT-21-0408 "Echo"'],
    optimizationPlan: new OptimizationPlan()
  },
  'CT-5555 "Fives"': {
    character: characters['CT-5555 "Fives"'],
    optimizationPlan: new OptimizationPlan()
  },
  'CT-7567 "Rex"': {
    character: characters['CT-7567 "Rex"'],
    optimizationPlan: new OptimizationPlan(
      0.25, // health
      0, // protection
      100, // speed
      0, // crit damage
      40, // potency
      75, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Darth Maul': {
    character: characters['Darth Maul'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      33, // potency
      10, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Darth Nihilus': {
    character: characters['Darth Nihilus'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .1, // protection
      100, // speed
      0, // crit damage
      25, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Darth Sidious': {
    character: characters['Darth Sidious'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      0, // crit damage
      75, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Darth Sion': {
    character: characters['Darth Sion'],
    optimizationPlan: new OptimizationPlan()
  },
  'Darth Traya': {
    character: characters['Darth Traya'],
    optimizationPlan: new OptimizationPlan()
  },
  'Darth Vader': {
    character: characters['Darth Vader'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      30, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      65, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Dathcha': {
    character: characters['Dathcha'],
    optimizationPlan: new OptimizationPlan()
  },
  'Death Trooper': {
    character: characters['Death Trooper'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      10, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Dengar': {
    character: characters['Dengar'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      10, // crit damage
      50, // potency
      0, // tenacity
      1, // offense
      75, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Director Krennic': {
    character: characters['Director Krennic'],
    optimizationPlan: new OptimizationPlan()
  },
  'Eeth Koth': {
    character: characters['Eeth Koth'],
    optimizationPlan: new OptimizationPlan()
  },
  'Emperor Palpatine': {
    character: characters['Emperor Palpatine'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Ewok Elder': {
    character: characters['Ewok Elder'],
    optimizationPlan: new OptimizationPlan(
      .5, // health
      0, // protection
      100, // speed
      0, // crit damage
      0, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Ewok Scout': {
    character: characters['Ewok Scout'],
    optimizationPlan: new OptimizationPlan()
  },
  'Ezra Bridger': {
    character: characters['Ezra Bridger'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      5, // tenacity
      1, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Finn': {
    character: characters['Finn'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      10, // speed
      33, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      33, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'First Order Executioner': {
    character: characters['First Order Executioner'],
    optimizationPlan: new OptimizationPlan()
  },
  'First Order Officer': {
    character: characters['First Order Officer'],
    optimizationPlan: new OptimizationPlan()
  },
  'First Order SF TIE Pilot': {
    character: characters['First Order SF TIE Pilot'],
    optimizationPlan: new OptimizationPlan()
  },
  'First Order Stormtrooper': {
    character: characters['First Order Stormtrooper'],
    optimizationPlan: new OptimizationPlan()
  },
  'First Order TIE Pilot': {
    character: characters['First Order TIE Pilot'],
    optimizationPlan: new OptimizationPlan()
  },
  'Gamorrean Guard': {
    character: characters['Gamorrean Guard'],
    optimizationPlan: new OptimizationPlan()
  },
  'Gar Saxon': {
    character: characters['Gar Saxon'],
    optimizationPlan: new OptimizationPlan()
  },
  'Garazeb "Zeb" Orrelios': {
    character: characters['Garazeb "Zeb" Orrelios'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .33, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'General Grievous': {
    character: characters['General Grievous'],
    optimizationPlan: new OptimizationPlan()
  },
  'General Kenobi': {
    character: characters['General Kenobi'],
    optimizationPlan: new OptimizationPlan(
      1, // health
      1, // protection
      10, // speed
      0, // crit damage
      0, // potency
      5, // tenacity
      0, // offense
      0, // crit chance
      1, // defense
      0 // accuracy
    )
  },
  'General Veers': {
    character: characters['General Veers'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      33, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Geonosian Soldier': {
    character: characters['Geonosian Soldier'],
    optimizationPlan: new OptimizationPlan()
  },
  'Geonosian Spy': {
    character: characters['Geonosian Spy'],
    optimizationPlan: new OptimizationPlan()
  },
  'Grand Admiral Thrawn': {
    character: characters['Grand Admiral Thrawn'],
    optimizationPlan: new OptimizationPlan(
      .25, // health
      .25, // protection
      100, // speed
      0, // crit damage
      0, // potency
      50, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Grand Master Yoda': {
    character: characters['Grand Master Yoda'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      33, // crit damage
      33, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Grand Moff Tarkin': {
    character: characters['Grand Moff Tarkin'],
    optimizationPlan: new OptimizationPlan()
  },
  'Greedo': {
    character: characters['Greedo'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Han Solo': {
    character: characters['Han Solo'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      5, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Hera Syndulla': {
    character: characters['Hera Syndulla'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      0, // crit damage
      10, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Hermit Yoda': {
    character: characters['Hermit Yoda'],
    optimizationPlan: new OptimizationPlan()
  },
  'HK-47': {
    character: characters['HK-47'],
    optimizationPlan: new OptimizationPlan()
  },
  'Hoth Rebel Scout': {
    character: characters['Hoth Rebel Scout'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      50, // crit damage
      50, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Hoth Rebel Soldier': {
    character: characters['Hoth Rebel Soldier'],
    optimizationPlan: new OptimizationPlan(
      .4, // health
      .4, // protection
      100, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'IG-100 MagnaGuard': {
    character: characters['IG-100 MagnaGuard'],
    optimizationPlan: new OptimizationPlan()
  },
  'IG-86 Sentinel Droid': {
    character: characters['IG-86 Sentinel Droid'],
    optimizationPlan: new OptimizationPlan()
  },
  'IG-88': {
    character: characters['IG-88'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Ima-Gun Di': {
    character: characters['Ima-Gun Di'],
    optimizationPlan: new OptimizationPlan()
  },
  'Imperial Probe Droid': {
    character: characters['Imperial Probe Droid'],
    optimizationPlan: new OptimizationPlan()
  },
  'Imperial Super Commando': {
    character: characters['Imperial Super Commando'],
    optimizationPlan: new OptimizationPlan()
  },
  'Jawa': {
    character: characters['Jawa'],
    optimizationPlan: new OptimizationPlan()
  },
  'Jawa Engineer': {
    character: characters['Jawa Engineer'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Jawa Scavenger': {
    character: characters['Jawa Scavenger'],
    optimizationPlan: new OptimizationPlan()
  },
  'Jedi Consular': {
    character: characters['Jedi Consular'],
    optimizationPlan: new OptimizationPlan()
  },
  'Jedi Knight Anakin': {
    character: characters['Jedi Knight Anakin'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Jedi Knight Guardian': {
    character: characters['Jedi Knight Guardian'],
    optimizationPlan: new OptimizationPlan()
  },
  'Jyn Erso': {
    character: characters['Jyn Erso'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      33, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      75, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'K-2SO': {
    character: characters['K-2SO'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      10, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Kanan Jarrus': {
    character: characters['Kanan Jarrus'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .4, // protection
      100, // speed
      10, // crit damage
      33, // potency
      0, // tenacity
      0, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Kit Fisto': {
    character: characters['Kit Fisto'],
    optimizationPlan: new OptimizationPlan()
  },
  'Kylo Ren': {
    character: characters['Kylo Ren'],
    optimizationPlan: new OptimizationPlan()
  },
  'Kylo Ren (Unmasked)': {
    character: characters['Kylo Ren (Unmasked)'],
    optimizationPlan: new OptimizationPlan()
  },
  'Lando Calrissian': {
    character: characters['Lando Calrissian'],
    optimizationPlan: new OptimizationPlan()
  },
  'Lobot': {
    character: characters['Lobot'],
    optimizationPlan: new OptimizationPlan()
  },
  'Logray': {
    character: characters['Logray'],
    optimizationPlan: new OptimizationPlan()
  },
  'Luke Skywalker (Farmboy)': {
    character: characters['Luke Skywalker (Farmboy)'],
    optimizationPlan: new OptimizationPlan()
  },
  'Luminara Unduli': {
    character: characters['Luminara Unduli'],
    optimizationPlan: new OptimizationPlan()
  },
  'Mace Windu': {
    character: characters['Mace Windu'],
    optimizationPlan: new OptimizationPlan()
  },
  'Magmatrooper': {
    character: characters['Magmatrooper'],
    optimizationPlan: new OptimizationPlan()
  },
  'Mob Enforcer': {
    character: characters['Mob Enforcer'],
    optimizationPlan: new OptimizationPlan()
  },
  'Mother Talzin': {
    character: characters['Mother Talzin'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      0, // crit damage
      100, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Nightsister Acolyte': {
    character: characters['Nightsister Acolyte'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      0, // protection
      10, // speed
      33, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      75, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Nightsister Initiate': {
    character: characters['Nightsister Initiate'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Nightsister Spirit': {
    character: characters['Nightsister Spirit'],
    optimizationPlan: new OptimizationPlan()
  },
  'Nightsister Zombie': {
    character: characters['Nightsister Zombie'],
    optimizationPlan: new OptimizationPlan()
  },
  'Nute Gunray': {
    character: characters['Nute Gunray'],
    optimizationPlan: new OptimizationPlan()
  },
  'Obi-Wan Kenobi (Old Ben)': {
    character: characters['Obi-Wan Kenobi (Old Ben)'],
    optimizationPlan: new OptimizationPlan()
  },
  'Old Daka': { // <-- Lots of health
    character: characters['Old Daka'],
    optimizationPlan: new OptimizationPlan(
      .5, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Pao': {
    character: characters['Pao'],
    optimizationPlan: new OptimizationPlan()
  },
  'Paploo': {
    character: characters['Paploo'],
    optimizationPlan: new OptimizationPlan()
  },
  'Plo Koon': {
    character: characters['Plo Koon'],
    optimizationPlan: new OptimizationPlan()
  },
  'Poe Dameron': {
    character: characters['Poe Dameron'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Poggle the Lesser': {
    character: characters['Poggle the Lesser'],
    optimizationPlan: new OptimizationPlan()
  },
  'Princess Leia': {
    character: characters['Princess Leia'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Qui-Gon Jinn': {
    character: characters['Qui-Gon Jinn'],
    optimizationPlan: new OptimizationPlan()
  },
  'R2-D2': {
    character: characters['R2-D2'],
    optimizationPlan: new OptimizationPlan(
      .25, // health
      0, // protection
      100, // speed
      10, // crit damage
      10, // potency
      8, // tenacity
      1, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Rebel Officer Leia Organa': {
    character: characters['Rebel Officer Leia Organa'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      33, // crit damage
      50, // potency
      0, // tenacity
      5, // offense
      20, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Resistance Pilot': {
    character: characters['Resistance Pilot'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      50, // crit damage
      20, // potency
      0, // tenacity
      2, // offense
      75, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Resistance Trooper': {
    character: characters['Resistance Trooper'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      10, // speed
      50, // crit damage
      30, // potency
      0, // tenacity
      1, // offense
      50, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Rey (Jedi Training)': {
    character: characters['Rey (Jedi Training)'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      100, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      100, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Rey (Scavenger)': {
    character: characters['Rey (Scavenger)'],
    optimizationPlan: new OptimizationPlan(
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
      true
    )
  },
  'Rose Tico': {
    character: characters['Rose Tico'],
    optimizationPlan: new OptimizationPlan()
  },
  'Royal Guard': {
    character: characters['Royal Guard'],
    optimizationPlan: new OptimizationPlan()
  },
  'Sabine Wren': {
    character: characters['Sabine Wren'],
    optimizationPlan: new OptimizationPlan()
  },
  'Savage Opress': {
    character: characters['Savage Opress'],
    optimizationPlan: new OptimizationPlan()
  },
  'Scarif Rebel Pathfinder': {
    character: characters['Scarif Rebel Pathfinder'],
    optimizationPlan: new OptimizationPlan()
  },
  'Shoretrooper': {
    character: characters['Shoretrooper'],
    optimizationPlan: new OptimizationPlan(
      .4, // health
      .2, // protection
      100, // speed
      0, // crit damage
      10, // potency
      20, // tenacity
      0, // offense
      0, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Sith Assassin': {
    character: characters['Sith Assassin'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      0, // crit damage
      33, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Sith Marauder': {
    character: characters['Sith Marauder'],
    optimizationPlan: new OptimizationPlan()
  },
  'Sith Trooper': {
    character: characters['Sith Trooper'],
    optimizationPlan: new OptimizationPlan(
      .4, // health
      .2, // protection
      100, // speed
      0, // crit damage
      0, // potency
      4, // tenacity
      0, // offense
      0, // crit chance
      20, // defense
      0 // accuracy
    )
  },
  'Snowtrooper': {
    character: characters['Snowtrooper'],
    optimizationPlan: new OptimizationPlan(
      .05, // health
      .05, // protection
      100, // speed
      20, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      75, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Stormtrooper': {
    character: characters['Stormtrooper'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      0, // potency
      4, // tenacity
      0, // offense
      0, // crit chance
      10, // defense
      0 // accuracy
    )
  },
  'Stormtrooper Han': {
    character: characters['Stormtrooper Han'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      20, // potency
      4, // tenacity
      0, // offense
      0, // crit chance
      3, // defense
      0 // accuracy
    )
  },
  'Sun Fac': {
    character: characters['Sun Fac'],
    optimizationPlan: new OptimizationPlan()
  },
  'Talia': { // <-- Offense + Health
    character: characters['Talia'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      0, // protection
      10, // speed
      0, // crit damage
      0, // potency
      0, // tenacity
      4, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Teebo': {
    character: characters['Teebo'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      5, // tenacity
      0, // offense
      0, // crit chance
      5, // defense
      0 // accuracy
    )
  },
  'TIE Fighter Pilot': {
    character: characters['TIE Fighter Pilot'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      50, // crit damage
      40, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Tusken Raider': {
    character: characters['Tusken Raider'],
    optimizationPlan: new OptimizationPlan()
  },
  'Tusken Shaman': {
    character: characters['Tusken Shaman'],
    optimizationPlan: new OptimizationPlan()
  },
  'Ugnaught': {
    character: characters['Ugnaught'],
    optimizationPlan: new OptimizationPlan()
  },
  'URoRRuR\'R\'R': {
    character: characters['R'],
    optimizationPlan: new OptimizationPlan()
  },
  'Veteran Smuggler Chewbacca': {
    character: characters['Veteran Smuggler Chewbacca'],
    optimizationPlan: new OptimizationPlan()
  },
  'Veteran Smuggler Han Solo': {
    character: characters['Veteran Smuggler Han Solo'],
    optimizationPlan: new OptimizationPlan()
  },
  'Visas Marr': {
    character: characters['Visas Marr'],
    optimizationPlan: new OptimizationPlan()
  },
  'Wampa': {
    character: characters['Wampa'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      0, // protection
      100, // speed
      40, // crit damage
      25, // potency
      0, // tenacity
      5, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
  'Wedge Antilles': {
    character: characters['Wedge Antilles'],
    optimizationPlan: new OptimizationPlan(
      .2, // health
      0, // protection
      100, // speed
      50, // crit damage
      0, // potency
      0, // tenacity
      2, // offense
      50, // crit chance
      0, // defense
      0, // accuracy
      true
    )
  },
  'Wicket': {
    character: characters['Wicket'],
    optimizationPlan: new OptimizationPlan()
  },
  'Zam Wesell': {
    character: characters['Zam Wesell'],
    optimizationPlan: new OptimizationPlan(
      0, // health
      .2, // protection
      100, // speed
      0, // crit damage
      50, // potency
      0, // tenacity
      1, // offense
      0, // crit chance
      0, // defense
      0 // accuracy
    )
  },
};

Object.freeze(characterOptimizations);

export default characterOptimizations;
