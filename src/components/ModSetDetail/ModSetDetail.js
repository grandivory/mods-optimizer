import React from "react";
import ModStats from "../ModStats/ModStats";
import ModImage from "../ModImage/ModImage";

import './ModSetDetail.css';

class ModSetDetail extends React.Component {
  render() {
    const modSet = this.props.set;
    const diffSet = this.props.diffset;
    let diffSummary;
    const character = this.props.character;
    const changeClass = this.props.changeClass || '';

    let modDetails = Object.keys(modSet).filter(slot => null !== modSet[slot]).map(slot => (
      <div className={'mod ' + slot} key={modSet[slot].id}>
        <ModImage
          className={modSet[slot].currentCharacter !== modSet[slot].assignTo ? changeClass : ''}
          mod={modSet[slot]}/>
        <ModStats mod={modSet[slot]}/>
      </div>
    ));

    const statSummary = modSet.getSummary(character);
    if (diffSet) {
      diffSummary = diffSet.getSummary(character);
    }

    const statsDisplay = Object.values(statSummary).map((stat, index) => {
      let diffStat;

      if (diffSet) {
        diffStat = stat.minus(diffSummary[stat.displayType]);
      }

      return <tr key={index}>
        <td className={'stat-type'}>{stat.displayType}</td>
        <td className={'stat-value'}>{stat.showValue()}</td>
        {diffSet &&
        <td className={'stat-diff' + (diffStat.value > 0 ? ' increase' : diffStat.value < 0 ? ' decrease' : '')}>
          {diffStat.showValue()}
        </td>
        }
      </tr>
    });

    return (
      <div className={'mod-set-detail'}>
        <div className={'mods'}>
          {modDetails}
        </div>
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
          <div className={'set-value'}>
            Total Value of Set: {modSet.getOptimizationValue(character).toFixed(2)}
          </div>
        </div>
      </div>
    );
  }
}

export default ModSetDetail;
