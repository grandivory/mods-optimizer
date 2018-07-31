import React from "react";

import './ModSetDetail.css';
import ModSetView from "../ModSetView/ModSetView";
import statTypeMap from "../../constants/statTypeMap";
import Stat from "../../domain/Stat";

class ModSetDetail extends React.Component {
  render() {
    const modSet = this.props.set;
    const diffSet = this.props.diffset;
    let diffSummary;
    const character = this.props.character;
    const changeClass = this.props.changeClass || '';

    const statSummary = modSet.getSummary(character, true);
    if (diffSet) {
      diffSummary = diffSet.getSummary(character, true);
    }

    const statsDisplay = Object.values(statSummary).map((stat, index) => {
      let diffStat;

      if (diffSet) {
        diffStat = stat.minus(diffSummary[stat.displayType]);
      }

      const statProperty = statTypeMap[stat.displayType] ? statTypeMap[stat.displayType][0] : '';
      let statValue = character.totalStats[statProperty] + stat.value;

      if (['armor', 'resistance'].includes(statProperty)) {
        // Convert armor and resistance to percent stats
        const baseStat = character.totalStats[statProperty];
        const baseStatValue = 100 * baseStat / (character.level * 7.5 + baseStat);

        statValue = 100 * statValue / (character.level * 7.5 + statValue);

        const statDiff = statValue - baseStatValue;
        stat = new Stat(`${stat.displayType} %`, `${statDiff % 1 ? Math.round(statDiff * 100) / 100 : statDiff}`);
      }

      return <tr key={index}>
        <td className={'stat-type'}>{stat.displayType}</td>
        <td className={'stat-value'}>
          <span className={'total-value'}>
            {statValue % 1 ? statValue.toFixed(2) : statValue}{stat.displayModifier}{' '}
          </span>
          <span className={'mods-value'}>({stat.showValue()})</span>
        </td>
        {diffSet &&
        <td className={'stat-diff' + (diffStat.value > 0 ? ' increase' : diffStat.value < 0 ? ' decrease' : '')}>
          {diffStat.showValue()}
        </td>
        }
      </tr>
    });

    return (
      <div className={'mod-set-detail'}>
        <ModSetView modSet={modSet} changeClass={changeClass} />
        <div className={'summary'}>
          <table>
            <thead>
            <tr>
              <th colSpan={diffSet ? 3 : 2}>Stats Summary</th>
            </tr>
            </thead>
            <tbody>
            {statsDisplay}
            </tbody>
          </table>
        </div>
        <div className={'set-value'}>
          Total Value of Set: {modSet.getOptimizationValue(character).toFixed(2)}
        </div>
      </div>
    );
  }
}

export default ModSetDetail;
