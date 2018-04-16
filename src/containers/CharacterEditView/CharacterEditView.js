import React from "react";

import "./CharacterEditView.css";
import CharacterList from "../../components/CharacterList/CharacterList";

class CharacterEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableCharacters': props.availableCharacters,
      'selectedCharacters': props.selectedCharacters
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
      // Re-render
      me.setState({});
    }
  }

  render() {
    const availableCharacters = this.state.availableCharacters;
    const selectedCharacters = this.state.selectedCharacters;

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
            onDrop={this.characterDrop()} />
        </div>
        <div className={'selected-characters'}>
          <h4>Selected Characters</h4>
          <CharacterList
            selfDrop={true}
            draggable={true}
            characters={selectedCharacters}
            onDrop={this.characterDrop()} />
        </div>
      </div>
    );
  }
}

export default CharacterEditView;
