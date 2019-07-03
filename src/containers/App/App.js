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
import {
  changeSection,
  deleteProfile,
  hideModal,
  reset,
  restoreProgress,
  showError,
  showModal
} from "../../state/actions/app";
import {checkVersion, refreshPlayerData, toggleKeepOldMods} from "../../state/actions/data";
import FlashMessage from "../../components/Modal/FlashMessage";
import {saveAs} from 'file-saver';
import {exportDatabase, loadProfile} from "../../state/actions/storage";

class App extends PureComponent {

  constructor(props) {
    super(props);

    // If an ally code is passed in to the app, then fetch data for that ally code immediately
    const queryParams = new URLSearchParams(document.location.search);

    if (queryParams.has('allyCode')) {
      props.refreshPlayerData(queryParams.get('allyCode'), true);
    }

    // Remove the query string after reading anything we needed from it.
    window.history.replaceState({}, document.title, document.location.href.split('?')[0]);

    // Check the current version of the app against the API
    props.checkVersion();
  }

  escapeListener(e) {
    if (e.key === 'Escape' && this.props.isModalCancelable) {
      this.props.hideModal();
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.escapeListener);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Once we get a profile, check to see if the previous version is such that we should show the change log
    if ((this.props.previousVersion < '1.5') && (!prevProps.profile && this.props.profile)) {
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
        <FlashMessage/>
        <ErrorModal/>
        <Modal show={this.props.displayModal}
               className={this.props.modalClass}
               content={this.props.modalContent}
               cancelable={this.props.isModalCancelable} />
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
    let allyCodyInput;

    return <header className={'App-header'}>
      <h1 className={'App-title'}>Grandivory's Mods Optimizer for Star Wars: Galaxy of Heroes™</h1>
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
        <label htmlFor={'ally-code'}>{this.props.allyCode ? 'Player' : 'Ally code'}:</label>
        {/* If there is no active ally code, then show the regular input field */}
        {!this.props.allyCode &&
        <input id={'ally-code'} type={'text'} inputMode={'numeric'} size={12} ref={input => allyCodyInput = input}
               onKeyUp={(e) => {
                 if (e.key === 'Enter') {
                   this.props.refreshPlayerData(e.target.value, this.props.keepOldMods);
                 }
                 // Don't change the input if the user is trying to select something
                 if (window.getSelection().toString() !== '') {
                   return;
                 }
                 // Don't change the input if the user is hitting the arrow keys
                 if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                   return;
                 }

                 // Format the input field
                 e.target.value = formatAllyCode(e.target.value);
               }}
        />
        }
        {/* If there is an active ally code, show a dropdown */}
        {this.props.allyCode &&
        <div className={'dropdown'}>
          <select
            id={'ally-code'}
            value={this.props.allyCode}
            onChange={e => {
              if ('' === e.target.value) {
                this.props.showModal('', this.addAllyCodeModal());
              } else {
                this.props.switchProfile(e.target.value);
              }
            }}>
            {Object.entries(this.props.playerProfiles).map(([allyCode, playerName]) =>
              <option key={allyCode} value={allyCode}>{playerName}</option>
            )}
            <option key={'new'} value={''}>New Code...</option>
          </select>
        </div>
        }
        {this.props.allyCode &&
        <button type={'button'}
                className={'red'}
                onClick={() => this.props.showModal('', this.deleteAllyCodeModal())}
        >
          X
        </button>
        }
        <button type={'button'}
                onClick={() => {
                  this.props.refreshPlayerData(this.props.allyCode || allyCodyInput.value, this.props.keepOldMods);
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
        <FileInput label={'Restore my progress'} handler={(file) => this.readFile(file, this.props.restoreProgress)}/>
        {showActions &&
        <button type={'button'} onClick={() => {
          this.props.exportDatabase(progressData => {
            progressData.version = this.props.version;
            progressData.allyCode = this.props.allyCode;
            const progressDataSerialized = JSON.stringify(progressData);
            const userData = new Blob([progressDataSerialized], {type: 'application/json;charset=utf-8'});
            saveAs(userData, `modsOptimizer-${(new Date()).toISOString().slice(0, 10)}.json`);
          });
        }}>
          Save my progress
        </button>
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
        <button className={'link'} onClick={() => this.props.showModal('changelog-modal', this.changeLogModal())}>
          version {this.props.version}
        </button>
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
      <h2 className={'gold'}>Grandivory's Mods Optimizer has updated to version 1.5!</h2>
      <h3>Here's a short summary of the changes included in this version:</h3>
      <ul>
        <li>
          The character selection interface has been updated so that it's now possible to add a character to the
          selected list multiple times. When this happens, the character will be optimized using the mods available at
          each part. This should allow you to create mod sets that can be swapped on a character without having to pull
          mods from any other character.
        </li>
        <li>
          A lot of functionality has been added around character templates - pre-selected sets of selected characters
          and their targets. These new lists can be exported from the tool to be shared amongst friends or guilds, and
          any template can be either appended to the selected characters list or used to replace the full list.
        </li>
        <li>
          The character selection view has been updated to show a lot more information at a glance. It's now possible to
          see, for each character, what the minimum dots are for suggested mods, whether their mods will be leveled to
          15, whether their mods will be sliced to 6E, whether any restrictions have been applied, whether a target stat
          is selected, if the character is in the list multiple times, if any stat weights are negative, if the selected
          target has been changed from the default, if all stat weights are 0, and whether the character is locked.
        </li>
        <li>
          Character locking has been changed again. Characters can now be locked by clicking on the "lock" icon next to
          each character portrait or at the right of the icon list in the selected characters. With this change,
          character locking is now completely independent of whether a character is selected or what target is chosen
          for them.
        </li>
        <li>
          The view to see the suggested mod sets and to show a list of mods to move have been combined into a single
          view. You can now select how to view the results using the form controls in the sidebar. When viewing the sets
          assigned to each character, some extra information will be shown, including current character stats, final
          character stats, and overall value of each stat.
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

  /**
   * Renders a modal with a form for adding a new ally code
   */
  addAllyCodeModal() {
    let allyCodeInput;

    return <div className={'add-ally-code-form'}>
      <h4>Add a new Ally Code</h4>
      <label htmlFor={'new-ally-code'}>Ally code: </label>
      <input id={'new-ally-code'} type={'text'} inputMode={'numeric'} size={12} ref={input => allyCodeInput = input}
             onKeyUp={(e) => {
               if (e.key === 'Enter') {
                 this.props.hideModal();
                 this.props.refreshPlayerData(e.target.value, false);
               }
               // Don't change the input if the user is trying to select something
               if (window.getSelection().toString() !== '') {
                 return;
               }
               // Don't change the input if the user is hitting the arrow keys
               if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                 return;
               }

               // Format the input field
               e.target.value = formatAllyCode(e.target.value);
             }}
      />
      <div className={'actions'}>
        <button type={'button'}
                onClick={() => {
                  this.props.hideModal();
                  this.props.refreshPlayerData(allyCodeInput.value, false);
                }}>
          Fetch my data!
        </button>
      </div>
    </div>
  }

  /**
   * Renders the "Are you sure?" modal for deleting an ally code
   */
  deleteAllyCodeModal() {
    return <div>
      <h2>Delete <strong>{formatAllyCode(this.props.allyCode)}</strong>?</h2>
      <p>This will delete the ally code, all of its mods, character selections, and targets from stored data.</p>
      <p>You will be able to restore the character and mod data by fetching with this ally code again.</p>
      <p>Are you sure you want to delete this code?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} className={'red'}
                onClick={() => {
                  this.props.hideModal();
                  this.props.deleteProfile(this.props.allyCode);
                }}>
          Delete
        </button>
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
    isModalCancelable: state.modal && state.modal.cancelable,
    playerProfiles: state.playerProfiles,
    previousVersion: state.previousVersion,
    section: state.section,
    version: state.version
  };

  if (state.profile) {
    appProps.profile = state.profile;
  }

  return appProps;
};

const mapDispatchToProps = dispatch => ({
  changeSection: newSection => dispatch(changeSection(newSection)),
  refreshPlayerData: (allyCode, keepOldMods) => dispatch(refreshPlayerData(allyCode, keepOldMods)),
  checkVersion: () => dispatch(checkVersion()),
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal()),
  showError: (message) => dispatch(showError(message)),
  toggleKeepOldMods: () => dispatch(toggleKeepOldMods()),
  reset: () => dispatch(reset()),
  restoreProgress: (progressData) => dispatch(restoreProgress(progressData)),
  switchProfile: (allyCode) => dispatch(loadProfile(allyCode)),
  deleteProfile: (allyCode) => dispatch(deleteProfile(allyCode)),
  exportDatabase: (callback) => dispatch(exportDatabase(callback))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
