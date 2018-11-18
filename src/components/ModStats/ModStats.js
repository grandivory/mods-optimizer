// @flow

import React from 'react';
import './ModStats.css';
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import {connect} from "react-redux";

class ModStats extends React.PureComponent {
  render() {
    const mod = this.props.mod;
    const character = mod.characterID ? this.props.characters[mod.characterID] : null;
    const showAvatar = 'showAvatar' in this.props;
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
        {showAvatar && character &&
        <div className={'assigned-character'}>
          <h4>Assigned To</h4>
          <CharacterAvatar character={character}/>
          <span className="avatar-name">{character.gameSettings.name}</span>
        </div>
        }
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
    return <li key={index} className={'class-' + stat.getClass()}>
      <span className={'rolls'}>({stat.rolls})</span> {stat.show()}
    </li>;
  }
}

const mapStateToProps = (state) => ({
  characters: state.profiles[state.allyCode].characters
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModStats);
