// @flow

import React, { PureComponent } from 'react';
import './boilerplate.css';
import './App.css';
import OptimizerView from "../OptimizerView/OptimizerView";
import ExploreView from "../ExploreView/ExploreView";
import FileInput from "../../components/FileInput/FileInput";
import Modal from "../../components/Modal/Modal";
import Spinner from "../../components/Spinner/Spinner";
import { connect } from "react-redux";
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
import { checkVersion, refreshPlayerData, toggleKeepOldMods, setHotUtilsSessionId } from "../../state/actions/data";
import FlashMessage from "../../components/Modal/FlashMessage";
import { saveAs } from 'file-saver';
import { exportDatabase, loadProfile } from "../../state/actions/storage";
import Help from '../../components/Help/Help';
import { Dropdown } from '../../components/Dropdown/Dropdown';

class App extends PureComponent {

  constructor(props) {
    super(props);

    // If an ally code is passed in to the app, then fetch data for that ally code immediately
    const queryParams = new URLSearchParams(document.location.search);

    if (queryParams.has('allyCode')) {
      if (queryParams.has('SessionID') && queryParams.has('NoPull')) {
        props.setHotUtilsSessionId(queryParams.get('allyCode'), queryParams.get('SessionID'));
      } else if (queryParams.has('SessionID')) {
        props.refreshPlayerData(queryParams.get('allyCode'), true, queryParams.get('SessionID'), false);
      } else if (!queryParams.has('NoPull')) {
        props.refreshPlayerData(queryParams.get('allyCode'), true, null);
      }
    }

    // Remove the query string after reading anything we needed from it.
    window.history.replaceState({}, document.title, document.location.href.split('?')[0]);

    // Check the current version of the app against the API
    props.checkVersion();
  }

  escapeListener = function (e) {
    if (e.key === 'Escape' && this.props.isModalCancelable) {
      this.props.hideModal();
    }
  }.bind(this);

