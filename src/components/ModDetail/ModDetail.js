// @flow

import React from 'react';
import ModImage from '../ModImage/ModImage';
import ModStats from '../ModStats/ModStats';
import CharacterAvatar from '../CharacterAvatar/CharacterAvatar';
import './ModDetail.css';

class ModDetail extends React.PureComponent {
  render() {
    const mod = this.props.mod;
    const character = this.props.character;

    return (
      <div className='mod-detail'>
        <ModImage mod={mod}/>
        {character &&
        <CharacterAvatar character={character}/>
        }
        <ModStats mod={mod} />
      </div>
    );
  }
}

export default ModDetail;
