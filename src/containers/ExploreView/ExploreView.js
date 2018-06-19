import React from "react";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter';

import './ExploreView.css';

class ExploreView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'displayedMods': props.mods
    };
  }

  filterUpdated(filters) {
    let displayedMods = this.props.mods
      .filter(mod => filters.slot.includes(mod.slot))
      .filter(mod => filters.set.includes(mod.set.name))
      .filter(mod => filters.primary.includes(mod.primaryStat.displayType))
      .filter(mod => mod.secondaryStats.some(stat => filters.secondary.includes(stat.displayType)));

    if (filters.sort) {
      displayedMods = displayedMods.sort((left, right) => {
        const leftStat = left.secondaryStats.find(stat => stat.displayType === filters.sort);
        const rightStat = right.secondaryStats.find(stat => stat.displayType === filters.sort);

        const leftValue = leftStat ? leftStat.value : 0;
        const rightValue = rightStat ? rightStat.value : 0;

        return rightValue - leftValue;
      });
    }

    this.setState({
      'displayedMods': displayedMods
    });
  }

  render() {
    const modElements = this.state.displayedMods.map(
      (mod) => <ModDetail key={mod.id} mod={mod}/>
    );

    return (
      [
        <div className={'filters'} key={'filters'}>
          <ModFilter
            mods={this.props.mods}
            onUpdate={this.filterUpdated.bind(this)}
          />
        </div>,
        <div className='mods' key={'mods'}>
          {modElements}
        </div>
      ]
    );
  }

}

export default ExploreView;
