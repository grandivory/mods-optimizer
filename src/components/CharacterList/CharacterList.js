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

  render() {
    const characters = this.props.characters;
    const draggable = this.props.draggable;

    return (
      <div className={'character-list'}>
        {0 < characters.length && characters.map(character =>
          <div
            className={'character-block'}
            key={character.name}
            draggable={draggable}
            onDragStart={this.characterBlockDragStart(character.name)}
            onDragEnter={this.characterBlockDragEnter(character.name)}
            onDragOver={this.characterBlockDragOver()}
            onDragLeave={this.characterBlockDragLeave(character.name)}
            onDrop={this.characterBlockDrop(character.name)}>
            <CharacterAvatar name={character.name} />
            <span className={'character-name'}>{character.name}</span>
          </div>
        )}
        {0 === characters.length &&
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
