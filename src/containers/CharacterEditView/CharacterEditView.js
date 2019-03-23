// @flow

import React, {PureComponent} from "react";

import "./CharacterEditView.css";
import CharacterList from "../CharacterList/CharacterList";
import {hideModal, showModal} from "../../state/actions/app";
import Sidebar from "../../components/Sidebar/Sidebar";
import RangeInput from "../../components/RangeInput/RangeInput";
import {
  changeCharacterFilter,
  changeCharacterTarget,
  lockSelectedCharacters,
  resetAllCharacterTargets,
  selectCharacter,
  unlockSelectedCharacters,
  unselectAllCharacters,
  unselectCharacter,
  updateLockUnselectedCharacters,
  updateModChangeThreshold
} from "../../state/actions/characterEdit";
import {changeOptimizerView} from "../../state/actions/review";
import {optimizeMods} from "../../state/actions/optimize";
import characterSettings from "../../constants/characterSettings";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import {GameSettings} from "../../domain/CharacterDataClasses";
import {connect} from "react-redux";

class CharacterEditView extends PureComponent {
  dragStart(character) {
    return function(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', character.baseID);
    }
  }

  static dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  static dragLeave(event) {
    event.preventDefault();
    event.target.classList.remove('drop-character');
  }

  static availableCharactersDragEnter(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  availableCharactersDrop(event) {
    event.preventDefault();
    const movingCharacterID = event.dataTransfer.getData('text/plain');
    this.props.unselectCharacter(movingCharacterID);
  }

  render() {
    return <div className={'character-edit'}>
      <Sidebar content={[this.filterForm(), this.globalSettings(), this.sidebarActions()]}/>
      <div className={'selected-characters'}>
        <h4>
          Selected Characters
          <button className={'small'} onClick={this.props.clearSelectedCharacters}>Clear</button>
          <button className={'small'} onClick={this.props.lockSelectedCharacters}>Lock All</button>
          <button className={'small'} onClick={this.props.unlockSelectedCharacters}>Unlock All</button>
        </h4>
        <CharacterList selfDrop={true} draggable={true}/>
      </div>
      <div className={'available-characters'}
           onDragEnter={CharacterEditView.availableCharactersDragEnter}
           onDragOver={CharacterEditView.dragOver}
           onDragLeave={CharacterEditView.dragLeave}
           onDrop={this.availableCharactersDrop.bind(this)}
      >
        <h3 className={'instructions'}>
          Double-click or drag characters to the selected column to pick who to optimize mods for.
          <button type={'button'}
                  className={'small'}
                  onClick={() => this.props.showModal('instructions', this.instructionsModal())}>
            Show full instructions
          </button>
        </h3>
        {this.props.highlightedCharacters.map(character => this.characterBlock(character, 'active'))}
        {this.props.availableCharacters.map(character => this.characterBlock(character, 'inactive'))}
      </div>
    </div>;
  }

  /**
   * Renders a form for filtering available characters
   *
   * @returns JSX Element
   */
  filterForm() {
    return <div className={'filters'} key={'filterForm'}>
      <div className={'filter-form'}>
        <label htmlFor={'character-filter'}>Search by character name, tag, or common abbreviation:</label>
        <input autoFocus={true} id='character-filter' type='text' defaultValue={this.props.characterFilter}
               onChange={(e) => this.props.changeCharacterFilter(e.target.value.toLowerCase())}
        />
      </div>
    </div>;
  }

  /**
   * Renders the player's global optimizer settings
   *
   * @returns JSX Element
   */
  globalSettings() {
    return <div className={'global-settings'} key={'global-settings'}>
      <h3>Global Settings</h3>
      <div className={'form-row'}>
        <label>Threshold to Change Mods:</label><br/>
        <RangeInput
          min={0}
          max={100}
          step={1}
          isPercent={true}
          editable={true}
          defaultValue={this.props.modChangeThreshold}
          onChange={(threshold) => this.props.updateModChangeThreshold(threshold)}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor={'lock-unselected'}>Lock all unselected characters:</label>
        <input type={'checkbox'}
               defaultChecked={this.props.lockUnselectedCharacters}
               onChange={(event) => this.props.updateLockUnselectedCharacters(event.target.checked)}/>
      </div>
    </div>;
  }

  /**
   * Renders a sidebar box with action buttons
   *
   * @returns JSX Element
   */
  sidebarActions() {
    return <div className={'sidebar-actions'} key={'sidebar-actions'}>
      <h3>Actions</h3>
      <button
        type={'button'}
        onClick={() => {
          const selectedTargets = this.props.selectedCharacters.map(character => character.optimizerSettings.target);
          if (selectedTargets.some(target => null !== target.targetStat)) {
            this.props.showModal('notice', this.optimizeWithTargetsModal());
          } else {
            this.props.optimizeMods();
          }
        }}
        disabled={!this.props.selectedCharacters.length}
      >
        Optimize my mods!
      </button>
      {this.props.showReviewButton ?
        <button type={'button'} onClick={this.props.reviewOldAssignments}>
          Review recommendations
        </button> :
        null
      }
      <button
        type={'button'}
        className={'blue'}
        onClick={() => this.props.showModal('reset-modal', this.resetCharsModal())}
      >
        Reset all targets
      </button>
    </div>
  }

  /**
   * Render a character block for the set of available characters. This includes the character portrait and a button
   * to edit the character's stats
   * @param character Character
   * @param className String A class to apply to each character block
   */
  characterBlock(character, className) {
    return <div
      className={className ? 'character ' + className : 'character'}
      key={character.baseID}
    >
      <div draggable={true} onDragStart={this.dragStart(character)}
           onDoubleClick={() => this.props.selectCharacter(character.baseID)}>
        <CharacterAvatar character={character}/>
      </div>
      <div className={'character-name'}>
        {this.props.gameSettings[character.baseID] ? this.props.gameSettings[character.baseID].name : character.baseID}
      </div>
    </div>;
  }

  /**
   * Render a modal with instructions on how to use the optimizer
   * @returns Array[JSX Element]
   */
  instructionsModal() {
    return <div>
      <h2>How to use the mods optimizer</h2>
      <p>
        Welcome to my mods optimizer for Star Wars: Galaxy of Heroes! This application works on a simple principle:
        every stat should have some set value for a character, and if we know all of those values, then we can
        calculate how much a given mod, or set of mods, is worth for that character. From there, the tool knows how to
        find the set of mods that give the highest possible overall value for each of your characters without you
        needing to look through the hundreds of mods in your inventory!
      </p>
      <h3>Selecting characters to optimize</h3>
      <p>
        The mods optimizer will start out by considering all mods equipped on any character other than those that have
        had "Lock" selected as a target. Then, it will go down the list of selected characters, one by one, choosing the
        best mods it can find for each character, based on the selected target. As it finishes each character, it
        removes those mods from its consideration set. Therefore, the character that you want to have your absolute best
        mods should always be first among your selected characters. Usually, this means that you want the character who
        needs the most speed to be first.
      </p>
      <p>
        I suggest optimizing your arena team first, in order of required speed, then characters you use for raids,
        then characters for other game modes, like Territory Battles, Territory Wars, and events.
      </p>
      <h3>Picking the right values</h3>
      <p>
        Every character in the game has been given starting values for all stats that can be used by the optimizer to
        pick the best mods. These values have been named for their general purpose - hSTR Phase 1, PvP, and PvE, for
        example. Some characters have multiple different targets that you can select from. <strong>These targets, while
        directionally good for characters, are only a base suggestion!</strong> There are many reasons that you might
        want to pick different values than those listed by default in the optimizer: you might want to optimize for a
        different purpose (such as a phase 3 Sith Triumvirate Raid team, where speed can be detrimental), you might
        want to choose something different to optimize against, or you might simply have a better set of values that
        you want to employ.
      </p>
      <p>
        As a starting point, choose a target for each character that matches what you'd like to optimize for. If no
        such target exists, you can select "Custom", or simply hit the "Edit" button to bring up the character edit
        modal. Most characters will have the "basic" mode selected by default. In basic mode, you select a value for all
        stats that is between -100 and 100. These values are weights that are assigned to each stat to determine its
        value for that character. Setting two values as equal means that those stats are about equally important for
        that character. In basic mode, the optimizer will automatically adjust the weights to fit the range of values
        seen in-game for that stat. For example, giving speed and protection both a value of 100 means that 1 speed is
        about equivalent to 200 protection (since you find much more protection on mods than you do speed).
      </p>
      <p>
        If you want more fine-tuned control over the stat values, you can switch to "advanced" mode. In advanced mode,
        the values given are the value for each point of the listed stat. In advanced mode, if speed and protection are
        both given a value of 100, then the tool will never select speed, because it can more easily give that character
        much more protection. I suggest sticking to basic mode until you have a strong sense for how the tool works.
      </p>
      <p>
        I hope that you enjoy the tool! Happy modding!
      </p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>OK</button>
      </div>
    </div>;
  }

  /**
   * Renders an "Are you sure?" modal to reset all characters to their default optimization targets
   *
   * @return JSX Element
   */
  resetCharsModal() {
    return <div>
      <h2>Are you sure you want to reset all characters to defaults?</h2>
      <p>
        This will <strong>not</strong> overwrite any new optimization targets that you've saved, but if you've edited
        any existing targets, or if any new targets have been created that have the same name as one that you've made,
        then it will be overwritten.
      </p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} className={'red'} onClick={() => this.props.resetAllCharacterTargets()}>Reset</button>
      </div>
    </div>
  }

