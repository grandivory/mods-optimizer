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

    this.slotOrder = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

    this.state.movingMods = movingMods;
    this.optimizerOrder(false);

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
            <button onClick={this.optimizerOrder.bind(this)}>Assigned Character</button>
          </div>
          <div className={'mods-list'}>
            {modRows}
          </div>
        </div>
      );
    }
  }

  /**
   * Unassign a mod from any character and re-render the view to show the change.
   * @param mod Mod
   */
  removeMod(mod) {
    mod.currentCharacter = null;
    this.setState({});
    this.saveState();
  }

  /**
   * Move a mod from its currently assigned character to its assignTo charcter and re-render the view.
   * @param mod Mod
   */
  reassignMod(mod) {
    this.props.mods
      .filter(m => m.currentCharacter === mod.assignTo && m.slot === mod.slot)
      .forEach(m => m.currentCharacter = null);
    mod.currentCharacter = mod.assignTo;
    this.setState({});
    this.saveState();
  }

  /**
   * Generate a sort function for a list of mods based on reading a particular property to get the characters to sort by
   * @param characterPropertyName string The name of the property from which to read the character name
   * @returns {Function}
   */
  characterSort(characterPropertyName) {
    const slotOrder = this.slotOrder;
    return function(left, right) {
      let leftCharName = left[characterPropertyName] ? left[characterPropertyName].name : '';
      let rightCharName = right[characterPropertyName] ? right[characterPropertyName].name : '';

      if (leftCharName < rightCharName) {
        return -1;
      } else if (leftCharName > rightCharName) {
        return 1;
      } else {
        return slotOrder.indexOf(left.slot) - slotOrder.indexOf(right.slot);
      }
    }
  }

  /**
   * Re-sort the list of moving mods by a particular property
   * @param characterPropertyName string The property to sort by
   */
  reSort(characterPropertyName) {
    let movingMods = this.state.movingMods;

    movingMods.sort(this.characterSort.call(this, characterPropertyName));

    this.setState({
      'sortBy': characterPropertyName,
      'movingMods': movingMods
    });
  }

  /**
   * Re-sort the list of moving mods into the same order the characters were selected for.
   * @param reRender bool If true, will re-render the view upon completion of the sort
   */
  optimizerOrder(reRender) {
    let movingMods = this.state.movingMods;
    const characterList = this.props.characters;
    const slotOrder = this.slotOrder

    movingMods.sort((left, right) => {
      let leftChar = left.assignTo;
      let rightChar = right.assignTo;

      if (leftChar === rightChar) {
        return slotOrder.indexOf(left.slot) - slotOrder.indexOf(right.slot);
      } else {
        return characterList.indexOf(left.assignTo) - characterList.indexOf(right.assignTo);
      }
    });

    if (reRender) {
      this.setState({
        'sortBy': 'assignTo',
        'movingMods': movingMods
      });
    }
  }
}

export default ReviewList;
