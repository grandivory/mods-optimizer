import React from "react";

import "./CharacterEditView.css";
import CharacterList from "../../components/CharacterList/CharacterList";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import OptimizationPlan from "../../domain/OptimizationPlan";
import Modal from "../../components/Modal/Modal";
import RangeInput from "../../components/RangeInput/RangeInput";
import Toggle from "../../components/Toggle/Toggle";
import {characters, charDefaults} from "../../constants/characters";
import Character from "../../domain/Character";

class CharacterEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableCharacters': props.availableCharacters,
      'selectedCharacters': props.selectedCharacters,
      'editCharacter': null,
      'selectedTarget': null,
      'instructions': false,
      'filterString': ''
    };

    this.saveState = 'function' === typeof props.saveState ? props.saveState : function() {};
  }

  dragStart(character) {
    return function(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', character.name);
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
    const movingCharacterName = event.dataTransfer.getData('text/plain');
    let availableCharacters = this.state.availableCharacters;
    let selectedCharacters = this.state.selectedCharacters;
    const sourceCharacterIndex = selectedCharacters.findIndex(c => c.name === movingCharacterName)
    if (-1 === sourceCharacterIndex) {
      return;
    }

    if (!this.state.availableCharacters.some(c => c.name === movingCharacterName)) {
      availableCharacters.push(selectedCharacters[sourceCharacterIndex]);
    }
    selectedCharacters.splice(sourceCharacterIndex, 1);

    this.saveState();

    this.setState({
      availableCharacters: availableCharacters,
      selectedCharacters: selectedCharacters
    });
  }

  characterDrop() {
    const me = this;
    return function(targetList, dragTarget, dropTarget) {
      let sourceList;

      // Do nothing if a character is dropped on itself
      if (dragTarget === dropTarget) {
        return;
      }

      if (me.state.selectedCharacters.some(character => dragTarget === character.name)) {
        sourceList = me.state.selectedCharacters;
      } else if (me.state.availableCharacters.some(character => dragTarget === character.name)) {
        sourceList = me.state.availableCharacters;
      }

      // Get the character from the source list
      let [sourceCharacter] = sourceList.splice(sourceList.findIndex((character) => character.name === dragTarget), 1);
      // Put it into the target list
      const targetIndex = targetList.findIndex((character) => character.name === dropTarget) + 1 || targetList.length;
      targetList.splice(targetIndex, 0, sourceCharacter);

      me.saveState();

      // Re-render
      me.setState({});
    }
  }

  /**
   * Move a character from availableCharacters to the bottom of the selectedCharacters
   * @param character
   */
  selectCharacter(character) {
    const availableCharacters = this.state.availableCharacters;
    const selectedCharacters = this.state.selectedCharacters;

    if (availableCharacters.includes(character)) {
      availableCharacters.splice(availableCharacters.indexOf(character), 1);
      selectedCharacters.push(character);

      this.saveState();

      this.setState({
        availableCharacters: availableCharacters,
        selectedCharacters: selectedCharacters
      });
    }
  }

  /**
   * Move a character from selectedCharacters back to availableCharacters
   * @param character Character
   */
  unselectCharacter(character) {
    const availableCharacters = this.state.availableCharacters;
    const selectedCharacters = this.state.selectedCharacters;

    if (selectedCharacters.includes(character)) {
      selectedCharacters.splice(selectedCharacters.indexOf(character), 1);
      availableCharacters.push(character);

      this.saveState();

      this.setState({
        availableCharacters: availableCharacters,
        selectedCharacters: selectedCharacters
      });
    }
  }

  /**
   * Open up the modal for editing a character's optimization target
   *
   * @param character Character
   * @param planName String The name of the optimization plan to edit
   */
  editCharacter(character, planName) {
    this.setState({
      editCharacter: character,
      selectedTarget: planName,
      editMode: character.optimizationPlan.isBasic() ? 'basic' : 'advanced'
    })
  }

  saveOptimizationPlan(character, form) {
    const planName = form['plan-name'].value;
    let optimizationPlan;

    if (form.mode.checked) {
      // Advanced form
      optimizationPlan = new OptimizationPlan(
        planName,
        form['health-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.health,
        form['protection-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.protection,
        form['speed-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.speed,
        form['critDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.critDmg,
        form['potency-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.potency,
        form['tenacity-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.tenacity,
        form['physDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.physDmg,
        form['specDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.specDmg,
        form['critChance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.critChance,
        form['armor-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.armor,
        form['resistance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.resistance,
        form['accuracy-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.accuracy,
        form['critAvoid-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.critAvoid,
      );
    } else {
      // Basic form
      optimizationPlan = new OptimizationPlan(
        planName,
        form['health-stat'].valueAsNumber,
        form['protection-stat'].valueAsNumber,
        form['speed-stat'].valueAsNumber,
        form['critDmg-stat'].valueAsNumber,
        form['potency-stat'].valueAsNumber,
        form['tenacity-stat'].valueAsNumber,
        form['physDmg-stat'].valueAsNumber,
        form['specDmg-stat'].valueAsNumber,
        form['critChance-stat'].valueAsNumber,
        form['defense-stat'].valueAsNumber / 2,
        form['defense-stat'].valueAsNumber / 2,
        form['accuracy-stat'].valueAsNumber,
        form['critAvoid-stat'].valueAsNumber,
      );
    }

    if ('custom' !== planName && 'lock' !== planName) {
      character.namedPlans[planName] = optimizationPlan;
      character.optimizationPlan = character.namedPlans[planName];
    } else {
      character.optimizationPlan = optimizationPlan;
    }
    character.useOnly5DotMods = form['5dot'].checked;

    this.saveState();

    this.setState({
      'editCharacter': null
    });
  }

  /**
   * Reset any named optimization targets to their default values for all characters
   */
  resetAllCharacters() {
    Object.values(characters).forEach(character => {
      const characterDefault = charDefaults[character.baseID];
      if (!characterDefault) {
        return;
      }

      character.namedPlans = Object.assign(character.namedPlans, characterDefault.namedPlans);

      // If the character had one of the default plans selected, update the selected plan to match the newly-reset value
      if (Object.keys(characterDefault.namedPlans).includes(character.optimizationPlan.name)) {
        character.optimizationPlan = characterDefault.namedPlans[character.optimizationPlan.name];
      }
    });

    this.saveState();
    this.setState({
      resetCharsModal: false
    });
  }

  render() {
    const availableCharacters = this.state.availableCharacters.sort((left, right) => {
      return left.compareGP(right);
    });
    const selectedCharacters = this.state.selectedCharacters;
    const editCharacter = this.state.editCharacter;

    const characterFilter = character =>
      '' === this.state.filterString || character.matchesFilter(this.state.filterString);

    const filteredCharacters = availableCharacters.filter(characterFilter);
    const unfilteredCharacters = availableCharacters.filter((c) => !characterFilter(c));

    return <div className={'character-edit'}>
      <div className={'sidebar'}>
        {this.filterForm()}
        {this.sidebarActions()}
      </div>
      <div className={'selected-characters'}>
        <h4>Selected Characters</h4>
        <CharacterList
          selfDrop={true}
          draggable={true}
          characters={selectedCharacters}
          onDrop={this.characterDrop()}
          onDoubleClick={this.unselectCharacter.bind(this)}
          onEdit={(character, planName) => this.editCharacter(character, planName)}
          saveState={this.saveState}
        />
      </div>
      <div className={'available-characters'}
           onDragEnter={CharacterEditView.availableCharactersDragEnter}
           onDragOver={CharacterEditView.dragOver}
           onDragLeave={CharacterEditView.dragLeave}
           onDrop={this.availableCharactersDrop.bind(this)}
      >
        <h3 className={'instructions'}>
          Double-click or drag characters to the selected column to pick who to optimize mods for.
          <button type={'button'} className={'small'} onClick={() => this.setState({'instructions': true})}>
            Show full instructions
          </button>
        </h3>
        {filteredCharacters.map(character => this.characterBlock(character, 'active'))}
        {unfilteredCharacters.map(character => this.characterBlock(character, 'inactive'))}
      </div>
      <Modal show={editCharacter} content={this.characterEditModal(editCharacter)}/>
      <Modal show={this.state.instructions} className={'instructions'} content={this.instructionsModal()}/>
      <Modal show={this.state.resetCharsModal} className={'reset-modal'} content={this.resetCharsModal()}/>
    </div>;
  }

  /**
   * Renders a form for filtering available characters
   *
   * @returns JSX Element
   */
  filterForm() {
    return <div className={'filters'}>
      <div className={'filter-form'}>
        <label htmlFor={'character-filter'}>Search by character name, tag, or common abbreviation:</label>
        <input autoFocus={true} id='character-filter' type='text'
               onChange={(e) => this.setState({filterString: e.target.value.toLowerCase()})}
        />
      </div>
    </div>;
  }

  /**
   * Renders a sidebar box with action buttons
   *
   * @returns JSX Element
   */
  sidebarActions() {
    return <div className={'sidebar-actions'}>
      <h3>Actions</h3>
      <button
        type={'button'}
        onClick={this.props.onOptimize}
        disabled={this.state.selectedCharacters.length === 0}
      >
        Optimize my mods!
      </button>
      <button
        type={'button'}
        className={'blue'}
        onClick={() => this.setState({resetCharsModal: true})}
      >
        Reset all characters
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
      key={character.name}
    >
      <div draggable={true} onDragStart={this.dragStart(character)}
           onDoubleClick={() => this.selectCharacter(character)}>
        <CharacterAvatar character={character}/>
      </div>
      <div className={'character-name'}>{character.name}</div>
    </div>;
  }

  /**
   * Render a modal for editing a character's base stats and optimization plan
   * @param character Character
   * @returns JSX Element
   */
  characterEditModal(character) {
    if (!character) {
      return null;
    }

    const defaultChar = charDefaults[character.baseID] || Character.defaultCharacter(character.name);

    let resetButton;

    // Determine whether the current optimization plan is a default (same name exists), user-defined (same name doesn't
    // exist), or custom (name is 'custom') This determines whether to display a "Reset target to default" button, a
    // "Delete target" button, or nothing.
    if ('custom' === this.state.selectedTarget) {
      resetButton = null;
    } else if (Object.keys(defaultChar.namedPlans).includes(this.state.selectedTarget)) {
      resetButton = <button
        type={'button'}
        id={'reset-button'}
        disabled={defaultChar.namedPlans[this.state.selectedTarget].equals(character.optimizationPlan)}
        onClick={() => {
          character.optimizationPlan = defaultChar.namedPlans[this.state.selectedTarget];
          character.namedPlans[this.state.selectedTarget] = character.optimizationPlan;
          this.setState({
            editCharacter: null
          });
        }}>
        Reset target to default
      </button>
    } else {
      resetButton = <button type={'button'}
                            id={'delete-button'}
                            className={'red'}
                            onClick={() => {
                              delete character.namedPlans[this.state.selectedTarget];
                              this.setState({
                                editCharacter: null
                              });
                            }}>
        Delete target
      </button>
    }

    return <form
      className={`character-edit-form`}
      noValidate={'advanced' === this.state.editMode}
      onSubmit={(e) => {
        e.preventDefault();
        this.saveOptimizationPlan.bind(this, character)(e.target);
      }}>
      <div className={'character-view'}>
        <CharacterAvatar character={character}/>
        <h2 className={'character-name'}>{character.name}</h2>
      </div>
      <div id={'character-level-options'}>
        <div className={'form-row'}>
          <label htmlFor="5dot" id={'fivedot-label'}>Use only 5-dot mods?</label>
          <input
            type={'checkbox'}
            id={'5dot'}
            name={'5dot'}
            defaultChecked={character.useOnly5DotMods}/>
        </div>
      </div>
      <div className={'instructions'}>
        Give each stat type a value. This will be used to calculate the optimum mods to equip. You can give this plan
        a name to easily select it later.
      </div>
      <div className={'header-row'}>
        <label htmlFor={'plan-name'}>Plan Name: </label>
        <input type={'text'} defaultValue={this.state.selectedTarget} id={'plan-name'} name={'plan-name'}/>
      </div>
      <div className={'header-row'}>
        <Toggle
          inputLabel={'Mode'}
          name={'mode'}
          leftLabel={'Basic'}
          leftValue={'basic'}
          rightLabel={'Advanced'}
          rightValue={'advanced'}
          value={this.state.editMode}
          onChange={(newValue) => this.setState({editMode: newValue})}
        />
      </div>
      {'basic' === this.state.editMode && this.basicForm(character.optimizationPlan)}
      {'advanced' === this.state.editMode && this.advancedForm(character.optimizationPlan)}
      <div className={'actions'}>
        {resetButton}
        <button type={'button'} onClick={() => this.setState({editCharacter: null})}>Cancel</button>
        <button type={'submit'}>Save</button>
      </div>
    </form>;
  }

  /**
   * Renders a form for stat weights that uses range inputs between -100 and 100
   *
   * @param optimizationPlan OptimizationPlan The OptimizationPlan that contains the default values to display
   */
  basicForm(optimizationPlan) {
    return <div id={'basic-form'}>
      <div className={'form-row'}>
        <label htmlFor="health-stat">Health:</label>
        <RangeInput
          editable={true}
          id={'health-stat'}
          name={'health-stat'}
          defaultValue={optimizationPlan.rawHealth}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="protection-stat">Protection:</label>
        <RangeInput
          editable={true}
          id={'protection-stat'}
          name={'protection-stat'}
          defaultValue={optimizationPlan.rawProtection}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="speed-stat">Speed:</label>
        <RangeInput
          editable={true}
          id={'speed-stat'}
          name={'speed-stat'}
          defaultValue={optimizationPlan.rawSpeed}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critChance-stat">Critical Chance %:</label>
        <RangeInput
          editable={true}
          id={'critChance-stat'}
          name={'critChance-stat'}
          defaultValue={optimizationPlan.rawCritChance}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critDmg-stat">Critical Damage %:</label>
        <RangeInput
          editable={true}
          id={'critDmg-stat'}
          name={'critDmg-stat'}
          defaultValue={optimizationPlan.rawCritDmg}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="potency-stat">Potency %:</label>
        <RangeInput
          editable={true}
          id={'potency-stat'}
          name={'potency-stat'}
          defaultValue={optimizationPlan.rawPotency}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="tenacity-stat">Tenacity %:</label>
        <RangeInput
          editable={true}
          id={'tenacity-stat'}
          name={'tenacity-stat'}
          defaultValue={optimizationPlan.rawTenacity}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="physDmg-stat">Physical Damage:</label>
        <RangeInput
          editable={true}
          id={'physDmg-stat'}
          name={'physDmg-stat'}
          defaultValue={optimizationPlan.rawPhysDmg}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="specDmg-stat">Special Damage:</label>
        <RangeInput
          editable={true}
          id={'specDmg-stat'}
          name={'specDmg-stat'}
          defaultValue={optimizationPlan.rawSpecDmg}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor={'defense-stat'}>Defense:</label>
        <RangeInput
          editable={true}
          id={'defense-stat'}
          name={'defense-stat'}
          defaultValue={optimizationPlan.rawArmor + optimizationPlan.rawResistance}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="accuracy-stat">Accuracy:</label>
        <RangeInput
          editable={true}
          id={'accuracy-stat'}
          name={'accuracy-stat'}
          defaultValue={optimizationPlan.rawAccuracy}
          min={-100}
          max={100}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critAvoid-stat">Critical Avoidance:</label>
        <RangeInput
          editable={true}
          id={'critAvoid-stat'}
          name={'critAvoid-stat'}
          defaultValue={optimizationPlan.rawCritAvoid}
          min={-100}
          max={100}
        />
      </div>
    </div>;
  }

  /**
   * Renders a form for stat weights that allows for granular control over weights
   *
   * @param optimizationPlan OptimizationPlan The OptimizationPlan that contains the default values to display
   */
  advancedForm(optimizationPlan) {
    return <div id={'advanced-form'}>
      <div className={'form-row'}>
        <label htmlFor="health-stat-advanced">Health:</label>
        <input
          id={'health-stat-advanced'}
          name={'health-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.health}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="protection-stat-advanced">Protection:</label>
        <input
          id={'protection-stat-advanced'}
          name={'protection-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.protection}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="speed-stat-advanced">Speed:</label>
        <input
          id={'speed-stat-advanced'}
          name={'speed-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.speed}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critChance-stat-advanced">Critical Chance %:</label>
        <input
          id={'critChance-stat-advanced'}
          name={'critChance-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.critChance}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critDmg-stat-advanced">Critical Damage %:</label>
        <input
          id={'critDmg-stat-advanced'}
          name={'critDmg-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.critDmg}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="potency-stat-advanced">Potency %:</label>
        <input
          id={'potency-stat-advanced'}
          name={'potency-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.potency}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="tenacity-stat-advanced">Tenacity %:</label>
        <input
          id={'tenacity-stat-advanced'}
          name={'tenacity-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.tenacity}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="physDmg-stat-advanced">Physical Damage:</label>
        <input
          id={'physDmg-stat-advanced'}
          name={'physDmg-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.physDmg}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="specDmg-stat-advanced">Special Damage:</label>
        <input
          id={'specDmg-stat-advanced'}
          name={'specDmg-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.specDmg}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="armor-stat-advanced">Armor:</label>
        <input
          id={'armor-stat-advanced'}
          name={'armor-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.armor}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="resistance-stat-advanced">Resistance:</label>
        <input
          id={'resistance-stat-advanced'}
          name={'resistance-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.resistance}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="accuracy-stat-advanced">Accuracy:</label>
        <input
          id={'accuracy-stat-advanced'}
          name={'accuracy-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.accuracy}
        />
      </div>
      <div className={'form-row'}>
        <label htmlFor="critAvoid-stat-advanced">Critical Avoidance:</label>
        <input
          id={'critAvoid-stat-advanced'}
          name={'critAvoid-stat-advanced'}
          type={'number'}
          step={.01}
          defaultValue={optimizationPlan.critAvoid}
        />
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
        <button type={'button'} onClick={() => this.setState({'instructions': false})}>OK</button>
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
        <button type={'button'} onClick={() => this.setState({resetCharsModal: false})}>Cancel</button>
        <button type={'button'} className={'red'} onClick={this.resetAllCharacters.bind(this)}>Reset</button>
      </div>
    </div>
  }
}

export default CharacterEditView;
