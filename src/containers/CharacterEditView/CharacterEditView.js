import React from "react";

import "./CharacterEditView.css";
import CharacterList from "../../components/CharacterList/CharacterList";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import OptimizationPlan from "../../domain/OptimizationPlan";
import BaseStats from "../../domain/BaseStats";
import {charDefaults} from "../../constants/characters";

class CharacterEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableCharacters': props.availableCharacters,
      'selectedCharacters': props.selectedCharacters,
      'editCharacter': null
    };

    this.saveState = 'function' === typeof props.saveState ? props.saveState : function() {
    };
  }

  characterDrop() {
    const me = this;
    return function(targetList, dragTarget, dropTarget) {
      let sourceList;

      if (me.state.selectedCharacters.some(character => dragTarget === character.name)) {
        sourceList = me.state.selectedCharacters;
      } else {
        sourceList = me.state.availableCharacters;
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
      form['5dot'].checked
    );

    character.baseStats = baseStats;
    character.optimizationPlan = optimizationPlan;
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
    form['5dot'].checked = defaults.useOnly5dotMods;
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
    const editCharacter = this.state.editCharacter;

    return (
      <div className={'character-edit'}>
        <h3 className={'instructions'}>
          Drag and Drop characters between the available and selected columns to pick who to optimize mods for.
        </h3>
        <div className={'available-characters'}>
          <h4>Available Characters</h4>
          <CharacterList
            selfDrop={false}
            draggable={true}
            characters={availableCharacters}
            onDrop={this.characterDrop()}
            onEdit={this.editCharacter.bind(this)}
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
        {editCharacter &&
        <div className={'overlay'}>
          <div className={'modal'}>
            <form
              className={'character-edit-form'}
              onSubmit={(e) => {
                e.preventDefault();
                this.saveCharacter.bind(this, editCharacter)(e.target);
              }}>
              <div className={'characterView'}>
                <CharacterAvatar name={editCharacter.name}/>
                <h2 className={'character-name'}>{editCharacter.name}</h2>
              </div>
              <div className={'base-stats'}>
                <h4>
                  What are your characters base stats (without any mods equipped)? These are used to calculate the value
                  of percent stats on mods.
                </h4>
                <div className={'form-row'}>
                  <label htmlFor="health">Health:</label>
                  <input type={'number'} id={'health'} name={'health'} defaultValue={editCharacter.baseStats.health}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="protection">Protection:</label>
                  <input
                    type={'number'}
                    id={'protection'}
                    name={'protection'}
                    defaultValue={editCharacter.baseStats.protection}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="physDmg">Physical Damage:</label>
                  <input
                    type={'number'}
                    id={'physDmg'}
                    name={'physDmg'}
                    defaultValue={editCharacter.baseStats.physDmg}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="specDmg">Special Damage:</label>
                  <input
                    type={'number'}
                    id={'specDmg'}
                    name={'specDmg'}
                    defaultValue={editCharacter.baseStats.specDmg}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="physDmgPct">Physical Damage Percent of Offense:</label>
                  <input
                    type={'range'}
                    id={'physDmgPct'}
                    name={'physDmgPct'}
                    defaultValue={editCharacter.baseStats.physDmgPercent * 100}
                    onChange={(e) => document.getElementById('physDmgPct-display').value = e.target.value + '%'}
                  />
                  <output id={'physDmgPct-display'} htmlFor="physDmgPct">
                    {editCharacter.baseStats.physDmgPercent * 100}%
                  </output>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="speed">Speed:</label>
                  <input type={'number'} id={'speed'} name={'speed'} defaultValue={editCharacter.baseStats.speed}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="armor">Armor:</label>
                  <input type={'number'} id={'armor'} name={'armor'} defaultValue={editCharacter.baseStats.armor}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="resistance">Resistance:</label>
                  <input
                    type={'number'}
                    id={'resistance'}
                    name={'resistance'}
                    defaultValue={editCharacter.baseStats.resistance}/>
                </div>
              </div>
              <div className={'optimization-plan'}>
                <h4>
                  Give each stat type a value. This will be used to calculate the optimum mods to equip.
                </h4>
                <div className={'form-row'}>
                  <label htmlFor="health-stat">Health:</label>
                  <input
                    type={'number'}
                    step={.01}
                    id={'health-stat'}
                    name={'health-stat'}
                    defaultValue={editCharacter.optimizationPlan.health}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="protection-stat">Protection:</label>
                  <input
                    type={'number'}
                    step={.01}
                    id={'protection-stat'}
                    name={'protection-stat'}
                    defaultValue={editCharacter.optimizationPlan.protection}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="speed-stat">Speed:</label>
                  <input
                    type={'number'}
                    id={'speed-stat'}
                    name={'speed-stat'}
                    defaultValue={editCharacter.optimizationPlan.speed}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="critChance-stat">Critical Chance %:</label>
                  <input
                    type={'number'}
                    id={'critChance-stat'}
                    name={'critChance-stat'}
                    defaultValue={editCharacter.optimizationPlan.critChance}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="critDmg-stat">Critical Damage %:</label>
                  <input
                    type={'number'}
                    id={'critDmg-stat'}
                    name={'critDmg-stat'}
                    defaultValue={editCharacter.optimizationPlan.critDmg}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="potency-stat">Potency %:</label>
                  <input
                    type={'number'}
                    id={'potency-stat'}
                    name={'potency-stat'}
                    defaultValue={editCharacter.optimizationPlan.potency}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="tenacity-stat">Tenacity %:</label>
                  <input
                    type={'number'}
                    id={'tenacity-stat'}
                    name={'tenacity-stat'}
                    defaultValue={editCharacter.optimizationPlan.tenacity}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="offense-stat">Offense:</label>
                  <input
                    type={'number'}
                    id={'offense-stat'}
                    name={'offense-stat'}
                    defaultValue={editCharacter.optimizationPlan.offense}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="defense-stat">Defense:</label>
                  <input
                    type={'number'}
                    id={'defense-stat'}
                    name={'defense-stat'}
                    defaultValue={editCharacter.optimizationPlan.defense}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="accuracy-stat">Accuracy:</label>
                  <input
                    type={'number'}
                    id={'accuracy-stat'}
                    name={'accuracy-stat'}
                    defaultValue={editCharacter.optimizationPlan.accuracy}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="critAvoid-stat">Critical Avoidance:</label>
                  <input
                    type={'number'}
                    id={'critAvoid-stat'}
                    name={'critAvoid-stat'}
                    defaultValue={editCharacter.optimizationPlan.critAvoid}/>
                </div>
                <div className={'form-row'}>
                  <label htmlFor="5dot">Use only 5-dot mods?</label>
                  <input
                    type={'checkbox'}
                    id={'5dot'}
                    name={'5dot'}
                    defaultChecked={editCharacter.optimizationPlan.useOnly5dotMods}/>
                </div>
              </div>
              <div className={'actions'}>
                <button type={'button'} onClick={(e) => this.resetDefaults.bind(this, editCharacter)(e.target.form)}>
                  Reset to Defaults
                </button>
                <button type={'button'} onClick={this.cancelEdit.bind(this)}>Cancel</button>
                <button type={'submit'}>Save</button>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default CharacterEditView;
