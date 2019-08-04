// @flow

import React from "react";
import ModImage from "../ModImage/ModImage";
import ModStats from "../ModStats/ModStats";

import "./ModSetView.css";

class ModSetView extends React.PureComponent {
  render() {
    const set = this.props.modSet;
    const showAvatars = 'undefined' !== typeof this.props.showAvatars ? this.props.showAvatars : false;

    const assignedCharacter = this.props.assignedCharacter;
    const assignedTarget = this.props.assignedTarget;

    const modDetails = Object.keys(set).filter(slot => null !== set[slot]).map(slot =>
      <div className={'mod ' + slot} key={set[slot].id}>
        {assignedCharacter && assignedTarget && set[slot].shouldLevel(assignedTarget) &&
        <span className={'icon level active'} />
        }
        {assignedCharacter && assignedTarget && set[slot].shouldSlice(assignedCharacter, assignedTarget) &&
        <span className={'icon slice active'} />
        }
        <ModImage
          mod={set[slot]}
          showAvatar={showAvatars}
          className={assignedCharacter && set[slot].characterID === assignedCharacter.baseID ? 'no-move' : ''}
        />
        <ModStats mod={set[slot]} showAvatar assignedCharacter={assignedCharacter}
                  assignedTarget={assignedTarget}/>
      </div>
    );

    return <div className={'mod-set-view'}>
      {modDetails}
    </div>;
  }
}

export default ModSetView;
