import React from 'react';
import ModImage from '../ModImage/ModImage';
import ModStats from '../ModStats/ModStats';
import CharacterAvatar from '../CharacterAvatar/CharacterAvatar';
import './ModDetail.css';

class ModDetail extends React.Component {
  render() {
    const mod = this.props.mod;
    const classifier = this.props.classifier;

    return (
      <div className='mod-detail'>
        <ModImage mod={mod}/>
        <CharacterAvatar name={mod.characterName}/>
        <ModStats mod={mod} classifier={classifier}/>
      </div>
    );
  }
}

export default ModDetail;
