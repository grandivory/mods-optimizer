import React, {Component} from 'react';
import StatClassifier from '../../utils/StatClassifier';
import '../boilerplate.css';
import './App.css';
import Mod from "../../domain/Mod";
import OptimizerView from "../OptimizerView/OptimizerView";
import ExploreView from "../ExploreView/ExploreView";
import FileInput from "../../components/FileInput/FileInput";
import FileDropZone from "../../components/FileDropZone/FileDropZone";
import Modal from "../../components/Modal/Modal";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.view = 'optimize';
    this.state.mods = [];

    let savedMods = window.localStorage.getItem('optimizer.mods');
    if (savedMods) {
      this.state.mods = this.processMods(JSON.parse(savedMods));
    }
  }

  /**
   * Saves the application state to localStorage
   */
  saveState() {
    const saveProgressButton = document.getElementById('saveProgress');

    window.localStorage.setItem('optimizer.mods', JSON.stringify(this.state.mods.map(mod => mod.serialize())));
    saveProgressButton.href = this.getProgressData();
    saveProgressButton.download = `modsOptimizer-${(new Date()).toISOString().slice(0, 10)}.json`
  }

  /**
   * File handler to process an input file containing mod data.
   *
   * @param fileInput The uploaded mods file
   */
  readModsFile(fileInput) {
    let reader = new FileReader();

    reader.onload = (event) => {
      const mods = this.processMods(JSON.parse(event.target.result));

      this.setState({
        'mods': mods
      });

      this.saveState();
    };

    reader.readAsText(fileInput);
  }

  /**
   * Restore the app state from a file and refresh the app
   */
  restoreFromFile(fileInput) {
    let reader = new FileReader();

    reader.onload = (event) => {
      const state = JSON.parse(event.target.result).state;

      window.localStorage.setItem('optimizer.mods', state.mods);
      window.localStorage.setItem('availableCharacters', state.availableCharacters);
      window.localStorage.setItem('lockedCharacters', state.lockedCharacters);
      window.localStorage.setItem('selectedCharacters', state.selectedCharacters);

      window.location.reload();
    };

    reader.readAsText(fileInput);
  }

  /**
   * Given the input from a file exported from the Mods Manager Importer, read mods into memory in the format
   * used by this application
   *
   * @param fileInput array The parsed contents of the file generated by the Mods Manager Importer
   *
   * @return Array[Mod]
   */
  processMods(fileInput) {
    let mods = [];

    for (let fileMod of fileInput) {
      mods.push(Mod.deserialize(fileMod));
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
          <OptimizerView mods={this.state.mods} saveState={this.saveState.bind(this)}/>
          }
          <Modal show={this.state.reset} className={'reset-modal'} content={this.resetModal()} />
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
      <form id={'donate-button'} action={'https://www.paypal.com/cgi-bin/webscr'} method={'post'} target={'_top'}>
        <input type={'hidden'} name={'cmd'} value={'_s-xclick'}/>
        <input type={'hidden'} name={'encrypted'}
               value={'-----BEGIN PKCS7-----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-----END PKCS7-----'}/>
        <input type={'image'}
               src={'https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif'}
               border={'0'}
               name={'submit'}
               alt={'PayPal - The safer, easier way to pay online!'}
        />
        <img alt={''}
             border={'0'}
             src={'https://www.paypalobjects.com/en_US/i/scr/pixel.gif'}
             width={'1'}
             height={'1'}
        />
      </form>
      or&nbsp;
      <a href={'https://www.patreon.com/grandivory'} target={'_blank'} rel={'noopener'}>Patreon</a>
      <div className={'version'}>version 1.0.5</div>
    </footer>;
  }

  /**
   * Renders the welcome screen for when someone first opens the application
   * @returns JSX Element
   */
  welcome() {
    return <div className={'welcome'}>
      <h2>Welcome to the mod optimizer for Star Wars: Galaxy of Heroes™!</h2>
      <p>
        This application will allow you to equip the optimum mod set on every character you have by assigning
        a value to each stat that a mod can confer. You'll give it a list of characters to optimize for along
        with the stats that you're looking for, and it will determine the best mods to equip, one character at a
        time, until your list is exhausted.
      </p>
      <p>
        To get started, copy the google sheet <a className={'call-out'} target={'_blank'} rel={'noopener'}
                                                 href="https://docs.google.com/spreadsheets/d/1aba4x-lzrrt7lrBRKc1hNr5GoK5lFNcGWQZbRlU4H18/copy">here</a>
        , courtesy of <a href="http://apps.crouchingrancor.com">Crouching Rancor</a>.
        It will allow you to export your mods from <a href="https://swgoh.gg">SWGOH.gg</a> in order to import
        them into this tool. When you're ready, you can click the button above, or drag your mods file into the
        box below.
      </p>
      <FileDropZone handler={this.readModsFile.bind(this)} label={'Drop your mods file here!'}/>
    </div>;
  }

  /**
   * Renders the "Are you sure?" modal for resetting the app
   * @returns Array[JSX Element]
   */
  resetModal() {
    return [
      <h2>Reset the mods optimizer?</h2>,
      <p>
        If you click "Reset", everything that the application currently has saved - your mods,
        character configuration, selected characters, etc. - will all be deleted.
        Are you sure that's what you want?
      </p>,
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.setState({'reset': false})}>Cancel</button>
        <button type={'button'} className={'red'} onClick={this.handleReset}>Reset</button>
      </div>,
    ];
  }

  /**
   * Get all of the data needed to save the app state
   */
  getProgressData() {
    return 'data:text/json;charset=utf-8,' + JSON.stringify({
      'state': {
        'mods': window.localStorage.getItem('optimizer.mods'),
        'availableCharacters': window.localStorage.getItem('availableCharacters'),
        'lockedCharacters': window.localStorage.getItem('lockedCharacters'),
        'selectedCharacters': window.localStorage.getItem('selectedCharacters')
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
