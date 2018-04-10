import React from "react";
import ModStats from "../ModStats/ModStats";
import ModImage from "../ModImage/ModImage";

import './ModSetDetail.css';

class ModSetDetail extends React.Component {
  render() {
    const modSet = this.props.set;
    const optimizationPlan = this.props.optimizationPlan;
    const character = this.props.character;

    let modDetails = Object.keys(modSet).filter(slot => null !== modSet[slot]).map(slot => (
      <div className={'mod ' + slot} key={modSet[slot].id}>
        <ModImage mod={modSet[slot]} />
        <ModStats mod={modSet[slot]} />
      </div>
    ));

    const statSummary = modSet.getSummary(character);
    const statsDisplay = Object.values(statSummary).map((stat, index) =>
      <tr key={index}>
        <td className={'stat-type'}>{stat.displayType}</td>
        <td className={'stat-value'}>{stat.showValue()}</td>
      </tr>
    );

    return (
      <div className={'mod-set-detail'}>
        <div className={'mods'}>
          {modDetails}
        </div>
        <div className={'summary'}>
          <table>
            <thead>
              <tr>
                <th colSpan="2">Stats Summary</th>
              </tr>
            </thead>
            <tbody>
              {statsDisplay}
            </tbody>
          </table>
          <div className={'set-value'}>
            Total Value of Set: {modSet.getOptimizationValue(optimizationPlan, character).toFixed(2)}
          </div>
        </div>
      </div>
    );
  }
}

export default ModSetDetail;
