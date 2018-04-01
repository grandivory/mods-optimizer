import React from "react";
import ModStats from "../ModStats/ModStats";
import ModImage from "../ModImage/ModImage";

class ModSetDetail extends React.Component {
  render() {
    const modSet = this.props.set;
    const character = this.props.character;

    let modDetails = Object.keys(modSet).filter(slot => null !== modSet[slot]).map(slot => (
      <div className={'mod ' + slot} key={modSet[slot].id}>
        <ModImage mod={modSet[slot]} />
        <ModStats mod={modSet[slot]} />
      </div>
    ));

    const statSummary = modSet.getSummary(character);
    const statsDisplay = Object.values(statSummary).map((stat, index) =>
      <li key={index}>{stat.show()}</li>
    );

    return (
      <div className={'mod-set-detail'}>
        <div className={'mods'}>
          {modDetails}
        </div>
        <div className={'summary'}>
          <h4>Stats Summary</h4>
          <ul>
            {statsDisplay}
          </ul>
        </div>
      </div>
    );
  }
}

export default ModSetDetail;
