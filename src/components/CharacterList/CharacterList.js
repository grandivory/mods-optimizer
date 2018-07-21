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
      let movingCharacterName = event.dataTransfer.getData('text/plain');

      // Only allow drops if the character isn't already in this list, or self-drops are allowed
      if (selfDrop || !characters.some(character => character.name === movingCharacterName)) {
        dropFunction(characters, movingCharacterName, characterName);
      }
      event.target.classList.remove('drop-character');
    }
  }

  renderCharacterBlock(character) {
    const draggable = this.props.draggable;
    const onEdit = 'function' === typeof this.props.onEdit ? this.props.onEdit : function() {};
    const saveState = 'function' === typeof this.props.saveState ? this.props.saveState : function() {};
    const selectedPlan = character.isLocked ?
      'lock' :
      Object.keys(character.namedPlans).find(
        key => character.namedPlans[key].equals(character.optimizationPlan)
      ) || 'custom';
    const options = Object.keys(character.namedPlans).map(key =>
      <option value={key} key={key}>{key}</option>
    );
    const onSelect = function(e) {
      const optimizationTarget = e.target.value;

      if ('custom' === optimizationTarget) {
        character.isLocked = false;
        e.target.parentNode.parentNode.classList.remove('locked');
        onEdit(character, 'custom');
      } else if ('lock' === optimizationTarget) {
        e.target.parentNode.parentNode.classList.add('locked');
        character.isLocked = true;
        saveState();
        this.setState({});
      } else {
        character.isLocked = false;
        e.target.parentNode.parentNode.classList.remove('locked');
        character.optimizationPlan = character.namedPlans[optimizationTarget];
        saveState();
        this.setState({});
      }
    };
    const baseClass = `character-block ${character.baseID}`;

    return <div
        className={character.isLocked ? `${baseClass} locked` : baseClass}
        key={character.baseID}
        draggable={draggable}
        onDragStart={this.characterBlockDragStart(character.name)}
        onDragEnter={this.characterBlockDragEnter(character.name)}
        onDragOver={this.characterBlockDragOver()}
        onDragLeave={this.characterBlockDragLeave(character.name)}
        onDrop={this.characterBlockDrop(character.name)}>
      <CharacterAvatar character={character} />
      <div className={'character-name'}>{character.name}</div>
      <div className={'target'}>
        <label>Target:</label>
        <select value={selectedPlan} onChange={onSelect.bind(this)}>
          {options}
          <option value={'custom'}>Custom</option>
          <option value={'lock'}>Lock</option>
        </select>
        <button type={'button'} onClick={() => onEdit(character, selectedPlan !== 'lock' ? selectedPlan : 'custom')}>
          Edit
        </button>
      </div>
    </div>;
  }

  render() {
    const characters = this.props.characters;

    const isFiltered = character => (
        this.props.filterString === undefined || this.props.filterString.length === 0 ||
          character.matchesFilter(this.props.filterString)
    );

    const filteredChars = characters.filter(isFiltered);
    const unfilteredChars = characters.filter(character=>!isFiltered(character));

    return (
      <div className={'character-list'}>

        {0 < filteredChars.length && filteredChars.map(character =>
           this.renderCharacterBlock(character)
        )}

        {0 < unfilteredChars.length && unfilteredChars.map(character =>
            this.renderCharacterBlock(character, true)
        )}

        {0 === filteredChars.length &&
          <div
            className={'character-block'}
            onDragEnter={this.characterBlockDragEnter('')}
            onDragOver={this.characterBlockDragOver()}
            onDragLeave={this.characterBlockDragLeave('')}
            onDrop={this.characterBlockDrop('')}>
          </div>
        }
      </div>
    )
  }
}

export default CharacterList;
