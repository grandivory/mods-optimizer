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
    const name = this.props.name;
    const imageName = CharacterAvatar.imageName(name);

    if (!character_images[imageName + '.png']) {
      console.log(imageName);
    }

    return (
      <div className="avatar">
        <img src={character_images[imageName + '.png']} alt={name} title={name}/>
      </div>
    );
  }

  static imageName(name) {
    return name.trim().toLowerCase().replace(/\s/g, '_').replace(/(["']|&amp;#39;)/g, '');
  }
}

export default CharacterAvatar;
