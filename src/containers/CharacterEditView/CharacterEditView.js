// @flow

import React, {PureComponent} from "react";

import "./CharacterEditView.css";
import CharacterList from "../CharacterList/CharacterList";
import {hideModal, showError, showModal} from "../../state/actions/app";
import Sidebar from "../../components/Sidebar/Sidebar";
import RangeInput from "../../components/RangeInput/RangeInput";
import {
  appendTemplate,
  changeCharacterFilter,
  deleteTemplate,
  lockAllCharacters,
  lockSelectedCharacters,
  replaceTemplate,
  resetAllCharacterTargets,
  saveTemplate,
  saveTemplates,
  selectCharacter,
  toggleCharacterLock,
  unlockAllCharacters,
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
import {exportCharacterTemplate, exportCharacterTemplates} from "../../state/actions/storage";
import {saveAs} from "file-saver";
import FileInput from "../../components/FileInput/FileInput";
import OptimizationPlan from "../../domain/OptimizationPlan";

const defaultTemplates = require('../../constants/characterTemplates.json');

class CharacterEditView extends PureComponent {
  dragStart(character) {
    return function(event) {
      event.dataTransfer.dropEffect = 'copy';
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', character.baseID);
    }
  }

  static dragOver(event) {
    event.preventDefault();
  }

  static dragLeave(event) {
    event.preventDefault();
    event.target.classList.remove('drop-character');
  }

  static availableCharactersDragEnter(event) {
    event.preventDefault();
  }

  availableCharactersDrop(event) {
    event.preventDefault();
    switch (event.dataTransfer.effectAllowed) {
      case 'move':
        // This is coming from the selected characters - remove the character from the list
        const characterIndex = +event.dataTransfer.getData('text/plain');
        this.props.unselectCharacter(characterIndex);
        break;
      default:
      // Do nothing
    }
  }

  /**
   * Read a file as input and pass its contents to another function for processing
   * @param fileInput The uploaded file
   * @param handleResult {Function}
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
    return <div className={'character-edit'}>
      <Sidebar content={[this.filterForm(), this.globalSettings(), this.sidebarActions()]}/>
      <div className={'selected-characters'}>
        <h4>
          Selected Characters
          <button className={'small'} onClick={this.props.clearSelectedCharacters}>Clear</button>
          <button className={'small'} onClick={this.props.lockSelectedCharacters}>Lock All</button>
          <button className={'small'} onClick={this.props.unlockSelectedCharacters}>Unlock All</button>
        </h4>
        <h5>
          Character Templates
          <div className={'template-buttons'}>
            <button className={'small'}
                    disabled={!this.props.selectedCharacters.length}
                    onClick={() => this.props.showModal('save-template', this.saveTemplateModal())}>
              Save
            </button>
            <button className={'small'}
                    onClick={() => this.props.showModal('append-template', this.appendTemplateModal())}>
              Append
            </button>
            <button className={'small'}
                    onClick={() => this.props.showModal('replace-template', this.replaceTemplateModal())}>
              Replace
            </button>
            <button className={'small'}
                    disabled={!this.userTemplates().length}
                    onClick={() => this.props.showModal('export-template', this.exportTemplateModal())}>
              Export
            </button>
            <FileInput label={'Load'}
                       className={'small'}
                       handler={(file) => this.readFile(
                         file,
                         (templates) => {
                           const templatesObject = JSON.parse(templates);
                           const templatesDeserialized = templatesObject.map(t => ({
                             name: t.name,
                             selectedCharacters: t.selectedCharacters.map(({id, target}) => ({
                               id: id,
                               target: OptimizationPlan.deserialize(target)
                             }))
                           }));
                           this.props.saveTemplates(templatesDeserialized);
                         }
                       )}
            />
            <button className={'small red'}
                    disabled={!this.userTemplates().length}
                    onClick={() => this.props.showModal('delete-template', this.deleteTemplateModal())}>
              Delete
            </button>
          </div>
        </h5>
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
    </div>
      ;
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
    // TODO: Change review button
    // TODO: Make sure that review doesn't break with old assignments
    return <div className={'sidebar-actions'} key={'sidebar-actions'}>
      <h3>Actions</h3>
      <button
        type={'button'}
        onClick={() => {
          const selectedTargets = this.props.selectedCharacters.map(({target}) => target);
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
      <button type={'button'} className={'blue'} onClick={this.props.lockAllCharacters}>
        Lock all characters
      </button>
      <button type={'button'} className={'blue'} onClick={this.props.unlockAllCharacters}>
        Unlock all characters
      </button>
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
    const isLocked = character.optimizerSettings.isLocked;
    const classAttr = `${isLocked ? 'locked' : ''} ${className} character`;

    return <div
      className={classAttr}
      key={character.baseID}
    >
    <span className={`icon locked ${isLocked ? 'active' : ''}`}
          onClick={() => this.props.toggleCharacterLock(character.baseID)}/>
      <div draggable={true} onDragStart={this.dragStart(character)}
           onDoubleClick={() => this.props.selectCharacter(
             character.baseID,
             character.defaultTarget(),
             this.props.lastSelectedCharacter
           )}>
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
    </div>;
  }

  saveTemplateModal() {
    const isNameUnique = (name) => !this.props.characterTemplates.includes(name);
    let nameInput, saveButton;

    return <div>
      <h3>Please enter a name for this character template</h3>
      <input type={'text'} id={'template-name'} name={'template-name'} ref={input => nameInput = input} autoFocus
             onKeyUp={(e) => {
               if (e.key === 'Enter' && isNameUnique(nameInput.value)) {
                 this.props.saveTemplate(nameInput.value);
               }
               // Don't change the input if the user is trying to select something
               if (window.getSelection().toString() !== '') {
                 return;
               }
               // Don't change the input if the user is hitting the arrow keys
               if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                 return;
               }

               if (!isNameUnique(nameInput.value)) {
                 nameInput.classList.add('invalid');
                 saveButton.disabled = true;
               } else {
                 nameInput.classList.remove('invalid');
                 saveButton.disabled = false;
               }
             }}
      />
      <p className={'error'}>
        That name has already been taken. Please use a different name.
      </p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} ref={button => saveButton = button}
                onClick={() => this.props.saveTemplate(nameInput.value)}>
          Save
        </button>
      </div>
    </div>;
  }

  appendTemplateModal() {
    let templateSelection;
    const userTemplateNames = this.userTemplates();
    const defaultTemplateNames = defaultTemplates.map(({name}) => name);

    userTemplateNames.sort();
    defaultTemplateNames.sort();

    const userTemplateOptions = userTemplateNames
      .map((name, index) => <option key={`user-${index}`} value={name}>{name}</option>);
    const defaultTemplateOptions = defaultTemplateNames
      .map((name, index) => <option key={`default-${index}`} value={name}>{name}</option>);

    return <div>
      <h3>Select a character template to add to your selected characters</h3>
      <select ref={select => templateSelection = select}>
        {userTemplateOptions}
        {userTemplateOptions.length &&
        <option disabled={true} value={''}>------------------------------------------------</option>}
        {defaultTemplateOptions}
      </select>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => this.props.appendTemplate(templateSelection.value)}>Append</button>
      </div>
    </div>;
  }

  replaceTemplateModal() {
    let templateSelection;
    const userTemplateNames = this.userTemplates();
    const defaultTemplateNames = defaultTemplates.map(({name}) => name);

    userTemplateNames.sort();
    defaultTemplateNames.sort();

    const userTemplateOptions = userTemplateNames
      .map((name, index) => <option key={`user-${index}`} value={name}>{name}</option>);
    const defaultTemplateOptions = defaultTemplateNames
      .map((name, index) => <option key={`default-${index}`} value={name}>{name}</option>);

    return <div>
      <h3>Select a character template to replace your selected characters</h3>
      <select ref={select => templateSelection = select}>
        {userTemplateOptions}
        {userTemplateOptions.length &&
        <option disabled={true} value={''}>------------------------------------------------</option>}
        {defaultTemplateOptions}
      </select>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => this.props.replaceTemplate(templateSelection.value)}>Replace</button>
      </div>
    </div>;
  }

  userTemplates() {
    return this.props.characterTemplates.filter(
      templateName => !defaultTemplates.map(({name}) => name).includes(templateName)
    );
  }

  exportTemplateModal() {
    let templateNameInput;

    const templateOptions = this.userTemplates().map(name => <option value={name}>{name}</option>);

    return <div>
      <h3>Please select a character template to export</h3>
      <select ref={select => templateNameInput = select}>
        {templateOptions}
      </select>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'}
                onClick={() =>
                  this.props.exportTemplate(
                    templateNameInput.value,
                    template => {
                      const templateSaveObject = {
                        name: template.name,
                        selectedCharacters: template.selectedCharacters.map(({id, target}) => ({
                          id: id,
                          target: target.serialize()
                        }))
                      };
                      const templateSerialized = JSON.stringify([templateSaveObject]);
                      const userData = new Blob([templateSerialized], {type: 'application/json;charset=utf-8'});
                      saveAs(userData, `modsOptimizerTemplate-${template.name}.json`);
                    }
                  )
                }>
          Export
        </button>
        <button type={'button'}
                onClick={() => this.props.exportAllTemplates(templates => {
                  const templatesSaveObject = templates.map(({name, selectedCharacters}) => ({
                    name: name,
                    selectedCharacters: selectedCharacters.map(({id, target}) => ({id: id, target: target.serialize()}))
                  }));
                  const templatesSerialized = JSON.stringify(templatesSaveObject);
                  const userData = new Blob([templatesSerialized], {type: 'application/json;charset=utf-8'});
                  saveAs(userData, `modsOptimizerTemplates-${(new Date()).toISOString().slice(0, 10)}.json`);
                })}>
          Export All
        </button>
      </div>
    </div>;
  }

  deleteTemplateModal() {
    let templateNameInput;

    const templateOptions = this.userTemplates().map(name => <option value={name}>{name}</option>);

    return <div>
      <h3>Please select a character template to delete</h3>
      <select ref={select => templateNameInput = select}>
        {templateOptions}
      </select>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} className={'red'}
                onClick={() => this.props.deleteTemplate(templateNameInput.value)}>
          Delete
        </button>
      </div>
    </div>;
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
      (['lock', 'locked'].includes(state.characterFilter) && character.optimizerSettings.isLocked) ||
      (['unlock', 'unlocked'].includes(state.characterFilter) && !character.optimizerSettings.isLocked) ||
      (['unlock', 'unlocked'].includes(state.characterFilter) && !character.optimizerSettings.isLocked) ||
      gameSettings.tags
        .concat(characterSettings[character.baseID] ? characterSettings[character.baseID].extraTags : [])
        .some(tag => tag.toLowerCase().includes(state.characterFilter));
  };

  return {
    mods: profile.mods,
    modChangeThreshold: profile.globalSettings.modChangeThreshold,
    lockUnselectedCharacters: profile.globalSettings.lockUnselectedCharacters,
    characterFilter: state.characterFilter,
    gameSettings: state.gameSettings,
    highlightedCharacters: availableCharacters.filter(characterFilter),
    availableCharacters: availableCharacters.filter(c => !characterFilter(c)),
    selectedCharacters: profile.selectedCharacters,
    lastSelectedCharacter: profile.selectedCharacters.length - 1,
    showReviewButton: profile.modAssignments && Object.keys(profile.modAssignments).length,
    characterTemplates: Object.keys(state.characterTemplates)
  };
};

const mapDispatchToProps = dispatch => ({
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal()),
  showError: (error) => dispatch(showError(error)),
  changeCharacterFilter: (filter) => dispatch(changeCharacterFilter(filter)),
  reviewOldAssignments: () => dispatch(changeOptimizerView('sets')),
  selectCharacter: (characterID, target, prevIndex) => dispatch(selectCharacter(characterID, target, prevIndex)),
  unselectCharacter: (characterID) => dispatch(unselectCharacter(characterID)),
  clearSelectedCharacters: () => dispatch(unselectAllCharacters()),
  lockSelectedCharacters: () => dispatch(lockSelectedCharacters()),
  unlockSelectedCharacters: () => dispatch(unlockSelectedCharacters()),
  lockAllCharacters: () => dispatch(lockAllCharacters()),
  unlockAllCharacters: () => dispatch(unlockAllCharacters()),
  toggleCharacterLock: (characterID) => dispatch(toggleCharacterLock(characterID)),
  updateLockUnselectedCharacters: (lock) => dispatch(updateLockUnselectedCharacters(lock)),
  resetAllCharacterTargets: () => dispatch(resetAllCharacterTargets()),
  optimizeMods: () => dispatch(optimizeMods()),
  updateModChangeThreshold: (threshold) => dispatch(updateModChangeThreshold(threshold)),
  saveTemplate: (name) => dispatch(saveTemplate(name)),
  saveTemplates: (templates) => dispatch(saveTemplates(templates)),
  appendTemplate: (templateName) => {
    dispatch(appendTemplate(templateName));
    dispatch(hideModal());
  },
  replaceTemplate: (templateName) => {
    dispatch(replaceTemplate(templateName));
    dispatch(hideModal());
  },
  exportTemplate: (name, callback) => {
    dispatch(exportCharacterTemplate(name, callback));
    dispatch(hideModal());
  },
  exportAllTemplates: (callback) => {
    dispatch(exportCharacterTemplates(callback));
    dispatch(hideModal());
  },
  deleteTemplate: (name) => dispatch(deleteTemplate(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterEditView);
