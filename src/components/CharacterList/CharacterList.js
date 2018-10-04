// @flow

import React from "react";
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";

import "./CharacterList.css";

class CharacterList extends React.Component {
  characterBlockDragStart(characterName) {
    return function(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', characterName);
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

  characterBlockDrop(characterName) {
    const characters = this.props.characters;
    const dropFunction = this.props.onDrop;
    const selfDrop = this.props.selfDrop;

    return function(event) {
      event.preventDefault();
      event.stopPropagation();
      let movingCharacterName = event.dataTransfer.getData('text/plain');

      // Only allow drops if the character isn't already in this list, or self-drops are allowed
      if (selfDrop || !characters.some(character => character.name === movingCharacterName)) {
        dropFunction(characters, movingCharacterName, characterName);
      }
      event.target.classList.remove('drop-character');
    }
  }

  renderCharacterBlock(character) {
    const defaultTargets = character.defaultSettings.targets.reduce((targets, target) => {
      targets[target.name] = target;
      return targets;
    }, {});
    const draggable = this.props.draggable;
    const onEdit = 'function' === typeof this.props.onEdit ? this.props.onEdit : function() {};
    const onDoubleClick = 'function' === typeof this.props.onDoubleClick ? this.props.onDoubleClick : function() {};

    const selectedPlan = character.optimizerSettings.isLocked ?
      'lock' : character.optimizerSettings.target;
    const options = Object.keys(defaultTargets)
      .concat(character.optimizerSettings.targets.map(target => target.name))
      .filter((name, index, self) => index === self.indexOf(name))
      .map(targetName => {
        const changeIndicator = Object.keys(defaultTargets).includes(targetName) &&
          character.optimizerSettings.targets.map(target => target.name).includes(targetName) &&
          !defaultTargets[targetName].equals(
            character.optimizerSettings.targets.find(target => target.name === targetName)
          ) ? '*' : '';

        return <option value={targetName} key={targetName}>{changeIndicator}{targetName}</option>;
      });

    // TODO: Implement this
    const onSelect = function(e) {};
    //   const optimizationTarget = e.target.value;
    //
    //   if ('custom' === optimizationTarget) {
    //     character.isLocked = false;
    //     e.target.parentNode.parentNode.classList.remove('locked');
    //     onEdit(character, 'custom');
    //   } else if ('lock' === optimizationTarget) {
    //     e.target.parentNode.parentNode.classList.add('locked');
    //     character.isLocked = true;
    //   } else {
    //     character.isLocked = false;
    //     e.target.parentNode.parentNode.classList.remove('locked');
    //     character.optimizationPlan = character.namedPlans[optimizationTarget];
    //   }
    // };
    const baseClass = `character-block ${character.baseID}`;

    return <div className={character.optimizerSettings.isLocked ? `${baseClass} locked` : baseClass}
                key={character.baseID}
                draggable={draggable}
                onDragStart={this.characterBlockDragStart(character.gameSettings.name)}
                onDragEnter={this.characterBlockDragEnter()}
                onDragOver={this.characterBlockDragOver()}
                onDragLeave={this.characterBlockDragLeave()}
                onDrop={this.characterBlockDrop(character.gameSettings.name)}
                onDoubleClick={() => onDoubleClick(character)}>
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
        <button type={'button'} onClick={() => onEdit(character, selectedPlan !== 'lock' ? selectedPlan : 'custom')}>
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
          onDrop={this.characterBlockDrop('')} />
        }
      </div>
    )
  }
}

export default CharacterList;
