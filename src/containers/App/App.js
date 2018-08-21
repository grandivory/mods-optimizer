import React, {Component} from 'react';
import StatClassifier from '../../utils/StatClassifier';
import '../boilerplate.css';
import './App.css';
import Mod from "../../domain/Mod";
import OptimizerView from "../OptimizerView/OptimizerView";
import ExploreView from "../ExploreView/ExploreView";
import FileInput from "../../components/FileInput/FileInput";
import Modal from "../../components/Modal/Modal";
import WarningLabel from "../../components/WarningLabel/WarningLabel";
import Spinner from "../../components/Spinner/Spinner";
import Character from "../../domain/Character";
import BaseStats, {NullCharacterStats} from "../../domain/CharacterStats";
import FileDropZone from "../../components/FileDropZone/FileDropZone";
import {characters} from "../../constants/characters";
import {modSets, modSlots, modStats} from "../../constants/enums";

class App extends Component {
  constructor(props) {
    super(props);
    this.version = '1.2.5';

    this.state = {
      'view': 'optimize',
      'mods': []
    };

    const restoredState = this.restoreState();

    const queryParams = new URLSearchParams(document.location.search);

    if (queryParams.has('allyCode')) {
      let allyCode = queryParams.get('allyCode');

      // Take only numbers
      allyCode = allyCode.replace(/[^\d]/g, '');

      // Take only the first 9 digits
      allyCode = allyCode.substr(0, 9);

      // Split the numbers into chunks of 3
      const allyCodeChunks = allyCode.match(/\d{1,3}/g) || [];

      restoredState.allyCode = allyCodeChunks.join('-');

      // This needs to be set in a timeout so that we don't try to call `setState` in the constructor
      window.setTimeout(() => this.queryPlayerProfile(allyCode), 0);
    }

    // Remove the query string after reading anything we needed from it.
    window.history.replaceState({}, document.title, document.location.href.split('?')[0]);

    this.state = Object.assign(this.state, restoredState);
  }

  /**
   * Saves the application state to localStorage
   */
  saveState() {
    const saveProgressButton = document.getElementById('saveProgress');

    window.localStorage.removeItem('availableCharacters');
    window.localStorage.removeItem('selectedCharacters');
    window.localStorage.removeItem('lockedCharacters');

    window.localStorage.setItem('optimizer.allyCode', this.state.allyCode);
    window.localStorage.setItem('optimizer.mods', JSON.stringify(this.state.mods.map(mod => mod.serialize())));
    window.localStorage.setItem(
      'optimizer.availableCharacters',
      JSON.stringify(this.state.availableCharacters.map(character => character.serialize()))
    );
    window.localStorage.setItem(
      'optimizer.selectedCharacters',
      JSON.stringify(this.state.selectedCharacters.map(character => character.serialize()))
    );
    window.localStorage.setItem(
      'optimizer.version',
      this.version
    );

    if (saveProgressButton) {
      saveProgressButton.href = this.getProgressData();
      saveProgressButton.download = `modsOptimizer-${(new Date()).toISOString().slice(0, 10)}.json`
    }
  }

  restoreState() {
    let state = {};

    const version = window.localStorage.getItem('optimizer.version');

    state.allyCode = window.localStorage.getItem('optimizer.allyCode') || '';

    const savedMods = window.localStorage.getItem('optimizer.mods');
    if (savedMods) {
      state.mods = this.processMods(JSON.parse(savedMods), false);
    }

    state = Object.assign(state, this.restoreCharacterList(version));

    if ((version < '1.2.0' || !version) && state.mods) {
      state.showChangeLog = true;
    }

    return state;
  }

