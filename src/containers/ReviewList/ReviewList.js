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
    this.state = {
      'sortBy': this.sortOptions.assignTo,
      'tag': ''
    };

    this.state.movingMods = this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);
    this.state.displayedMods = this.state.movingMods;

    this.slotOrder = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];

    if ('function' === typeof props.saveState) {
      this.saveState = props.saveState;
    } else {
      this.saveState = function() {};
    }
  }

  render() {
    const modsLeft = this.state.movingMods.length;

    const modRows = this.state.displayedMods.map(mod =>
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

    if (0 === modsLeft) {
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
          <h2>Reassigning {modsLeft} mods</h2>
          {(0 < this.state.displayedMods.length) &&
            <div className={'mods-list'}>
              {modRows}
            </div>
          }
          {(0 === this.state.displayedMods.length) &&
            <h3>No more mods to move under that filter. Try a different filter now!</h3>
          }
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
    this.updateMovingMods();
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
    this.updateMovingMods();
  }

  /**
   * Re-filter all of the mods this view is aware of to get a list of those that are moving, then save the state and
   * re-render
   */
  updateMovingMods() {
    this.setState({
      'movingMods': this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo)
    });
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
    const sortBy = this.state.sortBy;
    const tags = this.state.movingMods
      .filter(mod => null !== mod[sortBy])
      .map(mod => mod[sortBy].tags)
      .reduce((allTags, charTags) => allTags.concat(charTags.filter(tag => !allTags.includes(tag))), [])
      .sort();
    const tagOptions = tags.map(tag => <option value={tag} key={tag}>{tag}</option>);

    return <div className={'filter-form'}>
      <Toggle inputLabel={'Organize mods by:'}
              leftLabel={'Currently Equipped'}
              leftValue={this.sortOptions.currentCharacter}
              rightLabel={'Assigned Character'}
              rightValue={this.sortOptions.assignTo}
              value={this.sortOptions.assignTo}
              onChange={sortBy => this.updateDisplayedMods.bind(this)(sortBy, this.state.tag)}
      />
      <label htmlFor={'tag'}>Show characters by tag:</label>
      <select id={'tag'} value={this.state.tag} onChange={e => this.updateDisplayedMods.bind(this)(sortBy, e.target.value)}>
        <option value={''}>All</option>
        {tagOptions}
      </select>
    </div>;
  }

  /**
   * Update the list of mods that's shown based on the values in the filter form and re-render the form
   */
  updateDisplayedMods(sortBy, tag) {
    let displayedMods = this.state.movingMods;

    if ('' !== tag) {
      const filteredMods = displayedMods.filter(mod => mod[sortBy] && mod[sortBy].tags.includes(tag));
      if (filteredMods.length) {
        displayedMods = filteredMods;
      }
    }

    if (this.sortOptions.currentCharacter === sortBy) {
      displayedMods.sort(this.characterSort.call(this, sortBy))
    } else {
      displayedMods.sort(this.optimizerOrder.bind(this))
    }

    this.setState({
      'sortBy': sortBy,
      'tag': displayedMods.length ? tag : '',
      'displayedMods': displayedMods
    });
  }
}

export default ReviewList;
