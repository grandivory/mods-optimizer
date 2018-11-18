// @flow

import React from 'react';
import './CharacterAvatar.css';

class CharacterAvatar extends React.PureComponent {
  render() {
    const character = this.props.character;
    const displayStars = 'undefined' !== typeof this.props.displayStars ? this.props.displayStars : true;
    const displayGear = 'undefined' !== typeof this.props.displayGear ? this.props.displayGear : true;
    const displayLevel = 'undefined' !== typeof this.props.displayLevel ? this.props.displayLevel : true;
    const id = this.props.id || null;
    const className = `avatar gear-${displayGear ?
      character.playerValues.gearLevel :
      0} star-${character.playerValues.stars}`;

    const star = position => {
      const isActive = position <= character.playerValues.stars;
      const baseClass = isActive ? 'active star' : 'star';
      return <div className={`${baseClass} star-${position}`} key={`star-${position}`}/>;
    };

    return (
      <div
        className={className}
        id={id}>
        {displayStars &&
        [1, 2, 3, 4, 5, 6, 7].map(star)
        }
        <img
          src={character.gameSettings.avatarUrl}
          alt={character.gameSettings.name}
          title={character.gameSettings.name}
          draggable={false}/>
        {displayLevel && <div className={'character-level'}>{character.playerValues.level || '??'}</div>}
      </div>
    );
  }

  static imageName(name) {
    return name ? name.trim().toLowerCase().replace(/\s/g, '_').replace(/["']/g, '') : '';
  }
}

export default CharacterAvatar;
