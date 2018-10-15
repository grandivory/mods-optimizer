// @flow

import React, {PureComponent} from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import "./CharacterList.css";
import {connect} from "react-redux";
import groupByKey from "../../utils/groupByKey";
import CharacterEditForm from "../../containers/CharacterEditForm/CharacterEditForm";
import {showModal} from "../../state/actions/app";
import {
  changeCharacterTarget,
  lockCharacter,
  selectCharacter,
  unselectCharacter
} from "../../state/actions/characterEdit";

class CharacterList extends PureComponent {
  characterBlockDragStart(characterID) {
    return function(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', characterID);
    };
  }

  characterBlockDragEnter() {
    return function(event) {
      event.preventDefault();

      event.dataTransfer.dropEffect = 'move';
      event.target.classList.add('drop-character');
    }
  }

  characterBlockDragOver() {
    return function(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }
  }

  characterBlockDragLeave() {
    return function(event) {
      event.preventDefault();
      event.target.classList.remove('drop-character');
    }
  }

  /**
   * @param dropCharacterID string The ID of the character on which the drop is occurring
   * @returns {Function}
   */
  characterBlockDrop(dropCharacterID) {
    const characters = this.props.characters;
    const selfDrop = this.props.selfDrop;
    const selectCharacter = this.props.selectCharacter;

    return function(event) {
      event.preventDefault();
      event.stopPropagation();
      let movingCharacterID = event.dataTransfer.getData('text/plain');

      // Only allow drops if the character isn't already in this list, or self-drops are allowed
      if (selfDrop || !characters.some(character => character.name === movingCharacterID)) {
        selectCharacter(movingCharacterID, dropCharacterID);
      }
      event.target.classList.remove('drop-character');
    }
  }

  renderCharacterBlock(character) {
    const defaultTargets = groupByKey(character.defaultSettings.targets, target => target.name);
    const draggable = this.props.draggable;

    const selectedPlan = character.optimizerSettings.isLocked ? 'lock' : character.optimizerSettings.target.name;
    const options = character.targets()
      .map(target => target.name)
      .map(targetName => {
        const changeIndicator = Object.keys(defaultTargets).includes(targetName) &&
        character.optimizerSettings.targets.map(target => target.name).includes(targetName) &&
        !defaultTargets[targetName].equals(
          character.optimizerSettings.targets.find(target => target.name === targetName)
        ) ? '*' : '';

        return <option value={targetName} key={targetName}>{changeIndicator}{targetName}</option>;
      });

    const onSelect = function(e) {
      const optimizationTarget = e.target.value;

      // Don't change the select value unless we explicitly do so through a state change
      e.target.value = character.optimizerSettings.target.name;

      if ('custom' === optimizationTarget) {
        this.props.showModal(
          '',
          <CharacterEditForm character={character} target={character.optimizerSettings.target.rename('custom')}/>
        );
      } else if ('lock' === optimizationTarget) {
        this.props.lockCharacter(character.baseID);
      } else {
        this.props.changeCharacterTarget(
          character.baseID,
          character.targets().find(target => target.name === optimizationTarget)
        );
      }
    };

    const baseClass = `character-block ${character.baseID}`;

    return <div className={character.optimizerSettings.isLocked ? `${baseClass} locked` : baseClass}
                key={character.baseID}
                draggable={draggable}
                onDragStart={this.characterBlockDragStart(character.baseID)}
                onDragEnter={this.characterBlockDragEnter()}
                onDragOver={this.characterBlockDragOver()}
                onDragLeave={this.characterBlockDragLeave()}
                onDrop={this.characterBlockDrop(character.baseID)}
                onDoubleClick={() => this.props.unselectCharacter(character.baseID)}>
      <CharacterAvatar character={character}/>
      <div className={'character-name'}>{character.gameSettings.name}</div>
      <div className={'target'}>
        <label>Target:</label>
        <div className={'dropdown'}>
          <select value={selectedPlan} onChange={onSelect.bind(this)}>
            {options}
            <option value={'custom'}>Custom</option>
            <option value={'lock'}>Lock</option>
          </select>
        </div>
        <button
          type={'button'}
          onClick={() => this.props.showModal(
            '',
            <CharacterEditForm
              character={character}
              target={selectedPlan !== 'lock' ?
                character.optimizerSettings.target :
                character.optimizerSettings.target.rename('custom')
              }
            />
          )}>
          Edit
        </button>
      </div>
    </div>;
  }

  render() {
    return (
      <div className={'character-list'}
           onDragEnter={this.characterBlockDragEnter()}
           onDragOver={this.characterBlockDragOver()}
           onDragLeave={this.characterBlockDragLeave()}
           onDrop={this.characterBlockDrop('')}>
        {0 < this.props.characters.length && this.props.characters.map(character =>
          this.renderCharacterBlock(character)
        )}

        {0 === this.props.characters.length &&
        <div
          className={'character-block'}
          onDragEnter={this.characterBlockDragEnter()}
          onDragOver={this.characterBlockDragOver()}
          onDragLeave={this.characterBlockDragLeave()}
          onDrop={this.characterBlockDrop(null)}/>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const profile = state.profiles[state.allyCode];

  return {
    characters: profile.selectedCharacters.map(characterID => profile.characters[characterID])
  };
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  selectCharacter: (characterID, prevCharacterID) => dispatch(selectCharacter(characterID, prevCharacterID)),
  unselectCharacter: (characterID) => dispatch(unselectCharacter(characterID)),
  changeCharacterTarget: (characterID, target) => dispatch(changeCharacterTarget(characterID, target)),
  lockCharacter: (characterID) => dispatch(lockCharacter(characterID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);
