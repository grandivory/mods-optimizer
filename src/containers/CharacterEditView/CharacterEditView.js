import React from "react";

import "./CharacterEditView.css";
import CharacterList from "../../components/CharacterList/CharacterList";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import OptimizationPlan from "../../domain/OptimizationPlan";
import BaseStats from "../../domain/BaseStats";
import {charDefaults} from "../../constants/characters";
import Modal from "../../components/Modal/Modal";
import RangeInput from "../../components/RangeInput/RangeInput";

class CharacterEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableCharacters': props.availableCharacters,
      'selectedCharacters': props.selectedCharacters,
      'lockedCharacters': props.lockedCharacters,
      'editCharacter': null,
      'instructions': false,
      'filterString': ''
    };

    this.saveState = 'function' === typeof props.saveState ? props.saveState : function() {};
  }

  updateFilter(event){
      const val = event.target.value.toLowerCase();
      this.setState(()=> {return {filterString:val}})
  }

  characterDrop() {
    const me = this;
    return function(targetList, dragTarget, dropTarget) {
      let sourceList;

      if (me.state.selectedCharacters.some(character => dragTarget === character.name)) {
        sourceList = me.state.selectedCharacters;
      } else if (me.state.availableCharacters.some(character => dragTarget === character.name)) {
        sourceList = me.state.availableCharacters;
      } else {
        sourceList = me.state.lockedCharacters;
      }

      // Get the character from the source list
      let [sourceCharacter] = sourceList.splice(sourceList.findIndex((character) => character.name === dragTarget), 1);
      // Put it into the target list
      targetList.splice(targetList.findIndex((character) => character.name === dropTarget) + 1, 0, sourceCharacter);

      me.saveState();

      // Re-render
      me.setState({});
    }
  }

  editCharacter(character) {
    this.setState({
      'editCharacter': character
    });
  }

  saveCharacter(character, form) {
    const baseStats = new BaseStats(
      form.health.valueAsNumber,
      form.protection.valueAsNumber,
      form.physDmg.valueAsNumber,
      form.specDmg.valueAsNumber,
      form.physDmgPct.valueAsNumber / 100,
      form.speed.valueAsNumber,
      form.armor.valueAsNumber,
      form.resistance.valueAsNumber
    );

    const optimizationPlan = new OptimizationPlan(
      form['health-stat'].valueAsNumber,
      form['protection-stat'].valueAsNumber,
      form['speed-stat'].valueAsNumber,
      form['critDmg-stat'].valueAsNumber,
      form['potency-stat'].valueAsNumber,
      form['tenacity-stat'].valueAsNumber,
      form['offense-stat'].valueAsNumber,
      form['critChance-stat'].valueAsNumber,
      form['defense-stat'].valueAsNumber,
      form['accuracy-stat'].valueAsNumber,
      form['critAvoid-stat'].valueAsNumber,
    );

    character.baseStats = baseStats;
    character.optimizationPlan = optimizationPlan;
    character.useOnly5DotMods = form['5dot'].checked;
    this.saveState();

    this.setState({
      'editCharacter': null
    });
  }

  resetDefaults(character, form) {
    const defaults = charDefaults[character.name].optimizationPlan;

    form['health-stat'].value = defaults.health;
    form['protection-stat'].value = defaults.protection;
    form['speed-stat'].value = defaults.speed;
    form['critDmg-stat'].value = defaults.critDmg;
    form['potency-stat'].value = defaults.potency;
    form['tenacity-stat'].value = defaults.tenacity;
    form['offense-stat'].value = defaults.offense;
    form['critChance-stat'].value = defaults.critChance;
    form['defense-stat'].value = defaults.defense;
    form['accuracy-stat'].value = defaults.accuracy;
    form['critAvoid-stat'].value = defaults.critAvoid;
    form['5dot'].checked = charDefaults[character.name].useOnly5DotMods;
  }

  cancelEdit() {
    this.setState({
      'editCharacter': null
    });
  }

  render() {
    const availableCharacters = this.state.availableCharacters.sort((left, right) => {
      if (left.name < right.name) {
        return -1;
      } else if (left.name > right.name) {
        return 1;
      } else {
        return 0;
      }
    });
    const selectedCharacters = this.state.selectedCharacters;
    const lockedCharacters = this.state.lockedCharacters;
    const editCharacter = this.state.editCharacter;

    return (
      <div className={'character-edit'}>
        <h3 className={'instructions'}>
          Drag and Drop characters between the columns to pick who to optimize mods for.
          <button type={'button'} className={'small'} onClick={() => this.setState({'instructions': true})}>
            Show full instructions
          </button>
        </h3>
        <div className={'locked-characters'}>
          <h4>Locked Characters</h4>
          <CharacterList
            selfDrop={true}
            draggable={true}
            characters={lockedCharacters}
            onDrop={this.characterDrop()}
            onEdit={this.editCharacter.bind(this)}
          />
        </div>
        <div className={'available-characters'}>
          <h4>Available Characters</h4>
          <label htmlFor={'character-filter'}>Filter:</label>&nbsp;
          <input autoFocus={true} id='character-filter' type='text' onChange={this.updateFilter.bind(this)}/>
          <CharacterList
            selfDrop={false}
            draggable={true}
            characters={availableCharacters}
            onDrop={this.characterDrop()}
            onEdit={this.editCharacter.bind(this)}
            filterString={this.state.filterString}
          />
        </div>
        <div className={'selected-characters'}>
          <h4>Selected Characters</h4>
          <CharacterList
            selfDrop={true}
            draggable={true}
            characters={selectedCharacters}
            onDrop={this.characterDrop()}
            onEdit={this.editCharacter.bind(this)}
          />
        </div>
        <Modal show={editCharacter} content={this.characterEditModal(editCharacter)}/>
        <Modal show={this.state.instructions} className={'instructions'} content={this.instructionsModal()}/>
      </div>
    );
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

    return <form
      className={'character-edit-form'}
      onSubmit={(e) => {
        e.preventDefault();
        this.saveCharacter.bind(this, character)(e.target);
      }}>
      <div className={'characterView'}>
        <CharacterAvatar name={character.name}/>
        <h2 className={'character-name'}>{character.name}</h2>
      </div>
      <div className={'base-stats'}>
        <h4>
          What are your characters base stats (without any mods equipped)? These are used to calculate the value
          of percent stats on mods.
        </h4>
        <div className={'form-row'}>
          <label htmlFor="health">Health:</label>
          <input type={'number'} id={'health'} name={'health'} defaultValue={character.baseStats.health}/>
        </div>
        <div className={'form-row'}>
          <label htmlFor="protection">Protection:</label>
          <input
            type={'number'}
            id={'protection'}
            name={'protection'}
            defaultValue={character.baseStats.protection}/>
        </div>
        <div className={'form-row'}>
          <label htmlFor="physDmg">Physical Damage:</label>
          <input
            type={'number'}
            id={'physDmg'}
            name={'physDmg'}
            defaultValue={character.baseStats.physDmg}/>
        </div>
        <div className={'form-row'}>
          <label htmlFor="specDmg">Special Damage:</label>
          <input
            type={'number'}
            id={'specDmg'}
            name={'specDmg'}
            defaultValue={character.baseStats.specDmg}/>
        </div>
        <div className={'form-row'}>
          <label htmlFor="physDmgPct">Offense from Physical Damage:</label>
          <RangeInput
            id={'physDmgPct'}
            name={'physDmgPct'}
            defaultValue={character.baseStats.physDmgPercent * 100}
            isPercent={true}
          />
        </div>
        <div className={'form-row'}>
          <label htmlFor="speed">Speed:</label>
          <input type={'number'} id={'speed'} name={'speed'} defaultValue={character.baseStats.speed}/>
        </div>
        <div className={'form-row'}>
          <label htmlFor="armor">Armor:</label>
          <input type={'number'} id={'armor'} name={'armor'} defaultValue={character.baseStats.armor}/>
        </div>
        <div className={'form-row'}>
          <label htmlFor="resistance">Resistance:</label>
          <input
            type={'number'}
            id={'resistance'}
            name={'resistance'}
            defaultValue={character.baseStats.resistance}/>
        </div>
      </div>
      <div className={'optimization-plan'}>
        <h4>
          Give each stat type a value. This will be used to calculate the optimum mods to equip.
        </h4>
        <div className={'form-row'}>
          <label htmlFor="health-stat">Health:</label>
          <RangeInput
            editable={true}
            id={'health-stat'}
            name={'health-stat'}
            defaultValue={character.optimizationPlan.rawHealth}
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
            defaultValue={character.optimizationPlan.rawProtection}
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
            defaultValue={character.optimizationPlan.rawSpeed}
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
            defaultValue={character.optimizationPlan.rawCritChance}
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
            defaultValue={character.optimizationPlan.rawCritDmg}
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
            defaultValue={character.optimizationPlan.rawPotency}
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
            defaultValue={character.optimizationPlan.rawTenacity}
            min={-100}
            max={100}
          />
        </div>
        <div className={'form-row'}>
          <label htmlFor="offense-stat">Offense:</label>
          <RangeInput
            editable={true}
            id={'offense-stat'}
            name={'offense-stat'}
            defaultValue={character.optimizationPlan.rawOffense}
            min={-100}
            max={100}
          />
        </div>
        <div className={'form-row'}>
          <label htmlFor="defense-stat">Defense:</label>
          <RangeInput
            editable={true}
            id={'defense-stat'}
            name={'defense-stat'}
            defaultValue={character.optimizationPlan.rawDefense}
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
            defaultValue={character.optimizationPlan.rawAccuracy}
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
            defaultValue={character.optimizationPlan.rawCritAvoid}
            min={-100}
            max={100}
          />
        </div>
        <div className={'form-row'}>
          <label htmlFor="5dot">Use only 5-dot mods?</label>
          <input
            type={'checkbox'}
            id={'5dot'}
            name={'5dot'}
            defaultChecked={character.useOnly5DotMods}/>
        </div>
      </div>
      <div className={'actions'}>
        <button type={'button'} onClick={(e) => this.resetDefaults.bind(this, character)(e.target.form)}>
          Reset to Defaults
        </button>
        <button type={'button'} onClick={this.cancelEdit.bind(this)}>Cancel</button>
        <button type={'submit'}>Save</button>
      </div>
    </form>;
  }

  /**
   * Render a modal with instructions on how to use the optimizer
   * @returns Array[JSX Element]
   */
  instructionsModal() {
    return [
      <h2>How to use the mods optimizer</h2>,
      <p>
        Welcome to my mods optimizer for Star Wars: Galaxy of Heroes! This application works on a simple principle:
        every stat should have some set value for a character, and if we know all of those values, then we can
        calculate how much a given mod, or set of mods, is worth for that character. From there, the tool knows how to
        find the set of mods that give the highest possible overall value for each of your characters without you
        needing to look through the hundreds of mods in your inventory!
      </p>,
      <h3>Selecting characters to optimize</h3>,
      <p>
        The mods optimizer will start out by considering all mods equipped on any character other than those in the
        "Locked Characters" column. Then, it will go down the list of selected characters, one by one, choosing the
        best mods it can find for each character. As it finishes each character, it removes those mods from its
        consideration set. Therefore, the character that you want to have your absolute best mods should always be
        first among your selected characters. Usually, this means that you want the character who needs the most speed
        to be first.
      </p>,
      <p>
        I suggest optimizing your arena team first, in order of required speed, then characters you use for raids,
        then characters for other game modes, like Territory Battles, Territory Wars, and events.
      </p>,
      <h3>Picking the right values</h3>,
      <p>
        Every character in the game has been given starting values for all stats that can be used by the optimizer to
        pick the best mods. <strong>These values, while directionally good for characters, are only a base suggestion!
      </strong> There are many reasons that you might want to pick different values than those listed by default in
        the optimizer: you might want to optimize for a different purpose (such as a phase 3 Sith Triumvirate Raid
        team, where speed can be detrimental), you might want to choose something different to optimize against, or
        you might simply have a better set of values that you want to employ.
      </p>,
      <p>
        In order to change how each character gets optimized, click the "edit" button at the top right of the
        character block. This will bring up a form with two areas to fill out: the character's base stats and the
        values to give to each stat. The base stats should simply reflect the values for your own characters when they
        have no mods equipped. The default values are accurate for characters at 7* gear level 12 with 3 extra pieces
        equipped. The more accurate you make these values, the more accurate the mods optimizer can be in
        choosing between mods, especially in choosing between percent-based stats and absolute stats.
      </p>,
      <p>
        The stat values can be difficult to tweak in order to get the result that you want. The tool calculates the
        value of a mod or mod set by multiplying the value listed here by the benefit granted by the mod. For example,
        if speed has a value of 100 and a mod gives +6 speed, then the speed stat on that mod contributes 600 to the
        total value of the mod. If looking at a speed set that grants +10% speed, the speed value of 100 is multiplied
        by the total amount of speed the set would give your character. If your character's base speed is 130, then
        the total value of the speed set would be (100 * 130 * .1), or 1300.
      </p>,
      <p>
        Some stats tend to come in much larger numbers than others, e.g. protection. It's possible to have a set of
        mods grant over 50,000 protection to a character, whereas 120 speed would be considered a great set. Because
        of this, the values granted to each stat can vary greatly. Even if protection is worth a lot to a character,
        it might be better to choose a low value like .2 for the protection stat in order for it not to be optimized
        to the detriment of all other stats.
      </p>,
      <p>
        <strong>A good rule of thumb is to assign values based on tradeoffs between stats.</strong> If speed is worth
        100 and you decide that it's worth giving up 1 speed to gain 1000 protection, then protection should have a
        value of .1 (1*100 = .1*1000).
      </p>,
      <p>
        I hope that you enjoy the tool! Happy modding!
      </p>,
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.setState({'instructions': false})}>OK</button>
      </div>
    ];
  }
}

export default CharacterEditView;
