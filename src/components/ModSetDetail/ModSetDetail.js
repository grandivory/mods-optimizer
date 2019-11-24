// @flow

import React from "react";

import './ModSetDetail.css';
import ModSetView from "../ModSetView/ModSetView";
import statTypeMap from "../../constants/statTypeMap";
import Stat from "../../domain/Stat";
import { mapObject } from "../../utils/mapObject";

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

    // Pull all the player's stats into an object that can be displayed without further calculation.
    const playerStats = mapObject(statSummary, stat => {
      const diffStat = diffSummary && diffSummary[stat.displayType] ? stat.minus(diffSummary[stat.displayType]) : null;

      if (!character.playerValues.equippedStats || !stat) {
        return {
          name: stat.displayType,
          recommendedValue: null,
          diffStat: diffStat
        };
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

      return {
        name: stat.displayType,
        displayModifier: stat.displayModifier,
        currentValue: originalStatValue,
        currentStat: originalStat,
        recommendedValue: statValue,
        recommendedStat: stat,
        diffStat: diffStat
      };
    });

    // Add effective health and average damage to the stats display
    this.addCalculatedStatsToPlayerValues(playerStats);

    const statsDisplay = Object.values(playerStats).map((stat, index) => {
      if (stat.recommendedValue == null) {
        return <tr key={index}>
          <td className={'stat-type'}>{stat.name}</td>
          <td className={'stat-value'}>???(???)</td>
          {stat.diffStat &&
            <td className={'stat-diff' +
              (stat.diffStat.value > 0 ? ' increase' : stat.diffStat.value < 0 ? ' decrease' : '')
            }>
              {stat.diffStat.showValue()}
            </td>
          }
        </tr>;
      }

      const optimizationValue = stat.recommendedStat ? stat.recommendedStat.getOptimizationValue(character, target) : 0;

      return <tr key={index}>
        <td className={'stat-type'}>{stat.name}</td>
        {stat.diffStat &&
          <td className={'stat-value'}>
            <span className={'total-value'}>
              {stat.currentValue % 1 ? stat.currentValue.toFixed(2) : stat.currentValue}
              {stat.displayModifier}{' '}
            </span>
            {stat.currentStat &&
              <span className={'mods-value'}>({stat.currentStat.showValue()})</span>
            }
          </td>
        }
        <td className={'stat-value'}>
          <span className={'total-value'}>
            {stat.recommendedValue % 1 ? stat.recommendedValue.toFixed(2) : stat.recommendedValue}
            {stat.displayModifier}{' '}
          </span>
          {stat.recommendedStat &&
            <span className={'mods-value'}>({stat.recommendedStat.showValue()})</span>
          }
        </td>
        {stat.diffStat &&
          <td className={'stat-diff' +
            (stat.diffStat.value > 0 ? ' increase' : stat.diffStat.value < 0 ? ' decrease' : '')
          }>
            {stat.diffStat.showValue()}
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
    const valueChange = ((100 * setValue / diffSetValue) - 100).toFixed(2);

    return (
      <div className={'mod-set-detail'}>
        <ModSetView modSet={modSet} showAvatars={showAvatars} assignedCharacter={this.props.assignedCharacter}
          assignedTarget={this.props.assignedTarget} />
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

  addCalculatedStatsToPlayerValues(playerValues) {
    const currentStats = {};
    const recommendedStats = {};

    Object.values(playerValues).forEach(stat => {
      switch (stat.name) {
        case 'Health':
          currentStats['health'] = stat.currentValue;
          recommendedStats['health'] = stat.recommendedValue;
          break;
        case 'Protection':
          currentStats['protection'] = stat.currentValue;
          recommendedStats['protection'] = stat.recommendedValue;
          break;
        case 'Armor':
          currentStats['armor'] = stat.currentValue;
          recommendedStats['armor'] = stat.recommendedValue;
          break;
        case 'Resistance':
          currentStats['resistance'] = stat.currentValue;
          recommendedStats['resistance'] = stat.recommendedValue;
          break;
        case 'Physical Damage':
          currentStats['physDamage'] = stat.currentValue;
          recommendedStats['physDamage'] = stat.recommendedValue;
          break;
        case 'Physical Critical Chance':
          currentStats['physCritChance'] = stat.currentValue;
          recommendedStats['physCritChance'] = stat.recommendedValue;
          break;
        case 'Special Damage':
          currentStats['specDamage'] = stat.currentValue;
          recommendedStats['specDamage'] = stat.recommendedValue;
          break;
        case 'Special Critical Chance':
          currentStats['specCritChance'] = stat.currentValue;
          recommendedStats['specCritChance'] = stat.recommendedValue;
          break;
        case 'Critical Damage':
          currentStats['critDamage'] = stat.currentValue;
          recommendedStats['critDamage'] = stat.recommendedValue;
          break;
      }
    })

    const currentEffectiveHealthPhysical =
      (currentStats.health + currentStats.protection) / (currentStats.armor / 100);
    const recommendedEffectiveHealthPhysical =
      (recommendedStats.health + recommendedStats.protection) / (recommendedStats.armor / 100);
    const currentEffectiveHealthSpecial =
      (currentStats.health + currentStats.protection) / (currentStats.resistance / 100);
    const recommendedEffectiveHealthSpecial =
      (recommendedStats.health + recommendedStats.protection) / (recommendedStats.resistance / 100);
    const currentAverageDamagePhysical = currentStats.physDamage *
      ((1 - (currentStats.physCritChance / 100)) +
        (currentStats.critDamage / 100) * (currentStats.physCritChance / 100)
      );
    const recommendedAverageDamagePhysical = recommendedStats.physDamage *
      ((1 - (recommendedStats.physCritChance / 100)) +
        (recommendedStats.critDamage / 100) * (recommendedStats.physCritChance / 100)
      );
    const currentAverageDamageSpecial = currentStats.specDamage *
      ((1 - (currentStats.specCritChance / 100)) +
        (currentStats.critDamage / 100) * (currentStats.specCritChance / 100)
      );
    const recommendedAverageDamageSpecial = recommendedStats.specDamage *
      ((1 - (recommendedStats.specCritChance / 100)) +
        (recommendedStats.critDamage / 100) * (recommendedStats.specCritChance / 100)
      );

    const statObject = (name, currentValue, recommendedValue) => ({
      name: name,
      displayModifier: '',
      currentValue: Math.floor(currentValue),
      currentStat: null,
      recommendedValue: Math.floor(recommendedValue),
      recommendedStat: null,
      diffStat: new Stat(name, `${Math.floor(recommendedValue - currentValue)}`)
    });

    playerValues['Effective Health (physical)'] = statObject(
      'Effective Health (physical)',
      currentEffectiveHealthPhysical,
      recommendedEffectiveHealthPhysical
    );
    playerValues['Effective Health (special)'] = statObject(
      'Effective Health (special)',
      currentEffectiveHealthSpecial,
      recommendedEffectiveHealthSpecial
    );
    playerValues['Average Damage (physical)'] = statObject(
      'Average Damage (physical)',
      currentAverageDamagePhysical,
      recommendedAverageDamagePhysical
    );
    playerValues['Average Damage (special)'] = statObject(
      'Average Damage (special)',
      currentAverageDamageSpecial,
      recommendedAverageDamageSpecial
    );
  }
}

export default ModSetDetail;
