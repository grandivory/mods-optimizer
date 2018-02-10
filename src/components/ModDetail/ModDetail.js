import React from 'react';
import ModImage from '../ModImage/ModImage';
import ModStats from '../ModStats/ModStats';
import './ModDetail.css';

class ModDetail extends React.Component {
  render() {
    const mod = this.props.mod;
    const classifier = this.props.classifier;

    return (
      <div className='mod-detail'>
        <ModImage mod={mod}/>
        <ModStats mod={mod} classifier={classifier}/>
      </div>
    );
  }
}

export default ModDetail;
