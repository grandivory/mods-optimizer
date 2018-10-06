// @flow

import React, {Component} from 'react';
import '../boilerplate.css';
import './App.css';
import OptimizerView from "../OptimizerView/OptimizerView";
import ExploreView from "../ExploreView/ExploreView";
import FileInput from "../../components/FileInput/FileInput";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import FileDropZone from "../../components/FileDropZone/FileDropZone";
import {changeSection, hideModal, logState, refreshPlayerData, showModal, toggleKeepOldMods} from "../../state/actions";
import {connect} from "react-redux";
import formatAllyCode from "../../utils/formatAllyCode";
import ErrorModal from "../../components/ErrorModal/ErrorModal";

class App extends Component {
  constructor(props) {
    super(props);

    // If an ally code is passed in to the app, then fetch data for that ally code immediately
    const queryParams = new URLSearchParams(document.location.search);

    if (queryParams.has('allyCode')) {
      props.refreshPlayerData(queryParams.get('allyCode'));
    }

    // Remove the query string after reading anything we needed from it.
    window.history.replaceState({}, document.title, document.location.href.split('?')[0]);
  }

  // TODO: Finish moving this to Redux
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
  // processMods(modsJson, keepOldMods) {
  //   let mods = [];
  //   let newMods = {};
  //
  //   for (let fileMod of modsJson) {
  //     const mod = Mod.deserialize(fileMod, characters);
  //     newMods[mod.id] = mod;
  //   }
  //
  //   if (keepOldMods) {
  //     let oldMods = {};
  //     this.state.mods.forEach(mod => {
  //       oldMods[mod.id] = mod;
  //
  //       // Unassign all old mods before adding in new ones. Any mods that are still assigned will be in the modsJson
  //       oldMods[mod.id].currentCharacter = null;
  //     });
  //
  //     mods = Object.values(Object.assign(oldMods, newMods));
  //   } else {
  //     mods = Object.values(newMods);
  //   }
  //
  //   return mods;
  // }

  render() {
    const instructionsScreen = !this.props.profile;

    return <div className={'App'}>
      {this.header(!instructionsScreen)}
      <div className={'app-body'}>
        {instructionsScreen && this.welcome()}
        {!instructionsScreen && 'explore' === this.props.section &&
        <ExploreView mods={this.props.profile.mods}/>// saveState={this.saveState.bind(this)}/>
        }
        {!instructionsScreen && 'optimize' === this.props.section &&
        <OptimizerView
          mods={this.props.profile.mods}
          availableCharacters={Object.values(this.props.profile.characters)}
          selectedCharacters={[]}
          // saveState={this.saveState.bind(this)}
        />
        }
        <ErrorModal/>
        <Modal show={this.props.modal} className={'reset-modal'} content={this.props.modal}/>
        <Spinner show={this.props.isBusy}/>
      </div>
      {this.footer()}
    </div>;
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
        <button className={'explore' === this.props.section ? 'active' : ''}
                onClick={() => this.props.changeSection('explore')}>Explore my mods
        </button>
        <button className={'optimize' === this.props.section ? 'active' : ''}
                onClick={() => this.props.changeSection('optimize')}>Optimize my mods
        </button>
      </nav>
      }
      <div className={'actions'}>
        <label htmlFor={'ally-code'}>Ally code:</label>
        <input id={'ally-code'} type={'text'} inputMode={'numeric'}
               defaultValue={formatAllyCode(this.props.allyCode || '')}
               onKeyUp={(e) => {
                 if (e.key === 'Enter') {
                   this.props.refreshPlayerData(e.target.value);
                 }
                 // Don't change the input if the user is trying to select something
                 if (window.getSelection().toString() !== '') {
                   return;
                 }
                 // Don't change the input if the user is hitting the arrow keys
                 // TODO: Change this to use a non-deprecated property
                 if ([38, 40, 37, 39].includes(e.keyCode)) {
                   return;
                 }

                 // Format the input field
                 e.target.value = formatAllyCode(e.target.value);
               }}
        />
        <button type={'button'}
                onClick={() => {
                  this.props.refreshPlayerData(document.getElementById('ally-code').value);
                }}>
          Fetch my data!
        </button>
        <input id={'keep-old-mods'}
               name={'keep-old-mods'}
               type={'checkbox'}
               value={'keep-old-mods'}
               defaultChecked={this.props.keepOldMods}
               onChange={() => this.props.toggleKeepOldMods()}
        />
        <label htmlFor={'keep-old-mods'}>Remember existing mods</label>
        <br/>
        // TODO: Move to Redux
        <FileInput label={'Upload my mods!'} handler={this.readModsFile.bind(this)}/>
        // TODO: Move to Redux
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
        <button type={'button'} className={'red'} onClick={() => this.props.showModal(this.resetModal())}>
          Reset Mods Optimizer
        </button>
        }
        <button type={'button'} onClick={() => this.props.logState()}>
          Log State
        </button>
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
        <a onClick={() => this.props.showModal(this.changeLogModal())}>version {this.props.version}</a>
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
        <button type={'button'} onClick={() => this.props.hideModal()}>OK</button>
      </div>
    </div>;
  }

  /**
   * Get all of the data needed to save the app state
   */
  // TODO: Get this from Redux
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
}

const mapStateToProps = (state) => {
  const appProps = {
    allyCode: state.allyCode,
    error: state.error,
    isBusy: state.isBusy,
    keepOldMods: state.keepOldMods,
    modal: state.modal,
    section: state.section,
    version: state.version
  };

  if (state.allyCode) {
    appProps.profile = state.profiles[state.allyCode]
  }

  return appProps;
};

const mapDispatchToProps = dispatch => ({
  changeSection: newSection => {
    dispatch(changeSection(newSection));
  },
  refreshPlayerData: allyCode => {
    dispatch(refreshPlayerData(allyCode));
  },
  showModal: content => {
    dispatch(showModal(content));
  },
  hideModal: () => {
    dispatch(hideModal());
  },
  toggleKeepOldMods: () => {
    dispatch(toggleKeepOldMods());
  },
  logState: () => {
    dispatch(logState());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
