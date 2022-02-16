// @flow
import React from 'react';
import './ModStats.css';
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import { connect } from "react-redux";
import SellModButton from "../SellModButton/SellModButton";
import { modSecondaryStatScore } from '../../utils/subjectiveScoring'

function printStarRating(score, forceBlack = false) {
  const symbol = forceBlack ? '★' : '☆';
  const stars = Math.floor(score / 20);
  const modulus = score % 20;
  return `${modulus >= 15 ? '¾' : modulus >= 10 ? '½' : modulus >= 5 ? '¼' : stars >= 1 ? '' : '∅'}${symbol.repeat(stars)}`;
}

class ModStats extends React.PureComponent {
  render() {
    const mod = this.props.mod;
    const character = mod.characterID ? this.props.characters[mod.characterID] : null;
    const showAvatar = 'showAvatar' in this.props;
    const modStatScore = modSecondaryStatScore(mod);
    const statsDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, modStatScore.statScores[index], modStatScore.bonusIndex, index)
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
        <h4 className="mod-rating" title={`Mod Score: ${modStatScore.modScore} ${(modStatScore.bonusScore > 0 ? ` + ${modStatScore.bonusScore}` : '')} (${modStatScore.totalScore})`}>{printStarRating(modStatScore.modScore, true)}{(modStatScore.badges.length > 0 ? ' + ' + modStatScore.badges.join() : '')}</h4>
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
  static showStatElement(stat, score, bonusIndex, index) {
    return <li key={index} className={'class-' + stat.getClass()}>
      <span className={'rolls'}>({stat.rolls})</span> {stat.show()}
      <span title={'Score: ' + score.score + ' (' + score.percentage + '%)'} className="stat-rating">{printStarRating(score.score, bonusIndex.includes(index))}</span>
    </li>;
  }
}

const mapStateToProps = (state) => ({
  characters: state.profile.characters,
  gameSettings: state.gameSettings
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModStats);
