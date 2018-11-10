// @flow

import React, {PureComponent} from 'react';
import './boilerplate.css';
import './App.css';
import OptimizerView from "../OptimizerView/OptimizerView";
import ExploreView from "../ExploreView/ExploreView";
import FileInput from "../../components/FileInput/FileInput";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import {connect} from "react-redux";
import formatAllyCode from "../../utils/formatAllyCode";
import ErrorModal from "../ErrorModal/ErrorModal";
import {serializeState} from "../../state/storage";
import {changeSection, hideModal, reset, restoreProgress, showError, showModal} from "../../state/actions/app";
import {refreshPlayerData, setMods, toggleKeepOldMods} from "../../state/actions/data";

class App extends PureComponent {
  constructor(props) {
    super(props);

    // If an ally code is passed in to the app, then fetch data for that ally code immediately
    const queryParams = new URLSearchParams(document.location.search);

    if (queryParams.has('allyCode')) {
      props.refreshPlayerData(queryParams.get('allyCode'));
    }

    // Remove the query string after reading anything we needed from it.
    window.history.replaceState({}, document.title, document.location.href.split('?')[0]);

    if ((props.previousVersion < '1.3.0') && props.profile) {
      this.props.showModal('changelog-modal', this.changeLogModal());
    }
  }

  /**
   * Read a file as input and pass its contents to another function for processing
   * @param fileInput The uploaded file
   * @param handleResult Function string => *
   */
  readFile(fileInput, handleResult) {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const fileData = event.target.result;
        handleResult(fileData);
      } catch (e) {
        this.props.showError(e.message);
      }
    };

    reader.readAsText(fileInput);
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

  render() {
    const instructionsScreen = !this.props.profile;

    return <div className={'App'}>
      {this.header(!instructionsScreen)}
      <div className={'app-body'}>
        {instructionsScreen && this.welcome()}
        {!instructionsScreen && 'explore' === this.props.section &&
        <ExploreView/>
        }
        {!instructionsScreen && 'optimize' === this.props.section &&
        <OptimizerView/>
        }
        <ErrorModal/>
        <Modal show={this.props.displayModal} className={this.props.modalClass} content={this.props.modalContent}/>
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
               checked={this.props.keepOldMods}
               onChange={() => this.props.toggleKeepOldMods()}
        />
        <label htmlFor={'keep-old-mods'}>Remember existing mods</label>
        <br/>
        <FileInput label={'Upload my mods!'} handler={(file) => this.readFile(file, this.props.setMods)}/>
        <FileInput label={'Restore my progress'} handler={(file) => this.readFile(file, this.props.restoreProgress)}/>
        {showActions &&
        <a id={'saveProgress'}
           href={this.props.progressData}
           className={'button'}
           download={`modsOptimizer-${(new Date()).toISOString().slice(0, 10)}.json`}
        >
          Save my progress
        </a>
        }
        {showActions &&
        <button type={'button'} className={'red'}
                onClick={() => this.props.showModal('reset-modal', this.resetModal())}>
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
        <a onClick={() => this.props.showModal('changelog-modal', this.changeLogModal())}>
          version {this.props.version}
        </a>
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
    </div>;
  }

  /**
   * Renders a popup describing the changes from the previous version, and any actions that the user needs to take.
   * @returns JSX Element
   */
  changeLogModal() {
    return <div>
      <h2 className={'gold'}>Grandivory's Mods Optimizer has updated to version 1.3!</h2>
      <h3>Here's a short summary of the changes included in this version:</h3>
      <ul>
        <li>
          The internals of the mods optimizer have undergone a major refactor. The behavior should be mostly the same,
          but if you see anything behaving in an unexpected way, please submit a bug via the discord link in the footer!
        </li>
        <li>
          Default character data (name, avatar, tags, etc.) is now pulled directly from swgoh.gg every time you fetch
          your character data. This means a couple things. First, you'll notice that all of your characters have the
          "missing character" portrait. Don't worry - the character data is still there, and the next time you fetch
          your data, the avatars should be fixed. Second, you no longer have to wait for me to put new characters into
          the optimizer every time a new one is added to the game! As soon as swgoh.gg adds the character and Crinolo
          adds their stats, the optimizer will know how to use them. I'll still try to get some default targets added
          as quickly as I can, but a failure on my part will no longer prevent people from using the optimizer on their
          favorite new characters!
        </li>
        <li>
          All player data is now stored internally by ally code. This means that if you're fetching data for multiple
          ally codes, the optimizer will now properly separate your mods, selected characters, targets, etc. The
          currently active ally code is switched every time you fetch your data!
        </li>
      </ul>
      <h3>Happy Modding!</h3>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>OK</button>
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
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} className={'red'} onClick={() => this.props.reset()}>Reset</button>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => {
  const appProps = {
    allyCode: state.allyCode,
    error: state.error,
    isBusy: state.isBusy,
    keepOldMods: state.keepOldMods,
    displayModal: !!state.modal,
    modalClass: state.modal ? state.modal.class : '',
    modalContent: state.modal ? state.modal.content : '',
    previousVersion: state.previousVersion,
    progressData: 'data:text/json;charset=utf-8,' + JSON.stringify(serializeState(state)),
    section: state.section,
    version: state.version
  };

  if (state.allyCode) {
    appProps.profile = state.profiles[state.allyCode]
  }

  return appProps;
};

const mapDispatchToProps = dispatch => ({
  changeSection: newSection => dispatch(changeSection(newSection)),
  refreshPlayerData: allyCode => dispatch(refreshPlayerData(allyCode)),
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal()),
  showError: (message) => dispatch(showError(message)),
  toggleKeepOldMods: () => dispatch(toggleKeepOldMods()),
  reset: () => dispatch(reset()),
  restoreProgress: (progressData) => dispatch(restoreProgress(progressData)),
  setMods: (modsData) => dispatch(setMods(modsData))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
