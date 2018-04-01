import React from 'react';
import './ModStats.css';

class ModStats extends React.Component {
  render() {
    const mod = this.props.mod;
    const statsDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, index)
      ) : [<li key={0}>None</li>];

    return (
      <div className='mod-stats'>
        <h4>Primary Stat</h4>
        <ul>
          <li>{mod.primaryStat.value}{mod.primaryStat.displayModifier} {mod.primaryStat.displayType}</li>
        </ul>
        <h4>Secondary Stats</h4>
        <ul className='secondary'>
          {statsDisplay}
        </ul>
      </div>
    );
  }

  /**
   * Write out the string to display a stat's value, category, and class
   *
   * @param stat object The stat to display, with 'value' and 'type' fields
   * @param index integer The array index of this stat for this mod
   */
  static showStatElement(stat, index) {
    return <li key={index} className={'class-' + stat.class}>
      {stat.show()}
      <span className='class'>{stat.class}</span>
    </li>;
  }
}

export default ModStats;
