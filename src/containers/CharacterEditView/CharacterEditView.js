// @flow

import React, { PureComponent } from "react";

import "./CharacterEditView.css";
import CharacterList from "../CharacterList/CharacterList";
import { hideModal, showError, showModal } from "../../state/actions/app";
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
  toggleHideSelectedCharacters,
  toggleCharacterEditSortView,
  unlockAllCharacters,
  unlockSelectedCharacters,
  unselectAllCharacters,
  unselectCharacter,
  updateLockUnselectedCharacters,
  updateModChangeThreshold,
  updateForceCompleteModSets,
  updateOmicronBoostsGac,
  updateOmicronBoostsTw,
  updateOmicronBoostsTb,
  updateOmicronBoostsRaids,
  updateOmicronBoostsConquest,
  applyTemplateTargets,
  setOptimizeIndex
} from "../../state/actions/characterEdit";
import { changeOptimizerView, updateModListFilter } from "../../state/actions/review";
import { optimizeMods } from "../../state/actions/optimize";
import characterSettings from "../../constants/characterSettings";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import { GameSettings } from "../../domain/CharacterDataClasses";
import { connect } from "react-redux";
import { exportCharacterTemplate, exportCharacterTemplates } from "../../state/actions/storage";
import { saveAs } from "file-saver";
import FileInput from "../../components/FileInput/FileInput";
import OptimizationPlan from "../../domain/OptimizationPlan";
import Toggle from "../../components/Toggle/Toggle";
import Help from "../../components/Help/Help"
import { fetchCharacterList } from "../../state/actions/data";
import collectByKey from "../../utils/collectByKey";
import keysWhere from "../../utils/keysWhere";
import { Spoiler } from "../../components/Spoiler/Spoiler";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import OptimizerProgress from '../../components/OptimizerProgress/OptimizerProgress';

const defaultTemplates = require('../../constants/characterTemplates.json');

