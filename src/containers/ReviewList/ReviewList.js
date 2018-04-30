import React from 'react';
import ModDetail from "../../components/ModDetail/ModDetail";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import './ReviewList.css';
import Arrow from "../../components/Arrow/Arrow";

class ReviewList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {'sortBy': 'assignTo'};

    let movingMods = this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);

    movingMods.sort(this.characterSort('assignTo'));

    this.state.movingMods = movingMods;

    if ('function' === typeof props.saveState) {
      this.saveState = props.saveState;
    } else {
      this.saveState = function() {};
    }
  }

  render() {
    let movingMods = this.state.movingMods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);

    const modRows = movingMods.map(mod =>
      <div className={'mod-row'} key={mod.id} >
        <ModDetail key={mod.id} mod={mod}/>
        <Arrow />
        <CharacterAvatar name={mod.assignTo.name}/>
        <div className={'actions'}>
          <button onClick={this.removeMod.bind(this, mod)}>Remove Mod</button>
          <button onClick={this.reassignMod.bind(this, mod)}>Reassign Mod</button>
        </div>
      </div>
    );

    if (0 === movingMods.length) {
      return (
        <div className={'review-list'}>
          <h2>You don't have any mods left to move! Great job!</h2>
          <h3>Don't forget to assign mods to all your pilots!</h3>
        </div>
      )
    } else {
      return (
        <div className={'review-list'}>
          <h2>Reassigning {movingMods.length} mods</h2>
          <div className={'sort-options'}>
            Sort By:
            <button onClick={this.reSort.bind(this, 'currentCharacter')}>Currently Equipped</button>
            <button onClick={this.reSort.bind(this, 'assignTo')}>Assigned Character</button>
          </div>
          <div className={'mods-list'}>
            {modRows}
          </div>
        </div>
      );
    }
  }

  removeMod(mod) {
    mod.currentCharacter = null;
    this.setState({});
    this.saveState();
  }

  reassignMod(mod) {
    this.props.mods
      .filter(m => m.currentCharacter === mod.assignTo && m.slot === mod.slot)
      .forEach(m => m.currentCharacter = null);
    mod.currentCharacter = mod.assignTo;
    this.setState({});
    this.saveState();
  }

  characterSort(characterPropertyName) {
    return function(left, right) {
      let leftCharName = left[characterPropertyName] ? left[characterPropertyName].name : '';
      let rightCharName = right[characterPropertyName] ? right[characterPropertyName].name : '';

      if (leftCharName < rightCharName) {
        return -1;
      } else if (leftCharName > rightCharName) {
        return 1;
      } else {
        if (left.slot < right.slot) {
          return -1;
        } else if (left.slot > right.slot) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }

  reSort(characterPropertyName) {
    let movingMods = this.state.movingMods;

    movingMods.sort(this.characterSort(characterPropertyName));

    this.setState({
      'sortBy': characterPropertyName,
      'movingMods': movingMods
    });
  }
}

export default ReviewList;
