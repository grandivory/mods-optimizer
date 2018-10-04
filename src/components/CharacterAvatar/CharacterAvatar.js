// @flow

import React from 'react';
import './CharacterAvatar.css';

class CharacterAvatar extends React.Component {
  render() {
    const character = this.props.character;
    const displayStars = 'undefined' !== typeof this.props.displayStars ? this.props.displayStars : true;
    const id = this.props.id || null;

    const star = position => {
      const isActive = position <= character.playerValues.stars;
      const baseClass = isActive ? 'active star' : 'star';
      return <div className={`${baseClass} star-${position}`} key={`star-${position}`}/>;
    };

    return (
      <div
        className={`avatar gear-${character.playerValues.gearLevel} star-${character.playerValues.stars}`}
        id={id}>
        {displayStars &&
          [1,2,3,4,5,6,7].map(star)
        }
        <img
          src={character.gameSettings.avatarUrl}
          alt={character.gameSettings.name}
          title={character.gameSettings.name}
          draggable={false} />
        <div className={'character-level'}>{character.playerValues.level || '??'}</div>
      </div>
    );
  }

  static imageName(name) {
    return name ? name.trim().toLowerCase().replace(/\s/g, '_').replace(/["']/g, '') : '';
  }
}

export default CharacterAvatar;