class CharacterEditView extends PureComponent {
  dragStart(character) {
    return function (event) {
      event.dataTransfer.dropEffect = 'copy';
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', character.baseID);
      // We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
      const options = {
        'effect': 'add'
      };
      event.dataTransfer.setData('application/json', JSON.stringify(options));

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
    const options = JSON.parse(event.dataTransfer.getData('application/json'));

    switch (options.effect) {
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
    const classes = this.props.sortView ? 'character-edit sort-view' : 'character-edit';

    return <div className={classes}>
      <Sidebar content={[this.filterForm(), this.globalSettings(), this.sidebarActions()]} />
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
      <div className={'selected-characters'}>
        <h4>
          Selected Characters
          <div className="character-list-actions">
            <button className={'small'} onClick={this.props.clearSelectedCharacters}>Clear</button>
            <button className={'small'} onClick={this.props.lockSelectedCharacters}>Lock All</button>
            <button className={'small'} onClick={this.props.unlockSelectedCharacters}>Unlock All</button>
            <button className={'small'} onClick={this.props.toggleCharacterEditSortView}>
              {this.props.sortView ? 'Normal' : 'Expand'} View
            </button>
            <button
              className={'small'}
              onClick={() => this.props.showModal('generate-character-list', this.generateCharacterListModal())}
            >
              Auto-generate List
            </button>
          </div>
        </h4>
        <h5>Character Templates <Help header={'Character Templates'}>{this.characterTemplatesHelp()}</Help></h5>
        <div className={'template-buttons'}>
          <div className={'row'}>
            Manage:
            <button className={'small'}
              disabled={!this.props.selectedCharacters.length}
              onClick={() => this.props.showModal('save-template', this.saveTemplateModal())}>
              Save
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
                  try {
                    const templatesObject = JSON.parse(templates);
                    const templatesDeserialized = templatesObject.map(t => ({
                      name: t.name,
                      selectedCharacters: t.selectedCharacters.map(({ id, target }) => ({
                        id: id,
                        target: OptimizationPlan.deserialize(target)
                      }))
                    }));
                    this.props.saveTemplates(templatesDeserialized);
                  } catch (e) {
                    throw new Error('Unable to read templates from file. Make sure that you\'ve selected a character templates file');
                  }
                }
              )}
            />
            <button className={'small red'}
              disabled={!this.userTemplates().length}
              onClick={() => this.props.showModal('delete-template', this.deleteTemplateModal())}>
              Delete
            </button>
          </div>
          <div className={'row'}>
            Apply:
            <button className={'small'}
              onClick={() => this.props.showModal('append-template', this.appendTemplateModal())}>
              Append
            </button>
            <button className={'small'}
              onClick={() => this.props.showModal('replace-template', this.replaceTemplateModal())}>
              Replace
            </button>
            <button className={'small'}
              onClick={() => this.props.showModal('template-targets', this.templateTargetsModal())}>
              Apply targets only
            </button>
          </div>
        </div>
        <CharacterList selfDrop={true} draggable={true} />
      </div>
    </div >;
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
        <input autoFocus={true} id={'character-filter'} type={'text'} defaultValue={this.props.characterFilter}
          onChange={(e) => this.props.changeCharacterFilter(e.target.value.toLowerCase())}
        />
        <Toggle
          inputLabel={'Available Characters Display'}
          leftLabel={'Hide Selected'}
          rightLabel={'Show All'}
          leftValue={'hide'}
          rightValue={'show'}
          value={this.props.hideSelectedCharacters ? 'hide' : 'show'}
          onChange={() => this.props.toggleHideSelectedCharacters()}
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
      <h3>Global Settings <Help header={'Global Settings'}>{this.globalSettingsHelp()}</Help></h3>
      <div className={'form-row'}>
        <label htmlFor={'mod-threshold'}>Threshold to Change Mods:</label><br />
        <RangeInput
          min={0}
          max={100}
          id={'mod-threshold'}
          step={1}
          isPercent={true}
          editable={true}
          defaultValue={this.props.globalSettings.modChangeThreshold}
          onChange={(threshold) => this.props.updateModChangeThreshold(threshold)}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor={'lock-unselected'}>Lock all unselected characters:</label>
        <input id={'lock-unselected'} type={'checkbox'}
          defaultChecked={this.props.globalSettings.lockUnselectedCharacters}
          onChange={(event) => this.props.updateLockUnselectedCharacters(event.target.checked)} />
      </div>
      <div className={'form-row'}>
        <label htmlFor={'force-complete-sets'}>Don't break mod sets:</label>
        <input id={'force-complete-sets'} type={'checkbox'}
          defaultChecked={this.props.globalSettings.forceCompleteSets}
          onChange={(event) => this.props.updateForceCompleteModSets(event.target.checked)} />
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
          this.props.resetIncrementalIndex();
          const selectedTargets = this.props.selectedCharacters.map(({ target }) => target);
          const hasTargetStats = selectedTargets.some(target => target.targetStats &&
            target.targetStats.filter(targetStat => targetStat.optimizeForTarget).length)
          const duplicateCharacters = keysWhere(
            collectByKey(this.props.selectedCharacters, ({ id }) => id),
            targets => targets.length > 1);

          const minCharacterIndices = this.props.selectedCharacters.reduce((indices, { id }, charIndex) => ({
            [id]: charIndex,
            ...indices
          }));
          console.log(minCharacterIndices);

          const invalidTargets = this.props.selectedCharacters.filter(({ target }, index) =>
            target.targetStats.find(targetStat => targetStat.relativeCharacterId && minCharacterIndices[targetStat.relativeCharacterId] > index)
          ).map(({ id }) => id)
          console.log(invalidTargets);

