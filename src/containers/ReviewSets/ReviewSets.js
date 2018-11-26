// @flow

import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import Arrow from "../../components/Arrow/Arrow";
import ModSet from "../../domain/ModSet";
import ModSetDetail from "../../components/ModSetDetail/ModSetDetail";

import './ReviewSets.css';
import Toggle from "../../components/Toggle/Toggle";
import Credits from "../../components/Credits/Credits";
import {connect} from "react-redux";
import {mapObject, mapObjectByKeyAndValue} from "../../utils/mapObject";
import objectFromEntries from "../../utils/objectFromEntries";
import collectByKey from "../../utils/collectByKey";
import groupByKey from "../../utils/groupByKey";
import {changeModSetFilter, changeOptimizerView} from "../../state/actions/review";
import Sidebar from "../../components/Sidebar/Sidebar";

// A map from number of pips that a mod has to the cost to remove (but not destroy) it
const modRemovalCosts = {
  1: 550,
  2: 1050,
  3: 1900,
  4: 3000,
  5: 4750,
  6: 8000
};

// A map from number of pips to a map from current mod level to the total cost to upgrade the mod to level 15
const modUpgradeCosts = {
  5: {
    1: 248400,
    2: 244950,
    3: 241500,
    4: 238050,
    5: 234600,
    6: 229950,
    7: 224300,
    8: 218500,
    9: 210500,
    10: 200150,
    11: 189800,
    12: 162200,
    13: 126550,
    14: 90900,
    15: 0
  },
  4: {
    1: 128700,
    2: 126900,
    3: 124200,
    4: 121500,
    5: 118800,
    6: 116100,
    7: 113400,
    8: 110700,
    9: 106200,
    10: 100800,
    11: 95400,
    12: 81000,
    13: 64800,
    14: 46800,
    15: 0
  },
  3: {
    1: 73200,
    2: 72000,
    3: 70800,
    4: 69600,
    5: 67800,
    6: 66000,
    7: 64200,
    8: 62400,
    9: 60000,
    10: 57000,
    11: 54000,
    12: 45600,
    13: 35400,
    14: 24000,
    15: 0
  },
  2: {
    1: 28800,
    2: 28050,
    3: 27300,
    4: 26550,
    5: 25800,
    6: 24675,
    7: 23550,
    8: 22425,
    9: 21300,
    10: 19800,
    11: 18300,
    12: 16500,
    13: 12700,
    14: 8200,
    15: 0
  },
  1: {
    1: 13400,
    2: 13050,
    3: 12700,
    4: 12350,
    5: 12000,
    6: 11475,
    7: 10950,
    8: 10425,
    9: 9900,
    10: 9200,
    11: 8500,
    12: 7625,
    13: 5875,
    14: 3775,
    15: 0
  }
};

