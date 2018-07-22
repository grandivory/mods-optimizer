import React from 'react';
import './ModStats.css';
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";

class ModStats extends React.Component {
  render() {
    const mod = this.props.mod;
    console.log(this.props);
    const show_avatar = 'show_avatar' in this.props;
    const statsDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, index)
      ) : [<li key={0}>None</li>];

    return (
      <div className='mod-stats'>
        <h4>Primary Stat</h4>
        <ul>
          <li>{mod.primaryStat.show()}</li>
        </ul>
        <h4>Secondary Stats</h4>
        <ul className='secondary'>
          {statsDisplay}
        </ul>
        {show_avatar && mod.currentCharacter && [
          <h4>Assigned To</h4>,
          <div className='avatar-row'>
            <CharacterAvatar name={mod.currentCharacter.name}/>
            <div className="avatar-name">{mod.currentCharacter.name}</div>
          </div>
          ]}
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
