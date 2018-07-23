import React from "react";
import ModImage from "../ModImage/ModImage";
import ModStats from "../ModStats/ModStats";

import "./ModSetView.css";

class ModSetView extends React.Component {
  render() {
    const set = this.props.modSet;
    const changeClass = this.props.changeClass;

    const modDetails = Object.keys(set).filter(slot => null !== set[slot]).map(slot =>
      <div className={'mod ' + slot} key={set[slot].id}>
        <ModImage
          className={set[slot].currentCharacter !== set[slot].assignTo ? changeClass : ''}
          mod={set[slot]}/>
        <ModStats mod={set[slot]} showAvatar />
      </div>
    );

    return <div className={'mod-set-view'}>
      {modDetails}
    </div>;
  }
}

export default ModSetView;
