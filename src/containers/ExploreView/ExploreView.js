// @flow

import React from "react";
import memoize from "memoize-one";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter';

import './ExploreView.css';
import {connect} from "react-redux";

class ExploreView extends React.PureComponent {
  render() {
    const modElements = this.props.displayedMods.map(mod => {
      const character = mod.characterID ? this.props.characters[mod.characterID] : null;
      return <ModDetail key={mod.id} mod={mod} character={character}/>;
    });

    return (
      [
        <div className={'sidebar'} key={'sidebar'}>
          <div className={'filters'} key={'filters'}>
            <ModFilter/>
          </div>
        </div>,
        <div className='mods' key={'mods'}>
          {modElements}
        </div>
      ]
    );
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
    if (filter.primary && 0 < filter.primary.length) {
      filteredMods = filteredMods.filter(mod => filter.primary.includes(mod.primaryStat.displayType));
    }
    if (filter.secondary && 0 < filter.secondary.length) {
      filteredMods = filteredMods.filter(
        mod => mod.secondaryStats.some(stat => filter.secondary.includes(stat.displayType)));
    }

    if (filter.sort) {
      filteredMods = filteredMods.sort((left, right) => {
        const leftStat = left.secondaryStats.find(stat => stat.displayType === filter.sort);
        const rightStat = right.secondaryStats.find(stat => stat.displayType === filter.sort);

        const leftValue = leftStat ? leftStat.value : 0;
        const rightValue = rightStat ? rightStat.value : 0;

        return rightValue - leftValue;
      });
    }

    return filteredMods;
  }
);

const mapStateToProps = (state) => {
  const profile = state.profiles[state.allyCode];
  const mods = getFilteredMods(profile.mods, state.modsFilter);

  return {
    characters: profile.characters,
    displayedMods: mods
  }
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExploreView);
