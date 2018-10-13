// @flow

import React from 'react';
import ModDetail from "../../components/ModDetail/ModDetail";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import './ReviewList.css';
import Arrow from "../../components/Arrow/Arrow";
import Toggle from "../../components/Toggle/Toggle";
import ModSet from "../../domain/ModSet";
import ModSetView from "../../components/ModSetView/ModSetView";
import Modal from "../../components/Modal/Modal";
import copyToClipboard from "../../utils/clipboard"
import {changeOptimizerView, unequipMod} from "../../state/actions";
import {connect} from "react-redux";
import {mapObjectByKeyAndValue} from "../../utils/mapObject";
import groupByKey from "../../utils/groupByKey";

class ReviewList extends React.Component {

  // TODO: Redux
  constructor(props) {
    super(props);
    this.sortOptions = {
      'currentCharacter': 'currentCharacter',
      'assignTo': 'assignTo'
    };
    this.viewOptions = {
      'list': 'list',
      'sets': 'sets'
    };
    this.state = {
      'sortBy': this.sortOptions.assignTo,
      'tag': '',
      'view': this.viewOptions.list,
      'showSummaryModal': false,
    };

    this.state.movingMods = this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);
    this.slotOrder = ['square', 'arrow', 'diamond', 'triangle', 'circle', 'cross'];
    this.state.displayedMods = this.state.movingMods;
    this.state.displayedMods.sort(this.optimizerOrder.bind(this));

    if ('function' === typeof props.saveState) {
      this.saveState = props.saveState;
    } else {
      this.saveState = function() {
      };
    }

    // Figure out the order for characters so that all mods for that character will be in the same group
    let characters = [];
    this.state.movingMods.forEach(mod => {
      if (mod.currentCharacter && !characters.includes(mod.currentCharacter)) {
        characters.push(mod.currentCharacter);
      }
      if (mod.assignTo && !characters.includes(mod.assignTo)) {
        characters.push(mod.assignTo);
      }
    });