          if (invalidTargets.length > 0) {
            this.props.showError([
              <p>You have invalid targets set!</p>,
              <p>For relative targets, the compared character MUST be earlier in the selected characters list.</p>,
              <p>Please fix the following characters:</p>,
              <ul>
                {invalidTargets.map(id => <li>
                  {this.props.gameSettings[id] ? this.props.gameSettings[id].name : id}
                </li>)}
              </ul>
            ]);
          } else if (duplicateCharacters.length > 0 || hasTargetStats) {
            this.props.showModal('notice', this.optimizeWithWarningsModal(duplicateCharacters, hasTargetStats));
          } else {
            this.props.showModal('optimizer-progress', <OptimizerProgress />, false);
            this.props.optimizeMods();
          }
        }}
        disabled={!this.props.selectedCharacters.length}
      >
        Optimize my mods!
      </button>
      {
        this.props.showReviewButton ?
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
    </div >
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
        onClick={() => this.props.toggleCharacterLock(character.baseID)} />
      <div draggable={true} onDragStart={this.dragStart(character)}
        onDoubleClick={() => this.props.selectCharacter(
          character.baseID,
          character.defaultTarget(),
          this.props.lastSelectedCharacter
        )}>
        <CharacterAvatar character={character} />
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
        The mods optimizer will start out by considering all mods equipped on any character other than those that are
        "Locked". Then, it will go down the list of selected characters, one by one, choosing the
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
        The easiest way to get started with the optimizer is to choose from the pre-programmed character
        templates. These are set up with sets of characters and targets that should fit various game modes. If
        there's no template to fit your exact needs, you can use one as a starting point or create one from
        scratch. For each individual character, if no target exists that matches what you want,
        you can select "Custom", or simply hit the "Edit" button to bring up the character edit
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

  generateCharacterListModal() {
    let form;

    return <div>
      <h3 className={'gold'}>Auto-generate Character List</h3>
      <p>
        This utility will auto-generate a character list for you based on your current roster and selected use case.
        This is intended to be an easy starting point, and is by no means the final say in how your characters should be
        ordered or what targets should be chosen.
      </p>
      <p>
        <span className={'purple'}>Note:</span> unless you specify otherwise in "Advanced Settings" below, your current
        arena team will not be placed at the top of the list.
      </p>
      <p><span className={'blue'}>Provided by&nbsp;
        <a href={'https://swgoh.spineless.net/'} target={'_blank'} rel={'noopener noreferrer'}>
          https://swgoh.spineless.net/
        </a>
      </span></p>
      <hr />
      <form ref={(element) => form = element}>
        <label htmlFor={'use-case'}>Select your use case:</label>
        <Dropdown id={'use-case'} name={'use-case'}>
          <option value={''}>GAC / TW / ROTE (default)</option>
          <option value={1}>Light-side Territory Battle</option>
          <option value={2}>Dark-side Territory Battle</option>
          <option value={3}>Arena only</option>
        </Dropdown>
        <div className={`character-list-omicronboosts`}>
          <Spoiler title={'Omicron Boosts'}>
            <div className={'form-row'}>
              <label htmlFor={'omicron-gac'}>Grand Arena:</label>
              <input id={'omicron-gac'} name={'omicron-gac'} type={'checkbox'} 
              defaultChecked={this.props.globalSettings.omicronBoostsGac}
              onChange={(event) => this.props.updateOmicronBoostsGac(event.target.checked)} />
            </div>
            <div className={'form-row'}>
              <label htmlFor={'omicron-tw'}>Territory Wars:</label>
              <input id={'omicron-tw'} name={'omicron-tw'} type={'checkbox'}
              defaultChecked={this.props.globalSettings.omicronBoostsTw}
              onChange={(event) => this.props.updateOmicronBoostsTw(event.target.checked)} />
            </div>
            <div className={'form-row'}>
              <label htmlFor={'omicron-tb'}>Territory Battles:</label>
              <input id={'omicron-tb'} name={'omicron-tb'} type={'checkbox'}
              defaultChecked={this.props.globalSettings.omicronBoostsTb}
              onChange={(event) => this.props.updateOmicronBoostsTb(event.target.checked)} />
            </div>
            <div className={'form-row'}>
              <label htmlFor={'omicron-raids'}>Raids:</label>
              <input id={'omicron-raids'} name={'omicron-raids'} type={'checkbox'}
              defaultChecked={this.props.globalSettings.omicronBoostsRaids}
              onChange={(event) => this.props.updateOmicronBoostsRaids(event.target.checked)} />
            </div>
            <div className={'form-row'}>
              <label htmlFor={'omicron-conquest'}>Conquest:</label>
              <input id={'omicron-conquest'} name={'omicron-conquest'} type={'checkbox'}
              defaultChecked={this.props.globalSettings.omicronBoostsConquest}
              onChange={(event) => this.props.updateOmicronBoostsConquest(event.target.checked)} />
            </div>
          </Spoiler>
        </div>
        <Toggle
          name={'overwrite'}
          inputLabel={'Overwrite existing list?'}
          leftValue={false}
          leftLabel={'Append'}
          rightValue={true}
          rightLabel={'Overwrite'}
        />
        <Spoiler title={'Advanced Settings'}>
          <div className={'form-row'}>
            <label htmlFor={'alignment-filter'}>Alignment:</label>
            <Dropdown id={'alignment-filter'} name={'alignment-filter'} defaultValue={0}>
              <option value={0}>All Characters</option>
              <option value={1}>Light Side Only</option>
              <option value={2}>Dark Side Only</option>
            </Dropdown>
          </div>
          <div className={'form-row'}>
            <label htmlFor={'minimum-gear-level'}>Minimum Gear Level:</label>
            <Dropdown id={'minimum-gear-level'} name={'minimum-gear-level'} defaultValue={1}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
              <option value={13}>13</option>
            </Dropdown>
          </div>
          <div className={'form-row'}>
            <label htmlFor={'ignore-arena'}>Ignore arena teams:</label>
            <input id={'ignore-arena'} name={'ignore-arena'} type={'checkbox'} defaultChecked={true} />
          </div>
          <div className={'form-row'}>
            <label htmlFor={'max-list-size'}>Maximum list size:&nbsp;</label>
            <input id={'max-list-size'} name={'max-list-size'} type={'text'} inputMode={'numeric'} size={3} />
          </div>
        </Spoiler>
      </form>
      <hr />
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button
          type={'button'}
          onClick={() => {
            const parameters = {
              'alignmentFilter': form['alignment-filter'].value,
              'minimumGearLevel': form['minimum-gear-level'].value,
              'ignoreArena': form['ignore-arena'].checked,
              'top': form['max-list-size'].value,
              'omicronGac': form['omicron-gac'].checked,
              'omicronTw': form['omicron-tw'].checked,
              'omicronTb': form['omicron-tb'].checked,
              'omicronRaids': form['omicron-raids'].checked,
              'omicronConquest': form['omicron-conquest'].checked
            }

            this.props.generateCharacterList(
              form['use-case'].value,
              form.overwrite.value,
              this.props.allyCode,
              parameters)
          }}
        >
          Generate
        </button>
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
    return <div>
      <h3>Select a character template to add to your selected characters</h3>
      {this.templateSelectElement(select => templateSelection = select)}
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => this.props.appendTemplate(templateSelection.value)}>Append</button>
      </div>
    </div>;
  }

  replaceTemplateModal() {
    let templateSelection;
    return <div>
      <h3>Select a character template to replace your selected characters</h3>
      {this.templateSelectElement(select => templateSelection = select)}
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => this.props.replaceTemplate(templateSelection.value)}>Replace</button>
      </div>
    </div>;
  }

  templateTargetsModal() {
    let templateSelection;
    return <div>
      <h3>
        Select a character template. The targets used in this template will be
        applied to any characters you already have in your selected list.
      </h3>
      {this.templateSelectElement(select => templateSelection = select)}
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => this.props.applyTemplateTargets(templateSelection.value)}>
          Apply Targets
        </button>
      </div>
    </div>;
  }

  userTemplates() {
    return this.props.characterTemplates.filter(
      templateName => !defaultTemplates.map(({ name }) => name).includes(templateName)
    );
  }

  /**
   * Create a select element for a character template, with user templates at the
   * top, followed by a dashed line, followed by default templates, all sorted by name
   *
   * @param refFunction {Function} A function to get the reference for the select element
   */
  templateSelectElement(refFunction) {
    const userTemplateNames = this.userTemplates();
    const defaultTemplateNames = defaultTemplates.map(({ name }) => name);

    userTemplateNames.sort();
    defaultTemplateNames.sort();

    const userTemplateOptions = userTemplateNames
      .map((name, index) => <option key={`user-${index}`} value={name}>{name}</option>);
    const defaultTemplateOptions = defaultTemplateNames
      .map((name, index) => <option key={`default-${index}`} value={name}>{name}</option>);

    return <Dropdown ref={refFunction}>
      {userTemplateOptions}
      {userTemplateOptions.length &&
        <option disabled={true} value={''}>------------------------------------------------</option>}
      {defaultTemplateOptions}
    </Dropdown>;
  }

  exportTemplateModal() {
    let templateNameInput;

    const templateOptions = this.userTemplates().map(name => <option value={name}>{name}</option>);

    return <div>
      <h3>Please select a character template to export</h3>
      <Dropdown ref={select => templateNameInput = select}>
        {templateOptions}
      </Dropdown>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'}
          onClick={() =>
            this.props.exportTemplate(
              templateNameInput.value,
              template => {
                const templateSaveObject = {
                  name: template.name,
                  selectedCharacters: template.selectedCharacters.map(({ id, target }) => ({
                    id: id,
                    target: target.serialize()
                  }))
                };
                const templateSerialized = JSON.stringify([templateSaveObject]);
                const userData = new Blob([templateSerialized], { type: 'application/json;charset=utf-8' });
                saveAs(userData, `modsOptimizerTemplate-${template.name}.json`);
              }
            )
          }>
          Export
        </button>
        <button type={'button'}
          onClick={() => this.props.exportAllTemplates(templates => {
            const templatesSaveObject = templates.map(({ name, selectedCharacters }) => ({
              name: name,
              selectedCharacters: selectedCharacters.map(({ id, target }) => ({ id: id, target: target.serialize() }))
            }));
            const templatesSerialized = JSON.stringify(templatesSaveObject);
            const userData = new Blob([templatesSerialized], { type: 'application/json;charset=utf-8' });
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
      <Dropdown ref={select => templateNameInput = select}>
        {templateOptions}
      </Dropdown>
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
  optimizeWithWarningsModal(duplicates, hasTargetStats) {
    return <div>
      <h2>Optimizer Warnings</h2>
      <hr />
      {duplicates.length > 0 && <div>
        <h3>You have duplicate characters selected</h3>
        <p>The optimizer can create multiple suggestions for the same character using different targets. However, if you plan to move your mods in-game with HotUtils, then each character should only be included in the list once.</p>
        <p className={'left'}><strong>Duplicated Characters:</strong></p>
        <ul>
          {duplicates.map(characterID =>
            <li>{this.props.gameSettings[characterID] ? this.props.gameSettings[characterID].name : characterID}</li>
          )}
        </ul>
        <hr />
      </div>}
      {hasTargetStats && <div>
        <h3>You have selected characters with target stats</h3>
        <p>
          Using a target stat can be very slow - <strong>up to multiple hours for a single character</strong> - and can
          rapidly drain your battery if you are on a laptop or mobile device. If you want the optimization to go faster,
          there are a few things you can do:
        </p>
        <hr />
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
        <hr />
      </div>
      }
      <p>Do you want to continue?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button type={'button'} onClick={() => {
          this.props.showModal('optimizer-progress', <OptimizerProgress />, false);
          this.props.optimizeMods();
        }}>Optimize!</button>
      </div>
    </div>;
  }

  globalSettingsHelp() {
    return <div className={'help'}>
      <p>
        Global settings are a quick way to make changes that apply to every character during an optimization. They
        always override any character-specific settings that you have set.
      </p>
      <ul>
        <li>
          <strong>Threshold to change mods</strong> - As the optimizer is running, its normal behavior is to always
          recommend the absolute best mod set it can find, based on the target you have selected. If this number is
          above 0, then the optimizer will only recommend that you change mods on a character if the new recommended set
          is at least this much better than what the character previously had, or if the character's mods were moved to
          a character higher in your list and needed to be replaced.
        </li>
        <li>
          <strong>Lock all unselected characters</strong> - If this box is checked, then no mods will be taken from
          characters that aren't in your selected list. If you have a number of unassigned mods, this can be a quick way
          to make use of them without triggering a major remod of your whole roster.
        </li>
        <li>
          <strong>Don't break mod sets</strong> - If this box is checked, the optimizer will try to keep mod sets
          together, so you always get the maximum set bonuses. Sometimes it's not possible to do so, either because
          of other restrictions on a character's target or because you don't have enough mods left to make a full set.
          In these cases, the optimizer will still drop this restriction to try to recommend the best set.
        </li>
      </ul>
    </div>;
  }

  characterTemplatesHelp() {
    return <div className={'help'}>
      <p>
        Character Templates are a way to work with groups of <strong>selected characters</strong> and
        their <strong>targets</strong> independently of the rest of your data. They can be used to set up teams for
        a particular use and shared with your friends, guildmates, or on the Mods Optimizer discord server to quickly
        allow other people to copy your settings. Here is a quick description of the buttons to interact with
        character templates:
      </p>
      <h5>Managing templates</h5>
      <ul>
        <li>
          <strong>Save</strong> - Save your current selected characters and their targets as a new template. You'll be
          asked to give your template a name, which you can then use to apply it or export it later.
        </li>
        <li><strong>Export</strong> - Export one or all of your templates to a file that can be shared with others.</li>
        <li>
          <strong>Load</strong> - Load templates from a file into the optimizer. This won't apply the templates, but
          will instead add them to the list of known templates that you can work with.
        </li>
        <li>
          <strong>Delete</strong> - Delete one of your templates from the optimizer. This only works on templates that
          you have created or loaded from a file. The default templates in the optimizer can't be deleted.
        </li>
      </ul>
      <h5>Applying templates</h5>
      <ul>
        <li><strong>Append</strong> - Add the characters from a template to the end of your selected characters.</li>
        <li><strong>Replace</strong> - Clear your selected characters and replace them with those from a template.</li>
        <li>
          <strong>Apply targets only</strong> - Don't change which characters you have selected or their order, but for
          any that are in a template, change their targets to match.
        </li>
      </ul>
    </div>;
  }
}

const mapStateToProps = (state) => {
  const profile = state.profile;
  const availableCharacters = Object.values(profile.characters)
    .filter(character => character.playerValues.level >= 50)
    .filter(character => !state.hideSelectedCharacters ||
      !profile.selectedCharacters.map(({ id }) => id).includes(character.baseID)
    )
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
      gameSettings.tags
        .concat(characterSettings[character.baseID] ? characterSettings[character.baseID].extraTags : [])
        .some(tag => tag.toLowerCase().includes(state.characterFilter));
  };

  return {
    allyCode: state.allyCode,
    mods: profile.mods,
    globalSettings: profile.globalSettings,
    characterFilter: state.characterFilter,
    hideSelectedCharacters: state.hideSelectedCharacters,
    sortView: state.characterEditSortView,
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
  showModal: (clazz, content, cancelable) => dispatch(showModal(clazz, content, cancelable)),
  hideModal: () => dispatch(hideModal()),
  showError: (error) => dispatch(showError(error)),
  changeCharacterFilter: (filter) => dispatch(changeCharacterFilter(filter)),
  toggleHideSelectedCharacters: () => dispatch(toggleHideSelectedCharacters()),
  toggleCharacterEditSortView: () => dispatch(toggleCharacterEditSortView()),
  reviewOldAssignments: () => {
    dispatch(updateModListFilter({
      view: 'sets',
      sort: 'assignedCharacter'
    }));
    dispatch(changeOptimizerView('review'));
  },
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
  resetIncrementalIndex: () => dispatch(setOptimizeIndex(null)),
  updateModChangeThreshold: (threshold) => dispatch(updateModChangeThreshold(threshold)),
  updateForceCompleteModSets: (forceCompleteModSets) => dispatch(updateForceCompleteModSets(forceCompleteModSets)),
  updateOmicronBoostsGac: (enabled) => dispatch(updateOmicronBoostsGac(enabled)),
  updateOmicronBoostsTw: (enabled) => dispatch(updateOmicronBoostsTw(enabled)),
  updateOmicronBoostsTb: (enabled) => dispatch(updateOmicronBoostsTb(enabled)),
  updateOmicronBoostsRaids: (enabled) => dispatch(updateOmicronBoostsRaids(enabled)),
  updateOmicronBoostsConquest: (enabled) => dispatch(updateOmicronBoostsConquest(enabled)),
  generateCharacterList: (mode, behavior, allyCode, parameters) => {
    dispatch(fetchCharacterList(mode, behavior, allyCode, parameters));
    dispatch(hideModal());
  },
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
  applyTemplateTargets: (templateName) => {
    dispatch(applyTemplateTargets(templateName));
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
