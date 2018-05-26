import React from 'react';
import ModDetail from "../../components/ModDetail/ModDetail";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import './ReviewList.css';
import Arrow from "../../components/Arrow/Arrow";
import Toggle from "../../components/Toggle/Toggle";

class ReviewList extends React.Component {

  constructor(props) {
    super(props);
    this.sortOptions = {
      'currentCharacter': 'currentCharacter',
      'assignTo': 'assignTo'
    };
    this.state = {'sortBy': this.sortOptions.assignTo};

    let movingMods = this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);

    this.slotOrder = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

    this.state.movingMods = movingMods.sort(this.optimizerOrder.bind(this));

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
          <div className={'filters'}>
            {this.filterForm()}
          </div>
          <h2>Reassigning {movingMods.length} mods</h2>
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
   * Change the view to sort (and filter) mods by either the characters currently equipping them, or
   * the characters they're being reassigned to
   */
  changeSortTo(sortBy) {
    let movingMods = this.state.movingMods;

    if (this.sortOptions.currentCharacter === sortBy) {
      movingMods.sort(this.characterSort.call(this, sortBy))
    } else {
      movingMods.sort(this.optimizerOrder.bind(this))
    }

    this.setState({
      'sortBy': sortBy,
      'movingMods': movingMods
    });
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
   * Sorting function for reordering mods into the same order the characters were selected for.
   */
  optimizerOrder(left, right) {
    const characterList = this.props.characters;
    const slotOrder = this.slotOrder;
    let leftChar = left.assignTo;
    let rightChar = right.assignTo;

    if (leftChar === rightChar) {
      return slotOrder.indexOf(left.slot) - slotOrder.indexOf(right.slot);
    } else {
      return characterList.indexOf(left.assignTo) - characterList.indexOf(right.assignTo);
    }
  }

  /**
   * Render a form used to filter and sort the mods displayed on the page
   * @returns JSX Element
   */
  filterForm() {
    return <div className={'filter-form'}>
      <Toggle inputLabel={'Organize mods by:'}
              leftLabel={'Currently Equipped'}
              leftValue={this.sortOptions.currentCharacter}
              rightLabel={'Assigned Character'}
              rightValue={this.sortOptions.assignTo}
              value={this.sortOptions.assignTo}
              onChange={this.changeSortTo.bind(this)}
      />
    </div>;
  }
}

export default ReviewList;
