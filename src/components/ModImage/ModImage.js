// @flow

import React from 'react';
import Pips from '../Pips/Pips';
import './ModImage.css';
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import connect from "react-redux/es/connect/connect";

class ModImage extends React.PureComponent {

  render() {
    const mod = this.props.mod;
    const modColor = this.modColor(mod);
    const extraClass = this.props.className ? ` ${this.props.className}` : '';
    const showAvatar = this.props.showAvatar;
    const character = mod.characterID ? this.props.characters[mod.characterID] : null;

    return (
      <div className={`mod-image dots-${mod.pips} ${mod.slot} ${mod.set.name} ${modColor} ${extraClass}`}>
        <Pips pips={mod.pips}/>
        <div className={'mod-slot-image'} />
        <div className={'mod-level ' + (15 === mod.level ? 'gold ' : 'gray ') + mod.slot}>{mod.level}</div>
        {showAvatar &&
          <CharacterAvatar character={character} displayStars={false} displayGear={false} displayLevel={false}/>
        }
      </div>
    );
  }

  modColor(mod) {
    switch (mod.tier) {
      case 5:
        return 'gold';
      case 4:
        return 'purple';
      case 3:
        return 'blue';
      case 2:
        return 'green';
      default:
        return 'gray';
    }
  }
}

const mapStateToProps = (state) => ({
  characters: state.profiles[state.allyCode].characters
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModImage);