  componentDidMount() {
    document.addEventListener('keyup', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.escapeListener);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Once we get a profile, check to see if the previous version is such that we should show the change log
    if ((this.props.previousVersion < '1.8') && (!prevProps.profile && this.props.profile)) {
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
          <ExploreView />
        }
        {!instructionsScreen && 'optimize' === this.props.section &&
          <OptimizerView />
        }
        <FlashMessage />
        <ErrorModal />
        <Modal show={this.props.displayModal}
          className={this.props.modalClass}
          content={this.props.modalContent}
          cancelable={this.props.isModalCancelable} />
        <Spinner show={this.props.isBusy} />
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
      <h1 className={'App-title'}>
        Grandivory's Mods Optimizer <span className="subtitle">for Star Wars: Galaxy of Heroes™</span>
      </h1>
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
                this.props.refreshPlayerData(e.target.value, this.props.keepOldMods, null);
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
          <Dropdown
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
          </Dropdown>
        }
        {this.props.allyCode &&
          <button type={'button'}
            className={'red'}
            onClick={() => this.props.showModal('', this.deleteAllyCodeModal())}
          >
            X
        </button>
        }
        <div className="fetch-actions">
          <button type={'button'}
            onClick={() => {
              this.props.refreshPlayerData(
                this.props.allyCode || allyCodyInput.value,
                this.props.keepOldMods,
                null
              );
            }}>
            Fetch my data!
        </button>
          <button
            type={'button'}
            disabled={!(
              this.props.hotUtilsSubscription &&
              this.props.profile &&
              this.props.profile.hotUtilsSessionId
            )}
            onClick={() => {
              if (this.props.hotUtilsSubscription && this.props.profile.hotUtilsSessionId) {
                this.props.showModal('pull-unequipped-modal', this.fetchUnequippedModal())
              }
            }}>
            Fetch with HotUtils
        </button>
          <Help header={'How do I pull unequipped mods?'}>{this.unequippedModsHelp()}</Help>
          <div className="form-item">
            <input id={'keep-old-mods'}
              name={'keep-old-mods'}
              type={'checkbox'}
              value={'keep-old-mods'}
              checked={this.props.keepOldMods}
              onChange={() => this.props.toggleKeepOldMods()}
            />
            <label htmlFor={'keep-old-mods'}>Remember existing mods</label>
          </div>
        </div>
        <div className="state-actions">
          <FileInput label={'Restore my progress'} handler={(file) => this.readFile(file, this.props.restoreProgress)} />
          {showActions &&
            <button type={'button'} onClick={() => {
              this.props.exportDatabase(progressData => {
                progressData.version = this.props.version;
                progressData.allyCode = this.props.allyCode;

                // Remove the HotUtils session ID from the output
                progressData.profiles.forEach(profile => delete profile.hotUtilsSessionId)

                const progressDataSerialized = JSON.stringify(progressData);
                const userData = new Blob([progressDataSerialized], { type: 'application/json;charset=utf-8' });
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
      </div>
    </header>;
  }

  /**
   * Renders the footer for the application
   * @returns JSX Element
   */
  footer() {
    return <footer className={'App-footer'}>
      Star Wars: Galaxy of Heroes™ is owned by EA and Capital Games. This site is not affiliated with them.<br />
      <a href={'https://github.com/grandivory/mods-optimizer'} target={'_blank'} rel={'noopener noreferrer'}>
        Contribute
      </a>
      &nbsp;|&nbsp;
      Ask for help or give feedback on <a href={'https://discord.gg/WFKycSm'} target={'_blank'} rel={'noopener noreferrer'}>
        Discord
      </a>
      &nbsp;| Like the tool? Consider donating to support the developer!&nbsp;
      <a href={'https://paypal.me/grandivory'} target={'_blank'} rel={'noopener noreferrer'} className={'gold'}>
        Paypal
      </a>
      &nbsp;or&nbsp;
      <a href={'https://www.patreon.com/grandivory'} target={'_blank'} rel={'noopener noreferrer'} className={'gold'}>
        Patreon
      </a>
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
      <h2 className={'gold'}>Grandivory's Mods Optimizer has updated to version 1.8!</h2>
      <h3>Here's a short summary of the changes included in this version:</h3>
      <ul>
        <li>
          Updated the integration with <a href={'https://www.hotutils.com'} target={'_blank'} rel={'noopener noreferrer'}>HotUtils</a> to version 2! This brings some great advantages to both HotUtils
          subscribers and non-subscribers. ALL players can now fetch their mod
          data <strong>as often as they'd like</strong>, with no cooldown between fetches! A HotUtils subscription is
          still required to fetch unequipped mods. A progress bar is now also shown when using HotUtils to move your
          mods in-game, and that move can be cancelled at any time!
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
      <input id={'new-ally-code'} type={'text'} inputMode={'numeric'} size={13} ref={input => allyCodeInput = input}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            this.props.hideModal();
            this.props.refreshPlayerData(e.target.value, false, null);
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
            this.props.refreshPlayerData(allyCodeInput.value, false, null);
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

  /**
   * Renders a modal stating that pulling unequipped mods using HotUtils will log you out of the game
   */
  fetchUnequippedModal() {
    return <div key={'hotutils-move-mods-modal'}>
      <h2>Fetch your unequipped mods using HotUtils</h2>
      <p>
        This will fetch all of your player data, including unequipped mods by using HotUtils.
        Please note that <strong className={'gold'}>
          this action will log you out of Galaxy of Heroes if you are currently logged in
        </strong>.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <div className={'actions'}>
        <button type={'button'} className={'red'} onClick={this.props.hideModal}>Cancel</button>
        <button type={'button'} onClick={() => {
          this.props.hideModal();
          this.props.refreshPlayerData(
            this.props.allyCode,
            this.props.keepOldMods,
            this.props.profile.hotUtilsSessionId,
            true
          );
        }}>
          Fetch my data
        </button>
      </div>
    </div >;
  }

  /**
   * Renders a help description for pulling unequipped mods with HotUtils
   */
  unequippedModsHelp() {
    return <div className={'help'}>
      <p>
        HotUtils is another tool for SWGOH that allows you to directly modify your game account. One of the advantages
        of being a subscriber to HotUtils is that it can pull all of your mod data, including unequipped mods, at any
        time, and without any cooldown period. Normally, your player and mod data can only be updated once every hour.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <p><a href={'https://www.hotutils.com/'} target={'_blank'} rel={'noopener noreferrer'}>
        https://www.hotutils.com/
      </a></p>
      <p><img className={'fit'} src={'/img/hotsauce512.png'} alt={'hotsauce'} /></p>
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
    version: state.version,
    hotUtilsSubscription: state.hotUtilsSubscription
  };

  if (state.profile) {
    appProps.profile = state.profile;
  }

  return appProps;
};

const mapDispatchToProps = dispatch => ({
  changeSection: newSection => dispatch(changeSection(newSection)),
  refreshPlayerData: (allyCode, keepOldMods, sessionId, useSession = true) =>
    dispatch(refreshPlayerData(allyCode, keepOldMods, sessionId, useSession)),
  setHotUtilsSessionId: (allyCode, sessionId) => dispatch(setHotUtilsSessionId(allyCode, sessionId)),
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
