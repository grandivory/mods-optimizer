// @flow
import React from 'react';
import './ModStats.css';
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import { connect } from "react-redux";
import SellModButton from "../SellModButton/SellModButton";
import { modSecondaryStatScore } from '../../utils/subjectiveScoring'

class ModStats extends React.PureComponent {
  render() {
    const mod = this.props.mod;
    const character = mod.characterID ? this.props.characters[mod.characterID] : null;
    const showAvatar = 'showAvatar' in this.props;
    const modStatScore = modSecondaryStatScore(mod);
    const statsDisplay = mod.secondaryStats.length > 0 ?
      mod.secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, modStatScore.statScores[index], modStatScore.bonusIndex.includes(index), index)
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
        <h4
          className="mod-rating"
        >
          <span title={
            `Mod Score: ${modStatScore.modScore}` +
            (modStatScore.bonusScore > 0 ? ` + ${modStatScore.bonusScore} (${modStatScore.totalScore})` : '')}
          >
            {ModStats.printStarRating(modStatScore.modScore, true)}{(modStatScore.badges.length > 0 ? ' + ' : '')}
          </span>
          {ModStats.printBadges(modStatScore.badges)}
        </h4>
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
   * @param score object The score of the stat, with 'value' and 'percentage' fields
   * @param bonus bool True if a stat is met with the bonus requirements
   * @param index integer The array index of this stat for this mod
   */
  static showStatElement(stat, score, bonus, index) {
    return <li key={index} className={'class-' + stat.getClass()}>
      <span className={'rolls'}>({stat.rolls})</span> {stat.show()}
      <span title={'Score: ' + score.score + ' (' + score.percentage + '%)'} className="stat-rating">{ModStats.printStarRating(score.percentage, bonus)}</span>
    </li>;
  }

  /**
   * Write out bonus badges
   *
   * @param {badges} object The badges to display, with 'badge', 'flag', and 'title' fields
   */
  static printBadges(badges) {
    return badges.map((badge, index) =>
      <span key={index} title={badge.title} className={'badge-' + badge.flag}> {badge.badge} </span>
    );
  }

  /**
   * Write out star rating
   *
   * @param {score} number The score to be displayed as stars
   * @param {black} bool Whether to display black or hollow stars
   */
  static printStarRating(score, black = false) {
    const symbol = black ? '★' : '☆';
    const stars = Math.floor(score / 20);
    const modulus = score % 20;
    return `${modulus >= 15 ? '¾' : modulus >= 10 ? '½' : modulus >= 5 ? '¼' : stars >= 1 ? '' : '∅'}${symbol.repeat(stars)}`;
  }
}

const mapStateToProps = (state) => ({
  characters: state.profile.characters,
  gameSettings: state.gameSettings
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModStats);