class ReviewSets extends React.PureComponent {
  render() {
    const modsByCharacter = collectByKey(this.props.mods, mod => mod.characterID);

    const movingMods = Object.values(
      mapObjectByKeyAndValue(this.props.modAssignments, (characterID, mods) =>
        mods.filter(mod => mod.characterID !== characterID)
      )
    ).reduce((allMods, characterMods) => allMods.concat(characterMods), []);

    const modsBeingRemoved = this.props.mods.filter(mod => // The mod is currently equipped
      mod.characterID &&
      (
        // The mod is being equipped on another character
        movingMods.includes(mod) ||
        // The character is equipping a different mod in that slot
        (this.props.modAssignments.hasOwnProperty(mod.characterID) &&
          !this.props.modAssignments[mod.characterID].includes(mod))
      )
    );

    // Get a count of how much it will cost to move the mods. It only costs money to remove mods
    const modRemovalCost = modsBeingRemoved.reduce((cost, mod) => cost + modRemovalCosts[mod.pips], 0);

    const modsBeingUpgraded = Object.entries(this.props.modAssignments)
      .filter(([characterID, mods]) => this.props.characters[characterID].optimizerSettings.target.upgradeMods)
      .map(([characterID, mods]) => mods.filter(mod => 15 !== mod.level && 5 <= mod.pips))
      .reduce((allMods, characterMods) => allMods.concat(characterMods), []);

    const modUpgradeCost = modsBeingUpgraded.reduce((cost, mod) => cost + modUpgradeCosts[mod.pips][mod.level], 0);

    // Create sets for everything each character already has equipped
    const rows = Object.values(mapObjectByKeyAndValue(this.props.modAssignments, (characterID, mods) => {
      const character = this.props.characters[characterID];
      const currentSet = new ModSet(modsByCharacter[characterID] || []);
      const newSet = new ModSet(mods);

      return (
        <div className={'set-row'} key={characterID}>
          <ModSetDetail
            changeClass={'remove'}
            set={currentSet}
            diffset={newSet}
            showStatDiff={false}
            showAvatars={false}
            character={character}/>
          <CharacterAvatar character={character}/>
          <Arrow/>
          <ModSetDetail
            changeClass={'add'}
            set={newSet}
            diffset={currentSet}
            showStatDiff={true}
            showAvatars={true}
            character={character}/>
        </div>
      );
    }));

    const formatNumber = number => number.toLocaleString(navigator.language, {'useGrouping': true});

    if (0 === this.props.numOptimizedCharacters) {
      return [
        <Sidebar key={'sidebar'} content={this.sidebar()}/>,
        <div key={'content'} className={'review-sets'}>
          <h2>You haven't selected any characters! Go back and select characters to optimize.</h2>
        </div>
      ];
    } else {
      const subHeading = 0 < modUpgradeCost ?
        <h3>
          Your mods will cost {formatNumber(modRemovalCost)} <Credits/> to move,
          and an additional {formatNumber(modUpgradeCost)} <Credits/> to level up to 15.
        </h3> :
        <h3>
          Your mods will cost {formatNumber(modRemovalCost)} <Credits/> to move
        </h3>

      return [
        <Sidebar key={'sidebar'} content={this.sidebar()}/>,
        <div key={'content'} className={'review-sets'}>
          <h2>
            Showing mod sets for {this.props.numShownCharacters} out of {this.props.numOptimizedCharacters} characters
          </h2>
          {subHeading}
          <div className={'sets-list'}>
            {rows}
          </div>
        </div>
      ];
    }
  }

  /**
   * Render a form used to filter the sets displayed on the page
   * @returns JSX Element
   */
  filterForm() {
    return <div className={'filter-form'}>
      <Toggle inputLabel={'Show me:'}
              leftLabel={'Changing sets'}
              leftValue={'move'}
              rightLabel={'All sets'}
              rightValue={'all'}
              value={this.props.modSetsFilter}
              onChange={this.props.updateFilter}
      />
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
      <button
        type={'button'}
        onClick={this.props.back}
      >
        Change my selection
      </button>
      <h3>Looks good!</h3>
      <button
        type={'button'}
        onClick={this.props.next}
      >
        Show me the mods to move
      </button>
    </div>
  }

  /**
   * Render all the sidebar content for this page
   * @returns {array<*>}
   */
  sidebar() {
    return [
      <div className={'filters'}>
        {this.filterForm()}
      </div>,
      this.sidebarActions()
    ];
  }
}

const mapStateToProps = (state) => {
  const profile = state.profiles[state.allyCode];
  const modsByID = groupByKey(profile.mods, mod => mod.id);

  const modAssignments = mapObject(
    profile.modAssignments,
    modIDs => modIDs.filter(modID => modsByID.hasOwnProperty(modID)).map(modID => modsByID[modID])
  );

  const displayedModAssignments = 'all' === state.modSetsFilter ?
    modAssignments :
    objectFromEntries(
      Object.entries(modAssignments).filter(
        ([characterID, mods]) => mods.some(mod => mod.characterID !== characterID))
    );

  return {
    characters: profile.characters,
    mods: profile.mods,
    modSetsFilter: state.modSetsFilter,
    modAssignments: displayedModAssignments,
    numShownCharacters: Object.keys(displayedModAssignments).length,
    numOptimizedCharacters: Object.keys(profile.modAssignments).length
  };
};

const mapDispatchToProps = (dispatch) => ({
  back: () => dispatch(changeOptimizerView('edit')),
  next: () => dispatch(changeOptimizerView('mods')),
  updateFilter: (filterValue) => dispatch(changeModSetFilter(filterValue))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewSets);
