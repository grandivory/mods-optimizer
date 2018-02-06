import React from 'react';
import ModImage from '../ModImage/ModImage';

class ModDetail extends React.Component {
  render() {
    const mod = this.props.mod;

    return (
      <ModImage mod={mod}/>
    );
  }
}

export default ModDetail;
