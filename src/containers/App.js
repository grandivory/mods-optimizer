import React, {Component} from 'react';
import ModDetail from '../components/ModDetail/ModDetail';
import StatClassifier from '../utils/StatClassifier';
import Stat from '../domain/Stat';
import './boilerplate.css';
import './App.css';
import Mod from "../domain/Mod";
import characters from "../constants/characters";
import modSets from "../constants/sets"
import OptimizationPlan from "../domain/OptimizationPlan";
import Optimizer from "../utils/Optimizer";
import BaseStats from "../domain/BaseStats";
import Character from "../domain/Character";
import characterOptimizations from "../constants/characterOptimizations";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const fileContents = {
      mods: [{
        "mod_uid": "Jyye0fVHSVWBQYntUkvc0A",
        "slot": "square",
        "set": "health",
        "level": 15,
        "pips": 5,
        "primaryBonusType": "Offense",
        "primaryBonusValue": "+5.88%",
        "secondaryType_1": "Protection %",
        "secondaryValue_1": "+3.79",
        "secondaryType_2": "Protection",
        "secondaryValue_2": "+1350",
        "secondaryType_3": "Potency",
        "secondaryValue_3": "+2.47%",
        "secondaryType_4": "Speed",
        "secondaryValue_4": "+4",
        "characterName": "Royal Guard"
      },
        {
          "mod_uid": "EVsQqe1DQFeBiO5xFm9JdA",
          "slot": "arrow",
          "set": "health",
          "level": 15,
          "pips": 5,
          "primaryBonusType": "Protection",
          "primaryBonusValue": "+23.5%",
          "secondaryType_1": "Protection",
          "secondaryValue_1": "+1322",
          "secondaryType_2": "Health %",
          "secondaryValue_2": "+0.64",
          "secondaryType_3": "Defense %",
          "secondaryValue_3": "+1.03",
          "secondaryType_4": "Potency",
          "secondaryValue_4": "+2.01%",
          "characterName": "Royal Guard"
        },
        {
          "mod_uid": "zjPxI5OJR9-6NF1TY6D2FA",
          "slot": "diamond",
          "set": "health",
          "level": 15,
          "pips": 5,
          "primaryBonusType": "Defense",
          "primaryBonusValue": "+11.75%",
          "secondaryType_1": "Protection",
          "secondaryValue_1": "+1899",
          "secondaryType_2": "Potency",
          "secondaryValue_2": "+1.6%",
          "secondaryType_3": "Health %",
          "secondaryValue_3": "+0.9",
          "secondaryType_4": "Offense",
          "secondaryValue_4": "+34",
          "characterName": "Royal Guard"
        },
        {
          "mod_uid": "2s4kcfvjSF6LXqB6aVD4Ew",
          "slot": "triangle",
          "set": "health",
          "level": 15,
          "pips": 5,
          "primaryBonusType": "Offense",
          "primaryBonusValue": "+5.88%",
          "secondaryType_1": "Potency",
          "secondaryValue_1": "+2.95%",
          "secondaryType_2": "Defense",
          "secondaryValue_2": "+7",
          "secondaryType_3": "Offense",
          "secondaryValue_3": "+39",
          "secondaryType_4": "Tenacity",
          "secondaryValue_4": "+1.76%",
          "characterName": "Colonel Starck"
        },
        {
          "mod_uid": "DDclhlmkT9GPhVU8gpW6AQ",
          "slot": "circle",
          "set": "health",
          "level": 15,
          "pips": 5,
          "primaryBonusType": "Protection",
          "primaryBonusValue": "+23.5%",
          "secondaryType_1": "Potency",
          "secondaryValue_1": "+1.52%",
          "secondaryType_2": "Speed",
          "secondaryValue_2": "+12",
          "secondaryType_3": "Defense",
          "secondaryValue_3": "+8",
          "secondaryType_4": "Critical Chance",
          "secondaryValue_4": "+1.61%",
          "characterName": "Colonel Starck"
        },
        {
          "mod_uid": "xzqqNh9bRk6BDo9XLY8LOQ",
          "slot": "cross",
          "set": "health",
          "level": 15,
          "pips": 5,
          "primaryBonusType": "Protection",
          "primaryBonusValue": "+23.5%",
          "secondaryType_1": "Protection",
          "secondaryValue_1": "+657",
          "secondaryType_2": "Potency",
          "secondaryValue_2": "+1.5%",
          "secondaryType_3": "Offense",
          "secondaryValue_3": "+44",
          "secondaryType_4": "Defense %",
          "secondaryValue_4": "+1.24",
          "characterName": "Royal Guard"
        }]
    };

    this.state.mods = App.readMods(fileContents.mods);
    let assignedMods = new Optimizer(this.state.mods).optimizeMods(
      [
        characterOptimizations['CT-7567 "Rex"'],
        characterOptimizations['Wampa'],
        characterOptimizations['Mother Talzin'],
        characterOptimizations['Darth Nihilus'],
        characterOptimizations['General Kenobi'],
        characterOptimizations['Darth Vader'],
        characterOptimizations['BB-8'],
        characterOptimizations['Grand Admiral Thrawn'],
        characterOptimizations['Commander Luke Skywalker'],
        characterOptimizations['Rey (Jedi Training)'],
        characterOptimizations['Resistance Trooper'],
        characterOptimizations['Rey (Scavenger)'],
        characterOptimizations['R2-D2'],
        characterOptimizations['Han Solo'],
        characterOptimizations['Chirrut Îmwe'],
        characterOptimizations['Jedi Knight Anakin'],
        characterOptimizations['General Veers'],
        characterOptimizations['Shoretrooper'],
        characterOptimizations['Death Trooper'],
        characterOptimizations['Snowtrooper'],
        characterOptimizations['Colonel Starck'],
        characterOptimizations['Boba Fett'],
        characterOptimizations['Zam Wesell'],
        characterOptimizations['Greedo'],
        characterOptimizations['Jawa Engineer'],
        characterOptimizations['Ewok Elder'],
        characterOptimizations['Admiral Ackbar'],
        characterOptimizations['Stormtrooper Han'],
        characterOptimizations['Princess Leia'],
        characterOptimizations['Ezra Bridger'],
        characterOptimizations['Hoth Rebel Scout'],
        characterOptimizations['Hoth Rebel Soldier'],
        characterOptimizations['Jyn Erso'],
        characterOptimizations['Baze Malbus'],
        characterOptimizations['Cassian Andor'],
        characterOptimizations['K-2SO'],
        characterOptimizations['Poe Dameron'],
        characterOptimizations['Finn'],
        characterOptimizations['Resistance Pilot'],
        characterOptimizations['Darth Sidious'],
        characterOptimizations['Chopper'],
        characterOptimizations['Hera Syndulla'],
        characterOptimizations['Garazeb "Zeb" Orrelios'],
        characterOptimizations['Kanan Jarrus'],
        characterOptimizations['Rebel Officer Leia Organa'],
        characterOptimizations['Captain Han Solo'],
        characterOptimizations['Grand Master Yoda'],
        characterOptimizations['Biggs Darklighter'],
        characterOptimizations['Wedge Antilles'],
        characterOptimizations['Emperor Palpatine'],
        characterOptimizations['TIE Fighter Pilot'],
        characterOptimizations['Stormtrooper'],
        characterOptimizations['IG-88'],
        characterOptimizations['Dengar'],
        characterOptimizations['Sith Assassin'],
        characterOptimizations['Count Dooku'],
        characterOptimizations['Sith Trooper'],
        characterOptimizations['Asajj Ventress'],
        characterOptimizations['Old Daka'],
        characterOptimizations['Nightsister Acolyte'],
        characterOptimizations['Talia'],
        characterOptimizations['Nightsister Initiate'],
        characterOptimizations['Darth Maul']
      ]
    );

    console.log(assignedMods);
    console.log(assignedMods.reduce(
      (allMods, characterMods) => allMods.concat(characterMods.modSet.mods()),
      []
    ).filter(
      mod => mod.assignTo !== mod.currentCharacter)
    );
  }

  /**
   * Given the input from a file exported from the Mods Manager Importer, read mods into memory in the format
   * used by this application
   *
   * @param fileInput array The parsed contents of the file generated by the Mods Manager Importer
   */
  static readMods(fileInput) {
    let mods = [];

    for (let fileMod of fileInput) {
      const primaryStat = new Stat(fileMod.primaryBonusType, fileMod.primaryBonusValue);
      let secondaryStats = [];

      if ('' !== fileMod.secondaryValue_1) {
        secondaryStats.push(new Stat(fileMod.secondaryType_1, fileMod.secondaryValue_1));
      }
      if ('' !== fileMod.secondaryValue_2) {
        secondaryStats.push(new Stat(fileMod.secondaryType_2, fileMod.secondaryValue_2));
      }
      if ('' !== fileMod.secondaryValue_3) {
        secondaryStats.push(new Stat(fileMod.secondaryType_3, fileMod.secondaryValue_3));
      }
      if ('' !== fileMod.secondaryValue_4) {
        secondaryStats.push(new Stat(fileMod.secondaryType_4, fileMod.secondaryValue_4));
      }

      mods.push(new Mod(
        fileMod.mod_uid,
        fileMod.slot,
        setBonuses[fileMod.set],
        fileMod.level,
        fileMod.pips,
        primaryStat,
        secondaryStats,
        characters[fileMod.characterName.replace(/&amp;#39;/g, "'")] ||
          new Character(fileMod.characterName, new BaseStats())
      ));
    }

    const statClassifier = new StatClassifier(App.calculateStatCategoryRanges(mods));
    for (let mod of mods) {
      mod.classifyStats(statClassifier);
    }

    return mods;
  }

  /**
   * For each type of secondary stat on a mod, calculate the minimum and maximum values found
   *
   * @param mods array
   * @returns object An object with a property for each secondary stat type, with values of "min" and "max"
   */
  static calculateStatCategoryRanges(mods) {
    let allStats = [];
    let statGroups = {};
    let statRanges = {};

    // Collect all stat values on all mods
    for (let mod of mods) {
      allStats = allStats.concat(mod.secondaryStats);
    }

    // Group the stat values by the stat type
    for (let stat of allStats) {
      if ('undefined' !== typeof statGroups[stat.type]) {
        statGroups[stat.type].push(stat.value);
      } else {
        statGroups[stat.type] = [stat.value];
      }
    }

    // Find the minimum and maximum of each stat type
    for (let type in statGroups) {
      statRanges[type] = statGroups[type].reduce(
        (minMax, statValue) => {
          if (statValue < minMax.min) {
            minMax.min = statValue;
          }
          if (statValue > minMax.max) {
            minMax.max = statValue;
          }
          return minMax;
        },
        {'min': Infinity, 'max': 0}
      );
    }

    return statRanges;
  }

  render() {
    const modElements = this.state.mods.map(
      (mod) => <ModDetail key={mod.id} mod={mod}/>
    );

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Matt's Mod Manager for SWGOH</h1>
        </header>
        <div className='app-body'>
          <div className='mods'>
            {modElements}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
