import React from 'react';
import './CharacterAvatar.css';

function importImages(context) {
  let images = {};
  context.keys().forEach((item) => {images[item.replace('./', '')] = context(item)});

  return images;
}

const character_images = importImages(require.context('./images', false, /\.png/));

class CharacterAvatar extends React.Component {
  render() {
    const character = this.props.character;
    const displayStars = 'undefined' !== typeof this.props.displayStars ? this.props.displayStars : true;
    const imageName = CharacterAvatar.imageName(character.name);
    const id = this.props.id || null;

    if (!character_images[imageName + '.png']) {
      console.log(imageName);
    }

    const star = position => {
      const isActive = position <= character.starLevel;
      const baseClass = isActive ? 'active star' : 'star'
      return <div className={`${baseClass} star-${position}`} key={`star-${position}`}/>;
    };

    return (
      <div className={`avatar gear-${character.gearLevel} star-${character.starLevel}`} id={id}>
        {displayStars &&
          [1,2,3,4,5,6,7].map(star)
        }
        <img src={character_images[imageName + '.png']} alt={character.name} title={character.name} draggable={false} />
      </div>
    );
  }

  static imageName(name) {
    return name.trim().toLowerCase().replace(/\s/g, '_').replace(/["']/g, '');
  }
}

export default CharacterAvatar;
