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
  lockCharacter, moveSelectedCharacter,
  selectCharacter,
  unselectCharacter
} from "../../state/actions/characterEdit";
import characterSettings from "../../constants/characterSettings";

class CharacterList extends PureComponent {
  characterBlockDragStart(index) {
    return function(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index);
    };
  }

  characterBlockDragEnter() {
    return function(event) {
      event.preventDefault();

      event.target.classList.add('drop-character');
    }
  }

  characterBlockDragOver() {
    return function(event) {
      event.preventDefault();
    }
  }

  characterBlockDragLeave() {
    return function(event) {
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

    return function(event) {
      event.preventDefault();
      event.stopPropagation();

      switch (event.dataTransfer.effectAllowed) {
        case 'copy':
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

    const selectedPlan = character.optimizerSettings.isLocked ? 'lock' : target.name;
    const options = character.targets()
      .map(characterTarget => characterTarget.name)
      .filter(targetName => 'custom' !== targetName)
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
      e.target.value = target.name;

      if ('custom' === optimizationTarget) {
        this.props.showModal(
          '',
          <CharacterEditForm character={character} characterIndex={index} target={target.rename('custom')}/>
        );
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
                onDoubleClick={() => this.props.unselectCharacter(character.baseID)}>
      <div className={character.optimizerSettings.isLocked ? `${baseClass} locked` : baseClass}
           draggable={draggable}
           onDragStart={this.characterBlockDragStart(index)}>
        <CharacterAvatar character={character}/>
        <div className={'character-name'}>
          {this.props.gameSettings[character.baseID] ?
            this.props.gameSettings[character.baseID].name :
            character.baseID}
        </div>
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
                characterIndex={index}
                target={selectedPlan !== 'lock' ?
                  target :
                  target.rename('custom')
                }
              />
            )}>
            Edit
          </button>
        </div>
      </div>
    </div>;
  }

  render() {
    return (
      <div className={'character-list'}
           onDragEnter={this.characterBlockDragEnter()}
           onDragOver={this.characterBlockDragOver()}
           onDragLeave={this.characterBlockDragLeave()}
           onDrop={this.characterBlockDrop(this.props.lastCharacterID)}>
        {0 < this.props.selectedCharacters.length &&
        // Add a block to allow characters to be dragged to the top of the list
        <div className={'top-block'}
             onDragEnd={this.characterBlockDragEnter()}
             onDragOver={this.characterBlockDragOver()}
             onDragLeave={this.characterBlockDragLeave()}
             onDrop={this.characterBlockDrop(null)}
        />
        }
        {0 < this.props.selectedCharacters.length && this.props.selectedCharacters.map(({character, target}, index) =>
          this.renderCharacterBlock(character, target, index)
        )}

        {0 === this.props.selectedCharacters.length &&
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
  return {
    characters: state.profile.characters,
    gameSettings: state.gameSettings,
    lastCharacterID: state.profile.selectedCharacters[state.profile.selectedCharacters.length - 1],
    selectedCharacters: state.profile.selectedCharacters.map(
      ({id: characterID, target}) => ({character: state.profile.characters[characterID], target: target})
    )
  };
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  selectCharacter: (characterID, target, prevIndex) => dispatch(selectCharacter(characterID, target, prevIndex)),
  unselectCharacter: (characterID) => dispatch(unselectCharacter(characterID)),
  moveCharacter: (fromIndex, toIndex) => dispatch(moveSelectedCharacter(fromIndex, toIndex)),
  changeCharacterTarget: (characterID, target) => dispatch(changeCharacterTarget(characterID, target)),
  lockCharacter: (characterID) => dispatch(lockCharacter(characterID))
});

export default connect(mapStateToProps, mapDispatchToProps)(CharacterList);