    characters.sort((left, right) => left.compareGP(right));
    this.state.orderedCharacters = characters;
  }

  // TODO: Redux
  render() {
    let modRows;

    const summaryButton = (
      <button type={'button'} className={'small'} onClick={() => this.setState({'showSummaryModal': true})}>
        Show Summary
      </button>
    );

    switch (this.state.view) {
      case this.viewOptions.list:
        modRows = this.listView(this.props.displayedMods);
        break;
      case this.viewOptions.sets:
        modRows = this.setsView(this.props.displayedMods);
        break;
      default:
        throw new Error(`Unknown view type ${this.state.view} - should be one of "list" or "sets"`);
    }

    if (0 === this.props.numMovingMods) {
      return (
        <div className={'review-list'}>
          <div className={'sidebar'}>
            {this.sidebarActions()}
          </div>
          <h2>You don't have any mods left to move! Great job!</h2>
          <h3>Don't forget to assign mods to all your pilots!</h3>
        </div>
      )
    } else {
      return (
        <div className={'review-list'}>
          <div className={'sidebar'}>
            <div className={'filters'}>
              {this.filterForm()}
            </div>
            {this.sidebarActions()}
          </div>
          <h2>Reassigning {this.props.numMovingMods} mods {summaryButton}</h2>
          {(0 < this.props.displayedMods.length) &&
          <div className={'mods-list'}>
            {modRows}
          </div>
          }
          {(0 === this.props.displayedMods.length) &&
          <h3>No more mods to move under that filter. Try a different filter now!</h3>
          }
          <Modal show={this.state.showSummaryModal} content={this.reviewModal()}/>
        </div>
      );
    }
  }

  /**
   * Convert a list of displayed mods into the renderable elements to display them as a list of individual mods
   * @param displayedMods array[Mod]
   * @returns array[JSX Element]
   */
  listView(displayedMods) {
    return displayedMods.map(([characterID, mod]) => {
      const modCharacter = mod.characterID ? this.props.characters[mod.characterID] : null;

      return <div className={'mod-row individual'} key={mod.id}>
        <ModDetail mod={mod} character={modCharacter}/>
        <Arrow/>
        <CharacterAvatar character={this.props.characters[characterID]}/>
        <div className={'actions'}>
          <button onClick={this.props.unequipMod.bind(this, mod.id)}>I removed this mod</button>
          <button onClick={this.reassignMod.bind(this, mod)}>I reassigned this mod</button>
        </div>
      </div>
    });
  }

  /***
   * Convert a list of displayed mods into the renderable elements to display them as sets
   * @param displayedMods array[Mod]
   * @returns array[JSX Element]
   */
  // TODO: Redux
  setsView(displayedMods) {
    const me = this;

    // Group the displayed mods by character, based on the current sort options
    const modsByCharacter = displayedMods.reduce(
      (modsAcc, mod) => {
        const character = mod[me.state.sortBy];

        // This case can be hit if a mod is currently unassigned - we simply won't show it in a set
        if (!character) {
          return modsAcc;
        }

        if (!modsAcc.hasOwnProperty(character.name)) {
          modsAcc[character.name] = {
            'character': character,
            'mods': [mod]
          }
        } else {
          modsAcc[character.name].mods.push(mod);
        }

        return modsAcc;
      },
      {}
    );

    // Iterate over each character to render a full mod set
    return Object.values(modsByCharacter).map(charMods =>
      <div className={'mod-row set'} key={charMods.character.name}>
        <CharacterAvatar character={charMods.character}/>
        <Arrow/>
        <div className={'mod-set-block'}>
          <ModSetView modSet={new ModSet(charMods.mods)}
                      changeClass={this.sortOptions.currentCharacter === this.state.sortBy ? 'remove' : 'add'}
          />
        </div>
        <div className={'actions'}>
          {this.sortOptions.currentCharacter === this.state.sortBy &&
          <button onClick={this.removeMods.bind(this, charMods.mods)}>I removed these mods</button>}
          {this.sortOptions.assignTo === this.state.sortBy &&
          <button onClick={this.reassignMods.bind(this, charMods.mods)}>I reassigned these mods</button>}
        </div>
      </div>
    );
  }

  /**
   * Remove set of mods from a character and re-render the view to show the change.
   * @param mods array[Mod]
   */
  // TODO: Redux
  removeMods(mods) {
    mods.forEach(mod => {
      mod.currentCharacter = null;
    });
    const movingMods = this.updateMovingMods();
    this.saveState();
    this.updateDisplayedMods(this.state.sortBy, this.state.tag, movingMods);
  }

  /**
   * Move a mod from its currently assigned character to its assignTo charcter and re-render the view.
   * @param mod Mod
   */
  // TODO: Redux
  reassignMod(mod) {
    this.props.mods
      .filter(m => m.currentCharacter === mod.assignTo && m.slot === mod.slot)
      .forEach(m => m.currentCharacter = null);
    mod.currentCharacter = mod.assignTo;
    const movingMods = this.updateMovingMods();
    this.saveState();
    this.updateDisplayedMods(this.state.sortBy, this.state.tag, movingMods);
  }

  /**
   * Move a set of mods from their currently assigned characters to their assignTo character and re-render the view.
   * @param mods array[Mod]
   */
  // TODO: Redux
  reassignMods(mods) {
    mods.forEach(mod => {
      this.props.mods.filter(m => m.currentCharacter === mod.assignTo && m.slot === mod.slot)
        .forEach(m => m.currentCharacter = null);
      mod.currentCharacter = mod.assignTo;
    });
    const movingMods = this.updateMovingMods();
    this.saveState();
    this.updateDisplayedMods(this.state.sortBy, this.state.tag, movingMods);
  }

  /**
   * Re-filter all of the mods this view is aware of to get a list of those that are moving
   */
  // TODO: Redux
  updateMovingMods() {
    return this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);
  }

  /**
   * Generate a sort function for a list of mods based on reading a particular property to get the characters to sort by
   * @param characterPropertyName string The name of the property from which to read the character name
   * @returns {Function}
   */
  // TODO: Redux
  characterSort(characterPropertyName) {
    const slotOrder = this.slotOrder;
    const characterOrder = this.state.orderedCharacters;

    return function(left, right) {
      if (left[characterPropertyName] !== right[characterPropertyName]) {
        const leftCharIndex = left[characterPropertyName] ?
          characterOrder.indexOf(left[characterPropertyName]) :
          Infinity;
        const rightCharIndex = right[characterPropertyName] ?
          characterOrder.indexOf(right[characterPropertyName]) :
          Infinity;

        return leftCharIndex - rightCharIndex;
      } else {
        return slotOrder.indexOf(left.slot) - slotOrder.indexOf(right.slot);
      }
    }
  }

  /**
   * Sorting function for reordering mods into the same order the characters were selected for.
   */
  // TODO: Redux
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
  // TODO: Redux
  filterForm() {
    const sortBy = this.state.sortBy;
    const tags = this.state.movingMods
      .filter(mod => null !== mod[sortBy])
      .map(mod => mod[sortBy].tags)
      .reduce((allTags, charTags) => allTags.concat((charTags || []).filter(tag => !allTags.includes(tag))), [])
      .sort();
    const tagOptions = tags.map(tag => <option value={tag} key={tag}>{tag}</option>);

    return <div className={'filter-form'}>
      <Toggle inputLabel={'Organize mods by:'}
              leftLabel={'Currently Equipped'}
              leftValue={this.sortOptions.currentCharacter}
              rightLabel={'Assigned Character'}
              rightValue={this.sortOptions.assignTo}
              value={this.sortOptions.assignTo}
              onChange={sortBy => this.updateDisplayedMods.bind(this)(sortBy, this.state.tag, this.state.movingMods)}
      />
      <Toggle inputLabel={'Show mods as:'}
              leftLabel={'Sets'}
              leftValue={this.viewOptions.sets}
              rightLabel={'Individual mods'}
              rightValue={this.viewOptions.list}
              value={this.viewOptions.list}
              onChange={viewAs => this.setState({'view': viewAs})}
      />
      <label htmlFor={'tag'}>Show characters by tag:</label>
      <div className={'dropdown'}>
        <select id={'tag'}
                value={this.state.tag}
                onChange={e => this.updateDisplayedMods.bind(this)(sortBy, e.target.value, this.state.movingMods)}
        >
          <option value={''}>All</option>
          {tagOptions}
        </select>
      </div>
    </div>;
  }

  /**
   * Renders a sidebar box with action buttons
   *
   * @returns JSX Element
   */
  // TODO: Redux
  sidebarActions() {
    return <div className={'sidebar-actions'}>
      <h3>I don't like these results...</h3>
      <button type={'button'} onClick={this.props.edit}>
        Change my selection
      </button>
      <h3>I want to review changes again</h3>
      <button type={'button'} onClick={this.props.back}>
        Show me the mod sets
      </button>
    </div>
  }

  /**
   * Update the list of mods that's shown based on the values in the filter form and re-render the form
   */
  // TODO: Redux
  updateDisplayedMods(sortBy, tag, movingMods, reRender = true) {
    let displayedMods = movingMods;

    if ('' !== tag) {
      const filteredMods = displayedMods.filter(
        mod => mod[sortBy] && mod[sortBy].tags && mod[sortBy].tags.includes(tag)
      );
      if (filteredMods.length) {
        displayedMods = filteredMods;
      }
    }

    if (this.sortOptions.currentCharacter === sortBy) {
      displayedMods.sort(this.characterSort.call(this, sortBy))
    } else {
      displayedMods.sort(this.optimizerOrder.bind(this))
    }

    if (reRender) {
      this.setState({
        'sortBy': sortBy,
        'tag': displayedMods.length ? tag : '',
        'movingMods': movingMods,
        'displayedMods': displayedMods
      });
    }
  }

  /**
   * Render a modal with a copy-paste-able review of the mods to move
   * @returns Array[JSX Element]
   */
  // TODO: Redux
  reviewModal() {
    return [
      <div key={'summary_modal_content'}>
        <h2>Move Summary</h2>
        <pre id="summary_pre" className={'summary'}>
        {this.summaryListContent()}
        </pre>
        <div className={'actions'}>
          <button type={'button'} onClick={() => this.copySummaryToClipboard()}>
            Copy to Clipboard
          </button>
          <button type={'button'} onClick={() => this.setState({'showSummaryModal': false})}>OK</button>
        </div>
      </div>]
  }

  /**
   * Copies the summary display text into the clipboard
   */
  // TODO: Redux
  copySummaryToClipboard() {
    copyToClipboard(this.summaryListContent());
  };

  // TODO: Redux
  summaryListContent() {
    const capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    let movingMods = this.props.mods.filter(mod => mod.assignTo && mod.currentCharacter !== mod.assignTo);
    movingMods = movingMods.sort((a, b) => a.assignTo.name > b.assignTo.name ?
      1 :
      a.assignTo.name < b.assignTo.name ?
        -1 :
        0);

    let lastModAssign = "";
    let lines = [];
    for (let i = 0; i < movingMods.length; i++) {
      let mod = movingMods[i];
      if (mod.assignTo.name !== lastModAssign) {
        lines.push('');
        lines.push(mod.assignTo.name);
        lastModAssign = mod.assignTo.name;
      }
      lines.push("Move " + capitalize(mod.set.name) + '(' + mod.primaryStat.type + ')' + capitalize(mod.slot) +
        " from " + (mod.currentCharacter ? mod.currentCharacter.name : 'your unassigned mods'));
    }
    return lines.join('\r\n');
  }
}

