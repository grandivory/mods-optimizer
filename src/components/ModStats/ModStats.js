import React from 'react';
import './ModStats.css';

class ModStats extends React.Component {
  render() {
    const mod = this.props.mod;
    const classifier = this.props.classifier;
    const secondaryStats = [
      {'value': mod.secondaryValue_1, 'type': mod.secondaryType_1},
      {'value': mod.secondaryValue_2, 'type': mod.secondaryType_2},
      {'value': mod.secondaryValue_3, 'type': mod.secondaryType_3},
      {'value': mod.secondaryValue_4, 'type': mod.secondaryType_4},
    ];
    const statsDisplay = '' !== secondaryStats[0].value ?
      secondaryStats.map(
        (stat, index) => ModStats.showStatElement(stat, classifier, index)
      ) : [<li key={0}>None</li>, <li key={1}></li>, <li key={2}></li>, <li key={3}></li>];

    return (
      <div className='mod-stats'>
        <h4>Primary Stat</h4>
        <ul>
          <li>{mod.primaryBonusValue} {mod.primaryBonusType}</li>
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
   * @param classifier The stat classifier used to determine the class of a stat
   */
  static showStatElement(stat, classifier, index) {
    if ('' === stat.value) {
      return <li key={index}></li>;
    }

    const displayStat = this.processStatValue(stat.value, stat.type);
    const statClass = classifier.getStatClass(stat.value, stat.type);

    return <li key={index}>{displayStat.value}{displayStat.modifier} {displayStat.category} <span className={'class class-' + statClass}>{statClass}</span></li>;
  }

  /**
   * Given a value and type from the mod export tool, convert to a numeric value, modifier ('%' sign or nothing), and
   * a category
   *
   * @param statValue
   * @param statType
   */
  static processStatValue(statValue, statType) {
    const numericValue = statValue.endsWith('%') ? statValue.substr(0, statValue.length - 1) : statValue;
    const category = statType.endsWith('%') ? statType.substr(0, statType.length - 1) : statType;
    const modifier = statValue.endsWith('%') || statType.endsWith('%') ? '%' : '';

    return {
      'value': numericValue,
      'modifier': modifier,
      'category': category
    };
  }
}

export default ModStats;
