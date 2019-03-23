// @flow

import React from "react";
import ModImage from "../ModImage/ModImage";
import ModStats from "../ModStats/ModStats";

import "./ModSetView.css";

class ModSetView extends React.PureComponent {
  render() {
    const set = this.props.modSet;
    const showAvatars = 'undefined' !== typeof this.props.showAvatars ? this.props.showAvatars : false;

    const modDetails = Object.keys(set).filter(slot => null !== set[slot]).map(slot =>
      <div className={'mod ' + slot} key={set[slot].id}>
        <ModImage
          mod={set[slot]}
          showAvatar={showAvatars}
        />
        <ModStats mod={set[slot]} showAvatar/>
      </div>
    );

    return <div className={'mod-set-view'}>
      {modDetails}
    </div>;
  }
}

export default ModSetView;
