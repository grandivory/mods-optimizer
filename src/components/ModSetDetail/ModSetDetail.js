// @flow

import React from "react";

import './ModSetDetail.css';
import ModSetView from "../ModSetView/ModSetView";
import statTypeMap from "../../constants/statTypeMap";
import Stat from "../../domain/Stat";

class ModSetDetail extends React.PureComponent {
  render() {
    const modSet = this.props.set;
    const diffSet = this.props.diffset;
    const character = this.props.character;
    const target = this.props.target;
    const showAvatars = 'undefined' !== typeof this.props.showAvatars ? this.props.showAvatars : false;
    const useUpgrades = this.props.useUpgrades;

    const statSummary = modSet.getSummary(character, target, useUpgrades);
    const diffSummary = diffSet ? diffSet.getSummary(character, target, false) : null;

    const statsDisplay = Object.values(statSummary).map((stat, index) => {
      const diffStat = diffSummary && diffSummary[stat.displayType] ? stat.minus(diffSummary[stat.displayType]) : null;

      if (!character.playerValues.equippedStats || !stat) {
        return <tr key={index}>
          <td className={'stat-type'}>{stat.displayType}</td>
          <td className={'stat-value'}>???(???)</td>
          {diffStat &&
          <td className={'stat-diff' + (diffStat.value > 0 ? ' increase' : diffStat.value < 0 ? ' decrease' : '')}>
            {diffStat.showValue()}
          </td>
          }
        </tr>;
      }

      const statProperty = statTypeMap[stat.displayType] ? statTypeMap[stat.displayType][0] : '';
      let statValue = character.playerValues.equippedStats[statProperty] + stat.value;

      let originalStat = diffSummary[stat.displayType];
      let originalStatValue = diffStat ? character.playerValues.equippedStats[statProperty] + originalStat.value : null;

      if (['armor', 'resistance'].includes(statProperty)) {
        // Convert armor and resistance to percent stats
        const baseStat = character.playerValues.equippedStats[statProperty];
        const baseStatValue = 100 * baseStat / (character.playerValues.level * 7.5 + baseStat);

        statValue = 100 * statValue / (character.playerValues.level * 7.5 + statValue);

        const statIncrease = statValue - baseStatValue;
        stat = new Stat(
          `${stat.displayType} %`,
          `${statIncrease % 1 ? Math.round(statIncrease * 100) / 100 : statIncrease}`
        );

        if (originalStat) {
          originalStatValue = 100 * originalStatValue / (character.playerValues.level * 7.5 + originalStatValue);
          const originalStatIncrease = originalStatValue - baseStatValue;
          originalStat = new Stat(
            `${stat.displayType} %`,
            `${originalStatIncrease % 1 ? Math.round(originalStatIncrease * 100) / 100 : originalStatIncrease}`
          );
        }
      }

      const optimizationValue = stat.getOptimizationValue(character, target);

      return <tr key={index}>
        <td className={'stat-type'}>{stat.displayType}</td>
        {diffStat &&
        <td className={'stat-value'}>
          <span className={'total-value'}>
            {originalStatValue % 1 ?
              originalStatValue.toFixed(2) :
              originalStatValue}
            {diffStat.displayModifier}{' '}
          </span>
          <span className={'mods-value'}>({originalStat.showValue()})</span>
        </td>
        }
        <td className={'stat-value'}>
          <span className={'total-value'}>
            {statValue % 1 ? statValue.toFixed(2) : statValue}{stat.displayModifier}{' '}
          </span>
          <span className={'mods-value'}>({stat.showValue()})</span>
        </td>
        {diffStat &&
        <td className={'stat-diff' + (diffStat.value > 0 ? ' increase' : diffStat.value < 0 ? ' decrease' : '')}>
          {diffStat.showValue()}
        </td>
        }
        <td className={'optimizer-value ' +
        (optimizationValue > 0 ? 'increase' : optimizationValue < 0 ? 'decrease' : '')}>
          {optimizationValue.toFixed(2)}
        </td>
      </tr>;
    });

    const diffSetValue = diffSet ? diffSet.getOptimizationValue(character, target, false) : null;
    const setValue = modSet.getOptimizationValue(character, target, useUpgrades);
    const valueChange = ((100 * setValue/diffSetValue) - 100).toFixed(2);

    return (
      <div className={'mod-set-detail'}>
        <ModSetView modSet={modSet} showAvatars={showAvatars}/>
        <div className={'summary'}>
          <table>
            <thead>
            <tr>
              <th colSpan={diffSet ? 5 : 4}>Stats Summary</th>
            </tr>
            <tr>
              <th></th>
              <th>Current</th>
              <th>Recommended</th>
              <th>Change</th>
              <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {statsDisplay}
            </tbody>
          </table>
        </div>
        <div className={'set-value'}>
          {diffSet && <div>Previous Set Value: {diffSetValue.toFixed(2)}</div>}
          <div>
            Total Value of Set: {modSet.getOptimizationValue(character, target, useUpgrades).toFixed(2)}
          </div>
          {diffSet &&
          <div>Value Change:&nbsp;
            <span className={valueChange > 0 ? 'increase' : valueChange < 0 ? 'decrease' : ''}>
              {valueChange}%
            </span>
          </div>}
        </div>
      </div>
    );
  }
}

export default ModSetDetail;
