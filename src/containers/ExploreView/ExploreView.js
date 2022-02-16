// @flow

import React from "react";
import { hideModal, showModal } from "../../state/actions/app";
import { deleteMods } from "../../state/actions/storage";
import memoize from "memoize-one";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter';

import './ExploreView.css';
import { connect } from "react-redux";
import Sidebar from "../../components/Sidebar/Sidebar";

import { offenseScore, modSecondaryStatScore } from "../../utils/subjectiveScoring";

class ExploreView extends React.PureComponent {
  render () {
    const modElements = this.props.displayedMods.map(mod => {
      const assignedCharacter = this.props.modAssignments[mod.id] ?
        this.props.characters[this.props.modAssignments[mod.id]] :
        null
      return <ModDetail key={mod.id} mod={mod} assignedCharacter={assignedCharacter} showAssigned />;
    });

    return (
      [
        <Sidebar key={'sidebar'} content={ExploreView.sidebar()} />,
        <div className='mods' key={'mods'}>
          <h3>
            Showing {this.props.displayedMods.length} out of {this.props.modCount} mods.&nbsp;
            <button className={'small red'} onClick={() => { this.props.showModal(this.deleteModsModal()) }}>
              Delete All Displayed Mods
            </button>
          </h3>
          {modElements}
        </div>
      ]
    );
  }

  /**
   * Render the "Are you sure?" modal for deleting all displayed mods
   * @returns {*}
   */
  deleteModsModal () {
    return <div>
      <h2>Delete All Displayed Mods</h2>
      <p>
        This will remove all mods displayed under the current filter from the mods optimizer.<br />
        Are you sure you want to delete all of these mods?
      </p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => { this.props.hideModal() }}>No</button>
        <button type={'button'} onClick={() => { this.props.deleteMods(this.props.displayedMods) }} className={'red'}>
          Yes, Delete Mods
        </button>
      </div>
    </div >;

  }

  /**
   * Render the sidebar content
   * @returns {*}
   */
  static sidebar () {
    return <div className={'filters'} key={'filters'}>
      <ModFilter />
    </div>;
  }
}

