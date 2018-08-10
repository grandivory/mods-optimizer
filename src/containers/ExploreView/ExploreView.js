import React from "react";
import memoize from "memoize-one";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter';

import './ExploreView.css';

class ExploreView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'filter': {}
    };
  }

  getFilteredMods = memoize(
    (mods, filter) => {
      let filteredMods = mods;

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

  filterUpdated(filters) {
    this.setState({
      'filter': filters
    });
  }

  render() {
    const displayedMods = this.getFilteredMods(this.props.mods, this.state.filter);

    const modElements = displayedMods.map(
      (mod) => <ModDetail key={mod.id} mod={mod}/>
    );

    return (
      [
        <div className={'sidebar'} key={'sidebar'}>
          <div className={'filters'} key={'filters'}>
            <ModFilter
              mods={this.props.mods}
              onUpdate={this.filterUpdated.bind(this)}
            />
          </div>
        </div>,
        <div className='mods' key={'mods'}>
          {modElements}
        </div>
      ]
    );
  }

}

export default ExploreView;
