// @flow
import React from 'react';
import './ModStats.css';
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import { connect } from "react-redux";
import SellModButton from "../SellModButton/SellModButton";
import { modSecondaryStatScore } from '../../utils/subjectiveScoring'

function printStatRating (score, bonus = 0, forceBlack = false) {
  const total = score + bonus;
  const symbol = (bonus > 0 || forceBlack) ? '★' : '☆';

  switch (true) {
    case total >= 90:
      return symbol.repeat(5);
    case total >= 80:
      return '½' + symbol.repeat(4);
    case total >= 70:
      return symbol.repeat(4);
    case total >= 60:
      return '½' + symbol.repeat(3);
    case total >= 50:
      return symbol.repeat(3);
    case total >= 40:
      return '½' + symbol.repeat(2);
    case total >= 30:
      return symbol.repeat(2);
    case total >= 20:
      return '½' + symbol.repeat(1);
    case total >= 10:
      return symbol.repeat(1);
    case total >= 1:
      return '½';
    default:
      return '⚐';
  }
}

class ModStats extends React.PureComponent {
  render () {
    const mod = this.props.mod;
    const character = mod.characterID ? this.props.characters[mod.characterID] : null;
    const showAvatar = 'showAvatar' in this.props;
    const modStatScore = modSecondaryStatScore(mod);
    const statsDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, modStatScore.statScores[index], index)
      ) : [<li key={0}>None</li>];

    const assignedCharacter = this.props.assignedCharacter;
    const assignedTarget = this.props.assignedTarget;

    return (
      <div className='mod-stats'>
        <h4>Primary Stat</h4>
        <ul>
          <li>{mod.primaryStat.show()}</li>
        </ul>
        <h4>Secondary Stats<br /></h4>
        <ul className='secondary'>
          {statsDisplay}
        </ul>
        <h4 className="mod-rating" title={'Overall Score: ' + modStatScore.overall}>{printStatRating(modStatScore.overall, undefined, true)}</h4>
        {showAvatar && character &&
          <div className={'assigned-character'}>
            <h4>Assigned To</h4>
            <CharacterAvatar character={character} />
            <span className="avatar-name">
              {this.props.gameSettings[character.baseID] ? this.props.gameSettings[character.baseID].name : character.baseID}
            </span>
          </div>
        }
        {showAvatar && <SellModButton mod={mod} />}
        {assignedCharacter && assignedTarget && mod.shouldLevel(assignedTarget) &&
          <h4 className={'gold'}>Level mod to 15!</h4>
        }
        {assignedCharacter && assignedTarget && mod.shouldSlice(assignedCharacter, assignedTarget) &&
          <h4 className={'gold'}>Slice mod to 6E!</h4>
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
  static showStatElement (stat, score, index) {
    return <li key={index} className={'class-' + stat.getClass()}>
      <span className={'rolls'}>({stat.rolls})</span> {stat.show()}
      <span title={'Score: ' + score.score + (score.bonus ? ' + ' + score.bonus : '')} className="stat-rating">{printStatRating(score.score, score.bonus)}</span>
    </li>;
  }

}

const mapStateToProps = (state) => ({
  characters: state.profile.characters,
  gameSettings: state.gameSettings
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModStats);
