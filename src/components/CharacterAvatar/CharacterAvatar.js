// @flow

import React from 'react';
import './CharacterAvatar.css';
import {connect} from "react-redux";
import {GameSettings} from "../../domain/CharacterDataClasses";

class CharacterAvatar extends React.PureComponent {
  render() {
    const character = this.props.character;
    const gameSettings = this.props.gameSettings[character.baseID] ?
      this.props.gameSettings[character.baseID] :
      new GameSettings(character.baseID, character.baseID);

    if (!character) {
      return null;
    }

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
        {displayStars && [1, 2, 3, 4, 5, 6, 7].map(star)}
        <img
          src={gameSettings.avatarUrl}
          alt={gameSettings.name}
          title={gameSettings.name}
          draggable={false}/>
        {displayLevel && <div className={'character-level'}>{character.playerValues.level || '??'}</div>}
      </div>
    );
  }

  static imageName(name) {
    return name ? name.trim().toLowerCase().replace(/\s/g, '_').replace(/["']/g, '') : '';
  }
}

const mapStateToProps = state => ({
  gameSettings: state.gameSettings
});

export default connect(mapStateToProps, () => ({}))(CharacterAvatar);