  /**
   * Render the modal content to show a notice before optimizing a list that includes target stats
   * @returns {*}
   */
  optimizeWithTargetsModal() {
    return <div>
      <h2>You have selected characters with target stats</h2>
      <p>
        Using a target stat can be very slow - <strong>up to multiple hours for a single character</strong> - and can
        rapidly drain your battery if you are on a laptop or mobile device. If you want the optimization to go faster,
        there are a few things you can do:
      </p>
      <hr/>
      <ul>
        <li>
          Set very narrow targets for your stats. The narrower the target, the faster the optimizer can rule sets out.
        </li>
        <li>
          Add additional restrictions, like specific sets or primary stats.
        </li>
        <li>
          Set targets that are hard to hit. If only a few sets can even manage to hit a target, the optimizer only needs
          to check those sets.
        </li>
        <li>
          If you've already completed a run for the character with a target stat, don't change their settings or those
          of any characters above them. If the optimizer doesn't think it needs to recalculate the best mod set, it will
          leave the previous recommendation in place.
        </li>
      </ul>
      <hr/>
      <p>Do you want to continue?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => this.props.optimizeMods()}>Optimize!</button>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => {
  const profile = state.profile;
  const availableCharacters = Object.values(profile.characters)
    .filter(character => !profile.selectedCharacters.includes(character.baseID))
    .sort((left, right) => left.compareGP(right));

  /**
   * Checks whether a character matches the filter string in name or tags
   * @param character {Character} The character to check
   * @returns boolean
   */
  const characterFilter = character => {
    const gameSettings = state.gameSettings[character.baseID] ?
      state.gameSettings[character.baseID] :
      new GameSettings(character.baseID, character.baseID);

    return '' === state.characterFilter ||
      gameSettings.name.toLowerCase().includes(state.characterFilter) ||
      gameSettings.tags
        .concat(characterSettings[character.baseID] ? characterSettings[character.baseID].extraTags : [])
        .some(tag => tag.toLowerCase().includes(state.characterFilter))
  };

  return {
    mods: profile.mods,
    modChangeThreshold: profile.globalSettings.modChangeThreshold,
    lockUnselectedCharacters: profile.globalSettings.lockUnselectedCharacters,
    characterFilter: state.characterFilter,
    gameSettings: state.gameSettings,
    highlightedCharacters: availableCharacters.filter(characterFilter),
    availableCharacters: availableCharacters.filter(c => !characterFilter(c)),
    selectedCharacters: profile.selectedCharacters.map(id => profile.characters[id]),
    showReviewButton: profile.modAssignments && Object.keys(profile.modAssignments).length,
  };
};

const mapDispatchToProps = dispatch => ({
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal()),
  changeCharacterFilter: (filter) => dispatch(changeCharacterFilter(filter)),
  reviewOldAssignments: () => dispatch(changeOptimizerView('sets')),
  selectCharacter: (characterID, prevCharacterID) => dispatch(selectCharacter(characterID, prevCharacterID)),
  unselectCharacter: (characterID) => dispatch(unselectCharacter(characterID)),
  clearSelectedCharacters: () => dispatch(unselectAllCharacters()),
  lockSelectedCharacters: () => dispatch(lockSelectedCharacters()),
  unlockSelectedCharacters: () => dispatch(unlockSelectedCharacters()),
  updateLockUnselectedCharacters: (lock) => dispatch(updateLockUnselectedCharacters(lock)),
  changeCharacterTarget: (characterID, target) => dispatch(changeCharacterTarget(characterID, target)),
  resetAllCharacterTargets: () => dispatch(resetAllCharacterTargets()),
  optimizeMods: () => dispatch(optimizeMods()),
  updateModChangeThreshold: (threshold) => dispatch(updateModChangeThreshold(threshold))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterEditView);
