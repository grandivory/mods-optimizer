// @flow

import React from "react";
import memoize from "memoize-one";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter';

import './ExploreView.css';
import {connect} from "react-redux";
import Sidebar from "../../components/Sidebar/Sidebar";

class ExploreView extends React.PureComponent {
  render() {
    const modElements = this.props.displayedMods.map(mod => {
      const character = mod.characterID ? this.props.characters[mod.characterID] : null;
      return <ModDetail key={mod.id} mod={mod} character={character}/>;
    });

    return (
      [
        <Sidebar content={this.sidebar()} />,
        <div className='mods' key={'mods'}>
          <h3>Showing {this.props.displayedMods.length} out of {this.props.modCount} mods.</h3>
          {modElements}
        </div>
      ]
    );
  }

  /**
   * Render the sidebar content
   * @returns {*}
   */
  sidebar() {
    return <div className={'filters'} key={'filters'}>
      <ModFilter/>
    </div>;
  }
}

const getFilteredMods = memoize(
  (mods, filter) => {
    let filteredMods = mods.slice();

    if (filter.slot && 0 < filter.slot.length) {
      filteredMods = filteredMods.filter(mod => filter.slot.includes(mod.slot));
    }
    if (filter.set && 0 < filter.set.length) {
      filteredMods = filteredMods.filter(mod => filter.set.includes(mod.set.name));
    }
    if (filter.rarity && 0 < filter.rarity.length) {
      filteredMods = filteredMods.filter(mod => filter.rarity.includes(mod.pips));
    }
    if (filter.tier && 0 < filter.tier.length) {
      filteredMods = filteredMods.filter(mod => filter.tier.includes(mod.tier));
    }
    if (filter.level && 0 < filter.level.length) {
      filteredMods = filteredMods.filter(mod => filter.level.includes(mod.level));
    }
    if (filter.primary && 0 < filter.primary.length) {
      filteredMods = filteredMods.filter(mod => filter.primary.includes(mod.primaryStat.type));
    }
    if (filter.secondary && 0 < filter.secondary.length) {
      filteredMods = filteredMods.filter(
        mod => mod.secondaryStats.some(stat => filter.secondary.includes(stat.type)));
    }

    if (filter.sort) {
      if ('rolls' === filter.sort) {
        filteredMods = filteredMods.sort((left, right) => {
          const leftValue = left.secondaryStats.reduce((acc, stat) => acc + stat.rolls, 0);
          const rightValue = right.secondaryStats.reduce((acc, stat) => acc + stat.rolls, 0);

          return rightValue - leftValue;
        })
      } else {
        filteredMods = filteredMods.sort((left, right) => {
          const leftStat = left.secondaryStats.find(stat => stat.type === filter.sort);
          const rightStat = right.secondaryStats.find(stat => stat.type === filter.sort);

          const leftValue = leftStat ? leftStat.value : 0;
          const rightValue = rightStat ? rightStat.value : 0;

          return rightValue - leftValue;
        });
      }
    }

    return filteredMods;
  }
);

const mapStateToProps = (state) => {
  const profile = state.profiles[state.allyCode];
  const mods = getFilteredMods(profile.mods, state.modsFilter);

  return {
    characters: profile.characters,
    displayedMods: mods,
    modCount: profile.mods.length
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExploreView);
