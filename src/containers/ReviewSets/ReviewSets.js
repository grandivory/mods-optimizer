import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import Arrow from "../../components/Arrow/Arrow";
import ModSet from "../../domain/ModSet";
import ModSetDetail from "../../components/ModSetDetail/ModSetDetail";

import './ReviewSets.css';

class ReviewSets extends React.Component {
  render() {
    const characterSets = this.props.characterSets;
    const mods = this.props.mods;

    // Create sets for everything each character already has equipped
    const rows = characterSets.map(characterSet => {
      const currentSet = new ModSet(mods.filter(mod => mod.currentCharacter === characterSet.character));

      return (
        <div className={'set-row'} key={characterSet.character.name}>
          <ModSetDetail set={currentSet} character={characterSet.character} />
          <CharacterAvatar name={characterSet.character.name}/>
          <Arrow />
          <ModSetDetail set={characterSet.modSet} character={characterSet.character} />
        </div>
      );
    });

    return (
      <div className={'review-sets'}>
        <div className={'sets-list'}>
          {rows}
        </div>
      </div>
    );
  }
}

export default ReviewSets;
