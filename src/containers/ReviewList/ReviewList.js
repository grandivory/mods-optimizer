// @flow

import React from 'react';
import ModDetail from "../../components/ModDetail/ModDetail";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import './ReviewList.css';
import Arrow from "../../components/Arrow/Arrow";
import Toggle from "../../components/Toggle/Toggle";
import ModSet from "../../domain/ModSet";
import ModSetView from "../../components/ModSetView/ModSetView";
import copyToClipboard from "../../utils/clipboard"
import {connect} from "react-redux";
import {mapObject, mapObjectByKeyAndValue} from "../../utils/mapObject";
import groupByKey from "../../utils/groupByKey";
import flatten from "../../utils/flatten";
import collectByKey from "../../utils/collectByKey";
import {
  changeModListFilter,
  changeOptimizerView,
  reassignMod,
  reassignMods,
  unequipMod,
  unequipMods
} from "../../state/actions/review";
import {hideModal, showModal} from "../../state/actions/app";
import Sidebar from "../../components/Sidebar/Sidebar";

const sortOptions = {
  'currentCharacter': 'currentCharacter',
  'assignedCharacter': 'assignedCharacter'
};

const viewOptions = {
  'list': 'list',
  'sets': 'sets'
};

class ReviewList extends React.PureComponent {
  render() {
    let modRows;

    const summaryButton = (
      <button type={'button'} className={'small'} onClick={() => this.props.showModal('', this.reviewModal())}>
        Show Summary
      </button>
    );

    switch (this.props.filter.view) {
      case viewOptions.list:
        modRows = this.listView(this.props.displayedMods);
        break;
      case viewOptions.sets:
        modRows = this.setsView(this.props.displayedMods);
        break;
      default:
        throw new Error(`Unknown view type ${this.props.filter.view} - should be one of "list" or "sets"`);
    }

    if (0 === this.props.numMovingMods) {
      return (
        <div className={'review-list'}>
          <Sidebar content={this.sidebarActions()}/>
          <h2>You don't have any mods left to move! Great job!</h2>
          <h3>Don't forget to assign mods to all your pilots!</h3>
        </div>
      )
    } else {
      return (
        <div className={'review-list'}>
          <Sidebar content={this.fullSidebar()}/>
          <h2>Reassigning {this.props.numMovingMods} mods {summaryButton}</h2>
          {(0 < this.props.displayedMods.length) &&
          <div className={'mods-list'}>
            {modRows}
          </div>
          }
          {(0 === this.props.displayedMods.length) &&
          <h3>No more mods to move under that filter. Try a different filter now!</h3>
          }
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
          <button onClick={this.props.reassignMod.bind(this, mod.id, characterID)}>I reassigned this mod</button>
        </div>
      </div>
    });
  }

  /***
   * Convert a list of displayed mods into the renderable elements to display them as sets
   * @param displayedMods array[Mod]
   * @returns array[JSX Element]
   */
  setsView(displayedMods) {
    // Group the displayed mods by character, based on the current sort options
    const modsByCharacter = sortOptions.assignedCharacter === this.props.filter.sort ?
      mapObject(
        collectByKey(this.props.displayedMods, ([characterID, mod]) => characterID),
        assignedModPair => assignedModPair.map(([characterID, mod]) => mod)
      ) :
      mapObject(
        collectByKey(this.props.displayedMods, ([characterID, mod]) => mod.characterID),
        assignedModPair => assignedModPair.map(([characterID, mod]) => mod)
      );

    // Iterate over each character to render a full mod set
    return Object.values(mapObjectByKeyAndValue(modsByCharacter, (characterID, mods) => {
      const character = this.props.characters[characterID];

      if (!character) {
        return null;
      }

      return <div className={'mod-row set'} key={character.baseID}>
        <CharacterAvatar character={character}/>
        <Arrow/>
        <div className={'mod-set-block'}>
          <ModSetView modSet={new ModSet(mods)}
                      diffSet={new ModSet([])}
                      showAvatars={sortOptions.currentCharacter === this.props.filter.sort ? false : true}
                      changeClass={sortOptions.currentCharacter === this.props.filter.sort ? 'remove' : 'add'}
          />
        </div>
        <div className={'actions'}>
          {sortOptions.currentCharacter === this.props.filter.sort &&
          <button onClick={this.props.unequipMods.bind(this, mods.map(mod => mod.id))}>I removed these mods</button>}
          {sortOptions.assignedCharacter === this.props.filter.sort &&
          <button onClick={this.props.reassignMods.bind(this, mods.map(mod => mod.id), characterID)}>
            I reassigned these mods
          </button>}
        </div>
      </div>
    }));
  }