const getFilteredMods = memoize(
  (mods, filter, characters, modAssignments) => {
    let filteredMods = mods.slice();

    const selectedOptions = {};
    const unselectedOptions = {};

    Object.entries(filter).filter(([type]) => 'sort' !== type).forEach(([type, values]) => {
      selectedOptions[type] = Object.entries(values).filter(([option, value]) => 1 === value)
        .map(([option]) => isNaN(option) ? option : +option);
      unselectedOptions[type] = Object.entries(values).filter(([option, value]) => -1 === value)
        .map(([option]) => isNaN(option) ? option : +option);
    });

    if (selectedOptions.slot.length) {
      filteredMods = filteredMods.filter(mod => selectedOptions.slot.includes(mod.slot));
    }
    if (unselectedOptions.slot.length) {
      filteredMods = filteredMods.filter(mod => !unselectedOptions.slot.includes(mod.slot));
    }
    if (selectedOptions.set.length) {
      filteredMods = filteredMods.filter(mod => selectedOptions.set.includes(mod.set.name));
    }
    if (unselectedOptions.set.length) {
      filteredMods = filteredMods.filter(mod => !unselectedOptions.set.includes(mod.set.name));
    }
    if (selectedOptions.rarity.length) {
      filteredMods = filteredMods.filter(mod => selectedOptions.rarity.includes(mod.pips));
    }
    if (unselectedOptions.rarity.length) {
      filteredMods = filteredMods.filter(mod => !unselectedOptions.rarity.includes(mod.pips));
    }
    if (selectedOptions.tier.length) {
      filteredMods = filteredMods.filter(mod => selectedOptions.tier.includes(mod.tier));
    }
    if (unselectedOptions.tier.length) {
      filteredMods = filteredMods.filter(mod => !unselectedOptions.tier.includes(mod.tier));
    }
    if (selectedOptions.level.length) {
      filteredMods = filteredMods.filter(mod => selectedOptions.level.includes(mod.level));
    }
    if (unselectedOptions.level.length) {
      filteredMods = filteredMods.filter(mod => !unselectedOptions.level.includes(mod.level));
    }
    if (1 === selectedOptions.equipped.length) {
      switch (selectedOptions.equipped[0]) {
        case 'equipped':
          filteredMods = filteredMods.filter(mod => !!mod.characterID);
          break;
        case 'unequipped':
          filteredMods = filteredMods.filter(mod => !mod.characterID);
          break;
        default:
        // Do nothing
      }
    }
    if (1 === unselectedOptions.equipped.length) {
      switch (unselectedOptions.equipped[0]) {
        case 'equipped':
          filteredMods = filteredMods.filter(mod => !mod.characterID);
          break;
        case 'unequipped':
          filteredMods = filteredMods.filter(mod => !!mod.characterID);
          break;
        default:
        // Do nothing
      }
    }
    if (selectedOptions.primary.length) {
      filteredMods = filteredMods.filter(mod => selectedOptions.primary.includes(mod.primaryStat.type));
    }
    if (unselectedOptions.primary.length) {
      filteredMods = filteredMods.filter(mod => !unselectedOptions.primary.includes(mod.primaryStat.type));
    }
    if (selectedOptions.secondary.length) {
      filteredMods = filteredMods.filter(
        mod => mod.secondaryStats.some(stat => selectedOptions.secondary.includes(stat.type))
      );
    }
    if (unselectedOptions.secondary.length) {
      filteredMods = filteredMods.filter(
        mod => mod.secondaryStats.every(stat => !unselectedOptions.secondary.includes(stat.type))
      );
    }
    if (1 === selectedOptions.optimizer.length) {
      switch (selectedOptions.optimizer[0]) {
        case 'assigned':
          filteredMods = filteredMods.filter(mod => Object.keys(modAssignments).includes(mod.id));
          break;
        case 'unassigned':
          filteredMods = filteredMods.filter(mod => !Object.keys(modAssignments).includes(mod.id));
          break;
        default:
        // Do nothing
      }
    }
    if (1 === unselectedOptions.optimizer.length) {
      switch (unselectedOptions.optimizer[0]) {
        case 'assigned':
          filteredMods = filteredMods.filter(mod => !Object.keys(modAssignments).includes(mod.id));
          break;
        case 'unassigned':
          filteredMods = filteredMods.filter(mod => Object.keys(modAssignments).includes(mod.id));
          break;
        default:
        // Do nothing
      }
    }

    switch (filter.sort) {
      case 'rolls':
        filteredMods = filteredMods.sort((left, right) => {
          const leftValue = left.secondaryStats.reduce((acc, stat) => acc + stat.rolls, 0);
          const rightValue = right.secondaryStats.reduce((acc, stat) => acc + stat.rolls, 0);

          return rightValue - leftValue;
        });
        break;
      case 'offenseScore':
        filteredMods = filteredMods.sort((left, right) => {
          const leftValue = offenseScore(left);
          const rightValue = offenseScore(right);

          return rightValue - leftValue;
        });
        break;
      case 'secondaryStatScore':
        filteredMods = filteredMods.sort((left, right) => {
          const leftValue = modSecondaryStatScore(left).totalScore;
          const rightValue = modSecondaryStatScore(right).totalScore;

          return rightValue - leftValue;
        });
        break;
      case 'character':
        filteredMods = filteredMods.sort((left, right) => {
          const leftChar = left.characterID ? characters[left.characterID] : null;
          const rightChar = right.characterID ? characters[right.characterID] : null;

          if (leftChar && rightChar) {
            return leftChar.compareGP(rightChar);
          } else if (leftChar) {
            return -1;
          } else if (rightChar) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      case '': break;
      default:
        filteredMods = filteredMods.sort((left, right) => {
          const leftStat = left.secondaryStats.find(stat => stat.type === filter.sort);
          const rightStat = right.secondaryStats.find(stat => stat.type === filter.sort);

          const leftValue = leftStat ? leftStat.value : 0;
          const rightValue = rightStat ? rightStat.value : 0;

          return rightValue - leftValue;
        });
    }

    return filteredMods;
  }
);

const mapStateToProps = (state) => {
  const profile = state.profile;
  const modAssignments = profile.modAssignments && profile.modAssignments.filter ?
    profile.modAssignments
      .filter(x => null !== x)
      .reduce((acc, { id: characterID, assignedMods: modIds }) => {
        const updatedAssignments = { ...acc };
        modIds.forEach(id => updatedAssignments[id] = characterID)
        return updatedAssignments;
      }, {}) :
    {};
  const mods = getFilteredMods(
    profile.mods,
    state.modsFilter,
    profile.characters,
    modAssignments
  );

  return {
    characters: profile.characters,
    displayedMods: mods,
    modAssignments: modAssignments,
    modCount: profile.mods.length
  };
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (content) => dispatch(showModal('', content)),
  hideModal: () => dispatch(hideModal()),
  deleteMods: (mods) => { dispatch(deleteMods(mods)); dispatch(hideModal()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExploreView);