  /**
   * Restore the available and saved characters from localStorage
   * @param version The version of the app used to save the data to localStorage
   *
   * @returns {{availableCharacters: Array[Character], selectedCharacters: Array[Character]}}
   */
  restoreCharacterList(version) {
    const characterDefaults = Object.values(characters);
    let availableCharactersLocation, selectedCharactersLocation, lockedCharactersLocation;

    if (!version || version < '1.1.0') {
      availableCharactersLocation = 'availableCharacters';
      selectedCharactersLocation = 'selectedCharacters';
      lockedCharactersLocation = 'lockedCharacters';
    } else {
      availableCharactersLocation = 'optimizer.availableCharacters';
      selectedCharactersLocation = 'optimizer.selectedCharacters';
      lockedCharactersLocation = '';
    }

    const savedAvailableCharacters = (JSON.parse(window.localStorage.getItem(availableCharactersLocation)) || []).map(
      characterJson => Character.deserialize(characterJson, version)
    );
    const savedSelectedCharacters = (JSON.parse(window.localStorage.getItem(selectedCharactersLocation)) || []).map(
      characterJson => Character.deserialize(characterJson, version)
    );
    const savedLockedCharacters = (JSON.parse(window.localStorage.getItem(lockedCharactersLocation)) || []).map(
      characterJson => Character.deserialize(characterJson, version)
    );

    const savedCharacters = savedAvailableCharacters.concat(savedSelectedCharacters, savedLockedCharacters);

    const newCharacters = characterDefaults.filter(character =>
      !savedCharacters.some(c => c.name === character.name)
    );

    let availableCharacters = [];
    let selectedCharacters = [];

    savedAvailableCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name) ||
        Character.defaultCharacter(character.name);
      defaultCharacter.apply(character);
      availableCharacters.push(defaultCharacter);
    });
    savedSelectedCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name) ||
        Character.defaultCharacter(character.name);
      defaultCharacter.apply(character);
      selectedCharacters.push(defaultCharacter);
    });
    savedLockedCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name) ||
        Character.defaultCharacter(character.name);
      defaultCharacter.apply(character);
      availableCharacters.push(defaultCharacter);
    });

    return {
      'availableCharacters': availableCharacters.concat(newCharacters),
      'selectedCharacters': selectedCharacters,
    };
  }

  /**
   * Query the player profile from swgoh.help and parse the mods from it
   *
   * @param allyCode The player's ally code
   */
  queryPlayerProfile(allyCode) {
    const xhr = new XMLHttpRequest();
    const me = this;

    xhr.open('POST', `https://api.mods-optimizer.swgoh.grandivory.com/playerprofile/`, true);
    xhr.onload = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const playerProfile = JSON.parse(xhr.responseText);
            const roster = playerProfile.roster.filter(entry => entry.type === 'CHARACTER');
            const mods = roster
              .map(character => character.mods.map(mod => {
                mod.characterName = character.name;
                mod.mod_uid = mod.id;
                mod.set = modSets[mod.set];
                mod.slot = modSlots[mod.slot];
                mod.primaryBonusType = modStats[mod.primaryBonusType];
                for (let i = 1; i <= 4; i++) {
                  mod[`secondaryType_${i}`] = modStats[mod[`secondaryType_${i}`]];
                }
                return mod;
              }))
              .reduce((allMods, charMods) => allMods.concat(charMods), []);

            roster.forEach(character => {
              const baseCharacter = Object.values(characters).find(c => c.name === character.name);

              if (baseCharacter) {
                baseCharacter.level = character.level;
                baseCharacter.gearLevel = character.gear;
                baseCharacter.starLevel = character.rarity;
                baseCharacter.gearPieces = character.equipped;
                baseCharacter.galacticPower = character.gp;
              }
            });

            me.setState({
              'mods': me.processMods(mods, document.getElementById('keep-old-mods').checked),
              'loading': false,
              'allyCode': allyCode
            });
            me.saveState();

            // After we update characters, always update their stats, too
            me.queryCharacterStats();
          } catch (e) {
            me.setState({
              'error': e.message,
              'loading': false
            });
          }
        } else {
          me.setState({
            'error': xhr.responseText,
            'loading': false
          });
        }
      }
    };

    xhr.onerror = function() {
      me.setState({
        'error': xhr.responseText || 'Unknown error fetching your player profile.',
        'loading': false
      });
    };

    xhr.setRequestHeader('Accept', 'application/json');

    xhr.send(JSON.stringify({
      'ally-code': allyCode.replace(/[^\d]/g, '')
    }));

    this.setState({
      loading: true
    });
  }

  /**
   * Query for the base stats of every character known to the tool so that they can be optimized accurately
   */
  queryCharacterStats() {
    const xhr = new XMLHttpRequest();
    const me = this;

    xhr.open('POST', 'https://crinolo-swgoh.glitch.me/baseStats/api/', true);
    xhr.onload = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          try {
            const characterStats = JSON.parse(xhr.responseText);
            characterStats.forEach(characterObject => {
              const baseCharacter = Object.values(characters).find(c => c.baseID === characterObject.unit.characterID);

              if (baseCharacter) {
                const baseStats = characterObject.base ?
                  new BaseStats(
                    characterObject.base['Health'] || 0,
                    characterObject.base['Protection'] || 0,
                    characterObject.base['Speed'] || 0,
                    characterObject.base['Potency'] || 0,
                    characterObject.base['Tenacity'] || 0,
                    characterObject.base['Physical Damage'] || 0,
                    characterObject.base['Physical Critical Rating'] || 0,
                    characterObject.base['Armor'] || 0,
                    characterObject.base['Special Damage'] || 0,
                    characterObject.base['Special Critical Rating'] || 0,
                    characterObject.base['Resistance'] || 0,
                    baseCharacter.physDmgPct
                  ) :
                  NullCharacterStats;

                const totalStats = characterObject.total ?
                  new BaseStats(
                    characterObject.total['Health'] || 0,
                    characterObject.total['Protection'] || 0,
                    characterObject.total['Speed'] || 0,
                    characterObject.total['Potency'] || 0,
                    characterObject.total['Tenacity'] || 0,
                    characterObject.total['Physical Damage'] || 0,
                    characterObject.total['Physical Critical Rating'] || 0,
                    characterObject.total['Armor'] || 0,
                    characterObject.total['Special Damage'] || 0,
                    characterObject.total['Special Critical Rating'] || 0,
                    characterObject.total['Resistance'] || 0,
                    baseCharacter.physDmgPct
                  ) :
                  NullCharacterStats;

                baseCharacter.baseStats = baseStats;
                baseCharacter.totalStats = totalStats;
              }
            });

            const errorCharacters = Object.values(characters).filter(
              character => character.baseStats === NullCharacterStats || character.totalStats === NullCharacterStats
            ).map(character => character.name);
            const errorMessage = errorCharacters.length > 0 ?
              'Missing stats for characters: ' + errorCharacters.join(', ') +
              '. These characters may not optimize properly.'
              : null;

            me.setState({
              loading: false,
              error: errorMessage
            });
            me.saveState();
          } catch (e) {
            me.setState({
              'error': e.message,
              'loading': false
            });
          }
        } else {
          me.setState({
            'error': xhr.responseText,
            'loading': false
          });
        }
      }
    };

    xhr.onerror = function() {
      me.setState({
        'error': xhr.responseText || 'Unknown error fetching character stats',
        'loading': false
      });
    };

    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(
      Object.values(characters).map(character => {
        return {
          'characterID': character.baseID,
          'level': character.level,
          'starLevel': character.starLevel,
          'gearLevel': character.gearLevel,
          'gear': character.gearPieces.map(gear => gear.equipmentId)
        };
      })
    ));

    this.setState({
      loading: true
    });
  }

  /**
   * File handler to process an input file containing mod data.
   *
   * @param fileInput The uploaded mods file
   */
  readModsFile(fileInput) {
    let reader = new FileReader();
    const me = this;

    reader.onload = (event) => {
      try {
        const fileMods = JSON.parse(event.target.result);
        if (fileMods.length > 0) {
          const mods = me.processMods(
            JSON.parse(event.target.result),
            document.getElementById('keep-old-mods').checked
          );

          me.setState({
            'mods': mods
          });
          me.saveState();
        } else {
          me.setState({
            'error': 'No mods were found in your mods file! Please try to generate a new file.'
          });
        }
      } catch (e) {
        me.setState({
          'error': 'Unable to read mods from the provided file. Please make sure that you uploaded the correct file.'
        });
      }

    };

    reader.readAsText(fileInput);
  }

  /**
   * Restore the app state from a file and refresh the app
   */
  restoreFromFile(fileInput) {
    let reader = new FileReader();
    const me = this;

    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target.result).state;
        const version = state.version || '1.0';

        window.localStorage.setItem('optimizer.version', version);
        window.localStorage.setItem('optimizer.mods', state.mods);
        window.localStorage.setItem('optimizer.allyCode', state.allyCode || '');

        if (version < '1.1.0') {
          window.localStorage.setItem('availableCharacters', state.availableCharacters);
          window.localStorage.setItem('lockedCharacters', state.lockedCharacters);
          window.localStorage.setItem('selectedCharacters', state.selectedCharacters);
        } else {
          window.localStorage.setItem('optimizer.availableCharacters', state.availableCharacters);
          window.localStorage.setItem('optimizer.lockedCharacters', state.lockedCharacters);
          window.localStorage.setItem('optimizer.selectedCharacters', state.selectedCharacters);
        }

        window.location.reload();
      } catch (e) {
        me.setState({
          'error': 'Unable to read the progress file. Please make sure that you uploaded the correct file.'
        });
      }
    };

    reader.readAsText(fileInput);
  }

  /**
   * Given a JSON representation of mods, read mods into memory in the format used by this application
   *
   * @param modsJson array A serialized representation of a player's mods
   * @param keepOldMods boolean If true, will keep any mods already in state, even if they aren't found again
   *
   * @return Array[Mod]
   */
  processMods(modsJson, keepOldMods) {
    let mods = [];
    let newMods = {};

    for (let fileMod of modsJson) {
      const mod = Mod.deserialize(fileMod, characters);
      newMods[mod.id] = mod;
    }

    if (keepOldMods) {
      let oldMods = {};
      this.state.mods.forEach(mod => {
        oldMods[mod.id] = mod;

        // Unassign all old mods before adding in new ones. Any mods that are still assigned will be in the modsJson
        oldMods[mod.id].currentCharacter = null;
      });

      mods = Object.values(Object.assign(oldMods, newMods));
    } else {
      mods = Object.values(newMods);
    }

    const statClassifier = new StatClassifier(this.calculateStatCategoryRanges(mods));
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
  calculateStatCategoryRanges(mods) {
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
    const instructionsScreen = 0 === this.state.mods.length;

    return (
      <div className={'App'}>
        {this.header(!instructionsScreen)}
        <div className={'app-body'}>
          {instructionsScreen && this.welcome()}
          {!instructionsScreen && 'explore' === this.state.view &&
          <ExploreView mods={this.state.mods} saveState={this.saveState.bind(this)}/>
          }
          {!instructionsScreen && 'optimize' === this.state.view &&
          <OptimizerView
            mods={this.state.mods}
            availableCharacters={this.state.availableCharacters}
            selectedCharacters={this.state.selectedCharacters}
            saveState={this.saveState.bind(this)}
          />
          }
          <Modal show={this.state.error} className={'error-modal'} content={this.errorModal(this.state.error)}/>
          <Modal show={this.state.reset} className={'reset-modal'} content={this.resetModal()}/>
          <Modal show={this.state.showChangeLog} className={'changelog-modal'} content={this.changeLogModal()}/>
          <Spinner show={this.state.loading}/>
        </div>
        {this.footer()}
      </div>
    );
  }

  /**
   * Update the view to show a particular page.
   *
   * @param pageName string The page to show
   */
  showPage(pageName) {
    this.setState({'view': pageName});
  }

  /**
   * Renders the header for the application, optionally showing navigation buttons and a reset button
   * @param showActions bool If true, render the "Explore" and "Optimize" buttons and the "Reset Mods Optimizer" button
   * @returns JSX Element
   */
  header(showActions) {
    return <header className={'App-header'}>
      <h1 className={'App-title'}>Grandivory's Mod Optimizer for Star Wars: Galaxy of Heroes™</h1>
      {showActions &&
      <nav>
        <button className={'explore' === this.state.view ? 'active' : ''}
                onClick={this.showPage.bind(this, 'explore')}>Explore my mods
        </button>
        <button className={'optimize' === this.state.view ? 'active' : ''}
                onClick={this.showPage.bind(this, 'optimize')}>Optimize my mods
        </button>
      </nav>
      }
      <div className={'actions'}>
        <label htmlFor={'ally-code'}>Ally code:</label>
        <input id={'ally-code'} type={'text'} inputMode={'numeric'}
               defaultValue={this.state.allyCode || ''}
               onKeyUp={(e) => {
                 if (e.key === 'Enter') {
                   this.queryPlayerProfile(e.target.value);
                 }
                 // Don't change the input if the user is trying to select something
                 if (window.getSelection().toString() !== '') {
                   return;
                 }
                 // Don't change the input if the user is hitting the arrow keys
                 if ([38, 40, 37, 39].includes(e.keyCode)) {
                   return;
                 }

                 // Grab the value from the input field
                 let allyCode = e.target.value;

                 // Take only numbers
                 allyCode = allyCode.replace(/[^\d]/g, '');

                 // Take only the first 9 digits
                 allyCode = allyCode.substr(0, 9);

                 // Split the numbers into chunks of 3
                 const allyCodeChunks = allyCode.match(/\d{1,3}/g) || [];

                 // Add dashes between each and set the value back on the field
                 e.target.value = allyCodeChunks.join('-');
               }}
        />
        <button type={'button'} onClick={() => {
          this.queryPlayerProfile(document.getElementById('ally-code').value);
        }}>
          Fetch my data!
        </button>
        <input id={'keep-old-mods'} name={'keep-old-mods'} type={'checkbox'} value={'keep-old-mods'}
               defaultChecked={true}/>
        <label htmlFor={'keep-old-mods'}>Remember existing mods</label>
        <br/>
        <FileInput label={'Upload my mods!'} handler={this.readModsFile.bind(this)}/>
        <FileInput label={'Restore my progress'} handler={this.restoreFromFile.bind(this)}/>
        {showActions &&
        <a id={'saveProgress'}
           href={this.getProgressData()}
           className={'button'}
           download={`modsOptimizer-${(new Date()).toISOString().slice(0, 10)}.json`}
        >
          Save my progress
        </a>
        }
        {showActions &&
        <button type={'button'} className={'red'} onClick={() => this.setState({'reset': true})}>
          Reset Mods Optimizer
        </button>
        }
      </div>
    </header>;
  }

  /**
   * Renders the footer for the application
   * @returns JSX Element
   */
  footer() {
    return <footer className={'App-footer'}>
      Star Wars: Galaxy of Heroes™ is owned by EA and Capital Games. This site is not affiliated with them.<br/>
      <a href={'mailto:grandivory+swgoh@gmail.com'} target={'_blank'} rel={'noopener'}>Send Feedback</a>&nbsp;|&nbsp;
      <a href={'https://github.com/grandivory/mods-optimizer'} target={'_blank'} rel={'noopener'}>Contribute</a>
      &nbsp;|&nbsp;
      <a href={'https://discord.gg/WFKycSm'} target={'_blank'} rel={'noopener'}>Discord</a>
      &nbsp;| Like the tool? Consider donating to support the developer!&nbsp;
      <a href={'https://paypal.me/grandivory'} target={'_blank'} rel={'noopener'} className={'gold'}>Paypal</a>
      &nbsp;or&nbsp;
      <a href={'https://www.patreon.com/grandivory'} target={'_blank'} rel={'noopener'} className={'gold'}>Patreon</a>
      <div className={'version'}>
        <a onClick={() => this.setState({showChangeLog: true})}>version {this.version}</a>
      </div>
    </footer>;
  }

  /**
   * Renders the welcome screen for when someone first opens the application
   * @returns JSX Element
   */
  welcome() {
    return <div className={'welcome'}>
      <h2>Welcome to Grandivory's Mods Optimizer for Star Wars: Galaxy of Heroes™!</h2>
      <p>
        This application will allow you to equip the optimum mod set on every character you have by assigning
        a value to each stat that a mod can confer. You'll give it a list of characters to optimize along
        with the stats that you're looking for, and it will determine the best mods to equip, one character at a
        time, until your list is exhausted.
      </p>
      <p>
        To get started, enter your ally code in the box in the header and click "Get my mods!". Note that your mods
        will only be updated a maximum of once per hour.
      </p>
      <p>
        If you have a mods file from either the SCORPIO bot (check out the discord server below) or from the <a
        className={'call-out'} target={'_blank'} rel={'noopener'}
        href="https://docs.google.com/spreadsheets/d/1aba4x-lzrrt7lrBRKc1hNr5GoK5lFNcGWQZbRlU4H18/copy">
        Google Sheet
      </a>, you can drop them in the box below, or use the "Upload my mods!" button above!
      </p>
      <FileDropZone handler={this.readModsFile.bind(this)} label={'Drop your mods file here!'}/>
    </div>;
  }

  /**
   * Shows a popup with an error message
   * @param errorMessage
   * @returns JSX Element
   */
  errorModal(errorMessage) {
    return <div>
      <WarningLabel/>
      <h2 key={'error-header'}>Error!</h2>
      <p key={'error-message'}>{errorMessage}</p>
      <div key={'error-actions'} className={'actions'}>
        <button type={'button'} onClick={() => this.setState({'error': false})}>Ok</button>
      </div>
    </div>;
  }

  /**
   * Renders the "Are you sure?" modal for resetting the app
   * @returns JSX Element
   */
  resetModal() {
    return <div>
      <h2>Reset the mods optimizer?</h2>
      <p>
        If you click "Reset", everything that the application currently has saved - your mods,
        character configuration, selected characters, etc. - will all be deleted.
        Are you sure that's what you want?
      </p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.setState({'reset': false})}>Cancel</button>
        <button type={'button'} className={'red'} onClick={this.handleReset}>Reset</button>
      </div>
    </div>;
  }

  /**
   * Renders a popup describing the changes from the previous version, and any actions that the user needs to take.
   * @returns JSX Element
   */
  changeLogModal() {
    return <div>
      <h2 className={'gold'}>Grandivory's Mods Optimizer has updated to version 1.2!</h2>
      <h3>Here's a short summary of the changes included in this version:</h3>
      <ul>
        <li>
          Now, rather than selecting stat weights for <strong>Offense</strong> and <strong>Defense</strong>, characters
          are optimized by selecting weights for <strong>Physical Damage</strong>, <strong>Special Damage</strong>
          , <strong>Armor</strong>, and <strong>Resistance</strong>. This means that you now have the opportunity to
          give different weights to different attacks for characters that deal both physical and special damage. All
          optimization targets have been updated to match this new format.
        </li>
        <li>
          When reviewing the mods that the optimizer suggests, the optimizer will now show you not only the sum of the
          stats on the mods, but their effect on your character's total stats! Now you can easily see what the final
          speed of your arena team will be, or more easily target specific speeds, damage numbers, or critical chance
          numbers for various phases of the raids!
        </li>
        <li>
          Because many of the default optimization targets have changed, I've added the ability to reset all characters
          to their default targets. This will reset any optimization target that has the same name as one of the
          defaults, but will leave any custom targets unchanged. This is meant to be a quick way to either accept
          changes after a major update like this, or to reset your characters if you don't like the changes you've made.
        </li>
      </ul>
      <h3>Happy Modding!</h3>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.setState({showChangeLog: false})}>OK</button>
      </div>
    </div>;
  }

  /**
   * Get all of the data needed to save the app state
   */
  getProgressData() {
    return 'data:text/json;charset=utf-8,' + JSON.stringify({
      'state': {
        'version': window.localStorage.getItem('optimizer.version'),
        'mods': window.localStorage.getItem('optimizer.mods'),
        'allyCode': window.localStorage.getItem('optimizer.allyCode'),
        'availableCharacters': window.localStorage.getItem('optimizer.availableCharacters'),
        'lockedCharacters': window.localStorage.getItem('optimizer.lockedCharacters'),
        'selectedCharacters': window.localStorage.getItem('optimizer.selectedCharacters')
      }
    });
  }

  /**
   * Handle the "Reset Mods Optimizer" button press. Remove all saved state and refresh the page
   */
  handleReset() {
    window.localStorage.clear();
    window.location.reload();
  }
}

export default App;