  /**
   * Render a form used to filter and sort the mods displayed on the page
   * @returns JSX Element
   */
  filterForm() {
    const filter = this.props.filter;
    const tagOptions = this.props.tags.map(tag => <option value={tag} key={tag}>{tag}</option>);

    return <div className={'filter-form'}>
      <Toggle inputLabel={'Organize mods by:'}
              leftLabel={'Currently Equipped'}
              leftValue={sortOptions.currentCharacter}
              rightLabel={'Assigned Character'}
              rightValue={sortOptions.assignedCharacter}
              value={filter.sort}
              onChange={sortBy => this.props.changeFilter(Object.assign({}, filter, {sort: sortBy}))}
      />
      <Toggle inputLabel={'Show mods as:'}
              leftLabel={'Sets'}
              leftValue={viewOptions.sets}
              rightLabel={'Individual mods'}
              rightValue={viewOptions.list}
              value={filter.view}
              onChange={viewAs => this.props.changeFilter(Object.assign({}, filter, {view: viewAs}))}
      />
      <label htmlFor={'tag'}>Show characters by tag:</label>
      <div className={'dropdown'}>
        <select id={'tag'}
                value={filter.tag || ''}
                onChange={e => this.props.changeFilter(Object.assign({}, filter, {tag: e.target.value}))}
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
   * Render both the filter form and standard sidebar actions
   * @returns {*[]}
   */
  fullSidebar() {
    return [
      <div className={'filters'}>
        {this.filterForm()}
      </div>,
      this.sidebarActions()
    ];
  }

  /**
   * Render a modal with a copy-paste-able review of the mods to move
   * @returns Array[JSX Element]
   */
  reviewModal() {
    return <div key={'summary_modal_content'}>
      <h2>Move Summary</h2>
      <pre id="summary_pre" className={'summary'}>
        {this.summaryListContent()}
      </pre>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.copySummaryToClipboard()}>
          Copy to Clipboard
        </button>
        <button type={'button'} onClick={this.props.hideModal}>OK</button>
      </div>
    </div>;
  }

  /**
   * Copies the summary display text into the clipboard
   */
  copySummaryToClipboard() {
    copyToClipboard(this.summaryListContent());
  };

  summaryListContent() {
    const capitalize = function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return Object.values(mapObjectByKeyAndValue(this.props.movingModAssignments, (assignedCharacterID, mods) => {
      const assignedCharacter = this.props.characters[assignedCharacterID];

      return [assignedCharacter.gameSettings.name].concat(
        mods.map(mod => {
          const currentCharacter = mod.characterID ? this.props.characters[mod.characterID] : null;
          const moveFrom = currentCharacter ? currentCharacter.gameSettings.name : 'your unassigned mods';
          return `Move ${capitalize(mod.set.name)}(${mod.primaryStat.type}) ${capitalize(mod.slot)} from ${moveFrom}.`;
        })
      ).join('\r\n');
    })).join('\r\n\r\n');
  }
}

const mapStateToProps = (state) => {
  const profile = state.profiles[state.allyCode];
  const modsById = groupByKey(profile.mods, mod => mod.id);
  const movingModsByAssignedCharacter = mapObjectByKeyAndValue(
    profile.modAssignments,
    (characterID, modIDs) => modIDs.map(modID => modsById[modID])
      .filter(mod => mod && mod.characterID !== characterID)
  );
  const characterModPairs = Object.entries(movingModsByAssignedCharacter)
    .map(([characterID, mods]) => mods.map(mod => [characterID, mod]))
    .reduce((mods, chunk) => mods.concat(chunk), []);
  const displayedMods = characterModPairs.slice().filter(([characterID, mod]) => {
    const character = state.modListFilter.sort === sortOptions.assignedCharacter ?
      profile.characters[characterID] :
      profile.characters[mod.characterID];

    return !state.modListFilter.tag || (character && character.gameSettings.tags.includes(state.modListFilter.tag));
  });
  const tags = Array.from(new Set(flatten(
    characterModPairs.map(([characterID, _]) => profile.characters[characterID].gameSettings.tags)
  ))).sort();

  switch (state.modListFilter.sort) {
    case sortOptions.assignedCharacter:
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
    movingModAssignments: movingModsByAssignedCharacter,
    numMovingMods: characterModPairs.length,
    filter: state.modListFilter,
    tags: tags
  };
};

const mapDispatchToProps = (dispatch) => ({
  edit: () => dispatch(changeOptimizerView('edit')),
  back: () => dispatch(changeOptimizerView('sets')),
  changeFilter: (filter) => dispatch(changeModListFilter(filter)),
  unequipMod: (modID) => dispatch(unequipMod(modID)),
  reassignMod: (modID, characterID) => dispatch(reassignMod(modID, characterID)),
  unequipMods: (modIDs) => dispatch(unequipMods(modIDs)),
  reassignMods: (modIDs, characterID) => dispatch(reassignMods(modIDs, characterID)),
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewList);
