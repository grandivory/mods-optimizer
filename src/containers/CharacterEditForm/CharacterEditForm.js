import {connect} from "react-redux";
import RangeInput from "../../components/RangeInput/RangeInput";
import React, {PureComponent} from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import Toggle from "../../components/Toggle/Toggle";
import OptimizationPlan from "../../domain/OptimizationPlan";
import {hideModal} from "../../state/actions/app";
import {
  changeUse5DotMods,
  deleteTarget,
  finishEditCharacterTarget,
  resetCharacterTargetToDefault,
  unlockCharacter
} from "../../state/actions/characterEdit";

class CharacterEditForm extends PureComponent {
  render() {
    const character = this.props.character;
    const target = this.props.target;

    if (!character) {
      return null;
    }

    const defaultTarget = character.defaultSettings.targets.find(defaultTarget => defaultTarget.name === target.name);

    // Determine whether the current optimization plan is a default (same name exists), user-defined (same name doesn't
    // exist), or custom (name is 'custom') This determines whether to display a "Reset target to default" button, a
    // "Delete target" button, or nothing.
    let resetButton;
    if ('custom' === target.name) {
      resetButton = null;
    } else if (defaultTarget) {
      resetButton = <button type={'button'}
                            id={'reset-button'}
                            disabled={defaultTarget.equals(target)}
                            onClick={() => {
                              this.props.resetCharacterTargetToDefault(character.baseID);
                            }}>
        Reset target to default
      </button>
    } else {
      resetButton = <button type={'button'}
                            id={'delete-button'}
                            className={'red'}
                            onClick={() => this.props.deleteTarget(character.baseID)}>
        Delete target
      </button>
    }

    return <form
      className={`character-edit-form`}
      noValidate={'advanced' === this.props.editMode}
      onSubmit={(e) => {
        e.preventDefault();
        this.saveTarget();
      }}
      ref={form => this.form = form}>
      <div className={'character-view'}>
        <CharacterAvatar character={character}/>
        <h2 className={'character-name'}>{character.gameSettings.name}</h2>
      </div>
      <div id={'character-level-options'}>
        <div className={'form-row'}>
          <label htmlFor="5dot" id={'fivedot-label'}>Use only 5-dot mods?</label>
          <input
            type={'checkbox'}
            id={'5dot'}
            name={'5dot'}
            defaultChecked={character.optimizerSettings.useOnly5DotMods}/>
        </div>
      </div>
      <div className={'instructions'}>
        Give each stat type a value. This will be used to calculate the optimum mods to equip. You can give this plan
        a name to easily select it later.
      </div>
      <div className={'header-row'}>
        <label htmlFor={'plan-name'}>Plan Name: </label>
        <input type={'text'} defaultValue={target.name} id={'plan-name'} name={'plan-name'}/>
      </div>
      <div className={'header-row'}>
        <Toggle
          inputLabel={'Mode'}
          name={'mode'}
          leftLabel={'Basic'}
          leftValue={'basic'}
          rightLabel={'Advanced'}
          rightValue={'advanced'}
          value={this.props.editMode}
          onChange={(newValue) => {
          }} // this.setState({editMode: newValue})}
        />
      </div>
      {'basic' === this.props.editMode && this.basicForm(target)}
      {'advanced' === this.props.editMode && this.advancedForm(target)}
      <div className={'actions'}>
        {resetButton}
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
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
        <label htmlFor={'upgrade-mods'}>Upgrade Mods to level 15:</label>
        <input type={'checkbox'} name={'upgrade-mods'} id={'upgrade-mods'}
               defaultChecked={optimizationPlan.upgradeMods}/>
      </div>
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
        <label htmlFor={'upgrade-mods'}>Upgrade Mods to level 15:</label>
        <input type={'checkbox'} name={'upgrade-mods'} id={'upgrade-mods'}
               defaultChecked={optimizationPlan.upgradeMods}/>
      </div>
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

  saveTarget() {
    const planName = 'lock' !== this.form['plan-name'].value ? this.form['plan-name'].value : 'custom';
    let newTarget;

    if ('advanced' === this.props.editMode) {
      // Advanced form
      newTarget = new OptimizationPlan(
        planName,
        this.form['health-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.health,
        this.form['protection-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.protection,
        this.form['speed-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.speed,
        this.form['critDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.critDmg,
        this.form['potency-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.potency,
        this.form['tenacity-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.tenacity,
        this.form['physDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.physDmg,
        this.form['specDmg-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.specDmg,
        this.form['critChance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.critChance,
        this.form['armor-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.armor,
        this.form['resistance-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.resistance,
        this.form['accuracy-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.accuracy,
        this.form['critAvoid-stat-advanced'].valueAsNumber * OptimizationPlan.statWeight.critAvoid,
        this.form['upgrade-mods'].checked
      );
    } else {
      // Basic form
      newTarget = new OptimizationPlan(
        planName,
        this.form['health-stat'].valueAsNumber,
        this.form['protection-stat'].valueAsNumber,
        this.form['speed-stat'].valueAsNumber,
        this.form['critDmg-stat'].valueAsNumber,
        this.form['potency-stat'].valueAsNumber,
        this.form['tenacity-stat'].valueAsNumber,
        this.form['physDmg-stat'].valueAsNumber,
        this.form['specDmg-stat'].valueAsNumber,
        this.form['critChance-stat'].valueAsNumber,
        this.form['defense-stat'].valueAsNumber / 2,
        this.form['defense-stat'].valueAsNumber / 2,
        this.form['accuracy-stat'].valueAsNumber,
        this.form['critAvoid-stat'].valueAsNumber,
        this.form['upgrade-mods'].checked
      );
    }

    this.props.submitForm(
      this.props.character.baseID,
      newTarget,
      this.form['5dot'].checked
    );
  }
}

const mapStateToProps = (state) => ({
  editMode: state.characterEditMode
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal()),
  submitForm: (characterID, target, use5DotMods) => {
    dispatch(changeUse5DotMods(characterID, use5DotMods));
    dispatch(unlockCharacter(characterID));
    dispatch(finishEditCharacterTarget(characterID, target));
  },
  resetCharacterTargetToDefault: (characterID) => dispatch(resetCharacterTargetToDefault(characterID)),
  deleteTarget: (characterID) => dispatch(deleteTarget(characterID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterEditForm);
