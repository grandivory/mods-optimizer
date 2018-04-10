import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import Arrow from "../../components/Arrow/Arrow";
import ModSet from "../../domain/ModSet";
import ModSetDetail from "../../components/ModSetDetail/ModSetDetail";

import './ReviewSets.css';
import characterOptimizations from "../../constants/characterOptimizations";

class ReviewSets extends React.Component {
  constructor() {
    super();
    this.state = {'view': 'all'};
  }

  render() {
    let characterSets = this.props.characterSets;
    const mods = this.props.mods;
    const numOptimizedCharacters = characterSets.length;

    // Filter out sets based on the view settings
    if ('move' === this.state.view) {
      characterSets = characterSets.filter(characterSet =>
        undefined !== characterSet.modSet.mods().find(mod => mod.currentCharacter !== mod.assignTo)
      );
    }

    // Create sets for everything each character already has equipped
    const rows = characterSets.map(characterSet => {
      const currentSet = new ModSet(mods.filter(mod => mod.currentCharacter === characterSet.character));
      const optimizationPlan = characterOptimizations[characterSet.character.name].optimizationPlan;

      return (
        <div className={'set-row'} key={characterSet.character.name}>
          <ModSetDetail set={currentSet} optimizationPlan={optimizationPlan} character={characterSet.character} />
          <CharacterAvatar name={characterSet.character.name}/>
          <Arrow />
          <ModSetDetail
            set={characterSet.modSet}
            optimizationPlan={optimizationPlan}
            character={characterSet.character} />
        </div>
      );
    });

    if (0 === characterSets.length) {
      return (
        <div className={'review-sets'}>
          <h2>Your mods are already optimal. Congratulations!</h2>
        </div>
      );
    } else {
      return (
        <div className={'review-sets'}>
          <h2>Showing mod sets for {characterSets.length} out of {numOptimizedCharacters} characters</h2>
          <div className={'display-options'}>
            <button onClick={this.showSets.bind(this, 'all')}>Show all sets</button>
            <button onClick={this.showSets.bind(this, 'move')}>Show only sets with moving mods</button>
          </div>
          <div className={'sets-list'}>
            {rows}
          </div>
        </div>
      );
    }
  }

  /**
   * Limit the view to only some sets
   *
   * @param filter string The indicator of what sets to show
   */
  showSets(filter) {
    this.setState({
      'view': filter
    })
  }
}

export default ReviewSets;