const mapStateToProps = (state) => {
  const profile = state.profiles[state.allyCode];
  const modsById = groupByKey(profile.mods, mod => mod.id);
  const movingModsByAssignedCharacter = mapObjectByKeyAndValue(
    profile.modAssignments,
    (characterID, modIDs) => modIDs.map(modID => modsById[modID]).filter(mod => mod.characterID !== characterID)
  );
  const characterModPairs = Object.entries(movingModsByAssignedCharacter)
    .map(([characterID, mods]) => mods.map(mod => [characterID, mod]))
    .reduce((mods, chunk) => mods.concat(chunk), []);
  const displayedMods = characterModPairs.slice();

  switch (state.modListFilter.sort) {
    case 'assignedCharacter':
      // If we're sorting by assigned character, then sort in the order that the characters were selected
      // (meaning we don't actually have to change the order at all!)
      break;
    default:
      // Sort by current character if anything else is selected as the sort option
      // When sorting by current character, have unassigned mods show up first, then order the characters by GP
      displayedMods.sort((left, right) => {
        const leftMod = left[1];
        const rightMod = right[1];
        const leftCharacter = leftMod.characterID ? profile.characters[leftMod.characterID] : null;
        const rightCharacter = rightMod.characterID ? profile.characters[rightMod.characterID] : null;

        if (!leftCharacter) {
          return -1;
        } else if (!rightCharacter) {
          return 1;
        } else {
          return leftCharacter.compareGP(rightCharacter);
        }
      });
  }

  /**
   * {{
   *   displayedMods: [[CharacterID, Mod]]
   * }}
   */
  return {
    characters: profile.characters,
    displayedMods: displayedMods,
    numMovingMods: characterModPairs.length
  };
};

const mapDispatchToProps = (dispatch) => ({
  edit: () => dispatch(changeOptimizerView('edit')),
  back: () => dispatch(changeOptimizerView('sets')),
  unequipMod: (modID) => dispatch(unequipMod(modID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);
