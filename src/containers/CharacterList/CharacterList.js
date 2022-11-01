// @flow

import React, { PureComponent } from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import "./CharacterList.css";
import { connect } from "react-redux";
import groupByKey from "../../utils/groupByKey";
import CharacterEditForm from "../../containers/CharacterEditForm/CharacterEditForm";
import { showModal } from "../../state/actions/app";
import {
  changeCharacterTarget,
  lockCharacter, moveSelectedCharacter,
  selectCharacter, toggleCharacterLock,
  unselectCharacter, toggleSliceMods,
  toggleUpgradeMods, changeMinimumModDots, setOptimizeIndex
} from "../../state/actions/characterEdit";
import characterSettings from "../../constants/characterSettings";
import { Dropdown } from "../../components/Dropdown/Dropdown";

class CharacterList extends PureComponent {
  characterBlockDragStart(index) {
    return function (event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index);
      // We shouldn't have to do this, but Safari is ignoring both 'dropEffect' and 'effectAllowed' on drop
      const options = {
        'effect': 'move'
      };
      event.dataTransfer.setData('application/json', JSON.stringify(options));
    };
  }

  characterBlockDragEnter() {
    return function (event) {
      event.preventDefault();

      event.target.classList.add('drop-character');
    }
  }

  characterBlockDragOver() {
    return function (event) {
      event.preventDefault();
    }
  }

  characterBlockDragLeave() {
    return function (event) {
      event.preventDefault();
      event.target.classList.remove('drop-character');
    }
  }

  /**
   * @param dropCharacterIndex string The index of the character on which the drop is occurring
   * @returns {Function}
   */
  characterBlockDrop(dropCharacterIndex) {
    const selectCharacter = this.props.selectCharacter;
    const moveCharacter = this.props.moveCharacter;
    const characters = this.props.characters;

    return function (event) {
      event.preventDefault();
      event.stopPropagation();
      const options = JSON.parse(event.dataTransfer.getData('application/json'));

      switch (options.effect) {
        case 'add':
          const movingCharacterID = event.dataTransfer.getData('text/plain');
          const movingCharacter = characters[movingCharacterID];
          selectCharacter(movingCharacterID, movingCharacter.defaultTarget(), dropCharacterIndex);
          break;
        case 'move':
          const movingCharacterIndex = +event.dataTransfer.getData('text/plain');
          moveCharacter(movingCharacterIndex, dropCharacterIndex);
          break;
        default:
        // Do nothing
      }

      event.target.classList.remove('drop-character');
    }
  }

  renderCharacterBlock(character, target, index) {
    const defaultTargets = characterSettings[character.baseID] ?
      groupByKey(characterSettings[character.baseID].targets, target => target.name) :
      {};
    const draggable = this.props.draggable;

    const selectedPlan = target.name;
    const options = character.targets()
      .filter(target => 'custom' !== target.name)
      .map(target => {
        const targetName = target.name;
        const changeIndicator = Object.keys(defaultTargets).includes(targetName) &&
          character.optimizerSettings.targets.map(target => target.name).includes(targetName) &&
          !defaultTargets[targetName].equals(
            character.optimizerSettings.targets.find(target => target.name === targetName)
          ) ? '*' : '';

        const targetDescription = target.priorityDescription();

        return <option value={targetName} key={targetName} title={targetDescription}>
          {changeIndicator}{targetName}
        </option>;
      })

    const onSelect = function (e) {
      const optimizationTarget = e.target.value;

      // Don't change the select value unless we explicitly do so through a state change
      e.target.value = target.name;

      if ('custom' === optimizationTarget) {
        this.showEditCharacterModal(character, index, target.rename('custom'));
      } else if ('lock' === optimizationTarget) {
        this.props.lockCharacter(character.baseID);
      } else {
        this.props.changeCharacterTarget(
          index,
          character.targets().find(target => target.name === optimizationTarget)
        );
      }
    };

    const baseClass = `character-block ${character.baseID}`;

    return <div className={'character-block-wrapper'}
      key={index}
      onDragEnter={this.characterBlockDragEnter()}
      onDragOver={this.characterBlockDragOver()}
      onDragLeave={this.characterBlockDragLeave()}
      onDrop={this.characterBlockDrop(index)}
      onDoubleClick={() => this.props.unselectCharacter(index)}>
      <div className={character.optimizerSettings.isLocked ? `${baseClass} locked` : baseClass}
        draggable={draggable}
        onDragStart={this.characterBlockDragStart(index)}>
        {this.renderCharacterIcons(character, target, index)}
        <CharacterAvatar character={character} />
        <div className={'character-name'}>
          {this.props.gameSettings[character.baseID] ?
            this.props.gameSettings[character.baseID].name :
            character.baseID}
        </div>
        <div className={'target'}>
          <label>Target:</label>
          <Dropdown value={selectedPlan} onChange={onSelect.bind(this)} title={target.priorityDescription()}>
            {options}
            <option value={'custom'}>Custom</option>
          </Dropdown>
          <button
            type={'button'}
            onClick={() => this.showEditCharacterModal(character, index, target)}>
            Edit
          </button>
        </div>
      </div>
    </div>;
  }

  /**
   * Renders the set of 10 icons that show the state of a selected character
   * @param character {Character}
   * @param target {OptimizationPlan}
   */
  renderCharacterIcons(character, target, characterIndex) {
    const defaultTargets = characterSettings[character.baseID] ?
      groupByKey(characterSettings[character.baseID].targets, target => target.name) :
      {};

    const levelActive = target.upgradeMods ? 'active' : '';
    const sliceActive = character.optimizerSettings.sliceMods ? 'active' : '';
    const restrictionsActive = target.hasRestrictions() ? 'active' : '';
    const targetStatActive = target.targetStats && target.targetStats.length ? 'active' : '';
    const duplicateActive = this.props.selectedCharacters
      .filter(({ character: sc }) => sc.baseID === character.baseID).length > 1 ? 'active' : '';
    const negativeWeightsActive = target.hasNegativeWeights() ? 'active' : '';
    const minimumDots = character.optimizerSettings.minimumModDots;
    const changedTargetActive = Object.keys(defaultTargets).includes(target.name) &&
      !defaultTargets[target.name].equals(target) ? 'active' : '';
    const blankTargetActive = target.isBlank() ? 'active' : '';
    const lockedActive = character.optimizerSettings.isLocked ? 'active' : '';

    return <div className={'character-icons'}>

      <span className={`icon minimum-dots`}
        title={`This character will only use mods with at least ${minimumDots} ${1 === minimumDots ? 'dot' : 'dots'}`} >
        <select
          value={minimumDots}
          onChange={(event) => {
            this.props.changeMinimumModDots(character.baseID, event.target.value)
            document.activeElement.blur()
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(dots => <option key={dots} value={dots}>{dots}</option>)}
        </select>
        <span className={` ${1 < minimumDots ? 'green active' : 'gray'}`}>{minimumDots}</span>
      </span>
      <span className={`icon level ${levelActive}`}
        onClick={() => this.props.toggleUpgradeMods(characterIndex)}
        title={levelActive ? 'Level this character\'s mods to 15' : 'Do not level this character\'s mods to 15'} />
      <span className={`icon slice ${sliceActive}`}
        onClick={() => this.props.toggleSliceMods(character.baseID)}
        title={sliceActive ? 'Slice this character\'s mods to 6E' : 'Do not slice this character\'s mods to 6E'} />
      <span className={`icon restrictions ${restrictionsActive}`}
        title={restrictionsActive ?
          'This character has restrictions active' :
          'This character has no restrictions active'} />
      <span className={`icon target ${targetStatActive}`}
        title={targetStatActive ?
          'This character has a target stat selected' :
          'This character has no target stat selected'} />
      <span className={`icon duplicate ${duplicateActive}`}
        title={duplicateActive ?
          'This character is in the list more than once' :
          'This character is only in the list once'} />
      <span className={`icon negative ${negativeWeightsActive}`}
        title={negativeWeightsActive ?
          'This character\'s target has negative stat weights' :
          'This character\'s target has no negative stat weights'} />
      <span className={`icon changed-target ${changedTargetActive}`}
        title={changedTargetActive ?
          'This character\'s target has been modified from the default' :
          'This character\'s target matches the default'} />
      <span className={`icon blank-target ${blankTargetActive}`}
        title={blankTargetActive ?
          'This character\'s target has no assigned stat weights' :
          'This character\'s target has at least one stat given a value'} />
      <span className={`icon locked ${lockedActive}`}
        onClick={() => this.props.toggleCharacterLock(character.baseID)}
        title={lockedActive ?
          'This character is locked. Its mods will not be assigned to other characters' :
          'This character is not locked'} />
    </div>;
  }

  render() {
    return (
      <div className={'character-list'}
        onDragEnter={this.characterBlockDragEnter()}
        onDragOver={this.characterBlockDragOver()}
        onDragLeave={this.characterBlockDragLeave()}
        onDrop={this.characterBlockDrop(this.props.selectedCharacters.length - 1)}>
        {0 < this.props.selectedCharacters.length &&
          // Add a block to allow characters to be dragged to the top of the list
          <div className={'top-block'}
            onDragEnd={this.characterBlockDragEnter()}
            onDragOver={this.characterBlockDragOver()}
            onDragLeave={this.characterBlockDragLeave()}
            onDrop={this.characterBlockDrop(null)}
          />
        }
        {0 < this.props.selectedCharacters.length && this.props.selectedCharacters.map(({ character, target }, index) =>
          this.renderCharacterBlock(character, target, index)
        )}

        {0 === this.props.selectedCharacters.length &&
          <div
            className={'character-block'}
            onDragEnter={this.characterBlockDragEnter()}
            onDragOver={this.characterBlockDragOver()}
            onDragLeave={this.characterBlockDragLeave()}
            onDrop={this.characterBlockDrop(null)} />
        }
      </div>
    )
  }

  showEditCharacterModal(character, index, target) {
    this.props.setOptimizeIndex(index);
    this.props.showModal(
      '',
      <CharacterEditForm
        character={character}
        characterIndex={index}
        target={target}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    characters: state.profile.characters,
    gameSettings: state.gameSettings,
    selectedCharacters: state.profile.selectedCharacters.map(
      ({ id: characterID, target }) => ({ character: state.profile.characters[characterID], target: target })
    )
  };
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  selectCharacter: (characterID, target, prevIndex) => dispatch(selectCharacter(characterID, target, prevIndex)),
  unselectCharacter: (characterID) => dispatch(unselectCharacter(characterID)),
  moveCharacter: (fromIndex, toIndex) => dispatch(moveSelectedCharacter(fromIndex, toIndex)),
  changeCharacterTarget: (characterID, target) => dispatch(changeCharacterTarget(characterID, target)),
  lockCharacter: (characterID) => dispatch(lockCharacter(characterID)),
  toggleCharacterLock: (characterID) => dispatch(toggleCharacterLock(characterID)),
  toggleSliceMods: (characterID) => dispatch(toggleSliceMods(characterID)),
  toggleUpgradeMods: (characterIndex) => dispatch(toggleUpgradeMods(characterIndex)),
  changeMinimumModDots: (characterID, newMinimum) => dispatch(changeMinimumModDots(characterID, newMinimum)),
  setOptimizeIndex: (index) => dispatch(setOptimizeIndex(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);
