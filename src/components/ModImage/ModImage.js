import React from 'react';
import Pips from '../Pips/Pips';
import './ModImage.css';

function importImages(context) {
  let images = {};
  context.keys().forEach((item) => {images[item.replace('./', '')] = context(item)});

  return images;
}

const mod_images = importImages(require.context('./images', false, /\.png/));

class ModDetail extends React.Component {

  render() {
    const mod = this.props.mod;
    const modImageName = this.modImageName(mod);
    const modColor = this.modColor(mod);

    return (
      <div className='mod-image'>
        <Pips pips={mod.pips} />
        <img src={mod_images[modImageName + '.png']} alt={modImageName} />
        <div className={'mod-level ' + modColor}>{mod.level}</div>
      </div>
    );
  }

  modImageName(mod) {
    return mod.set + '_' + mod.slot;
  }

  modColor(mod) {
    if ('' !== mod.secondaryType_4) {
      return 'gold';
    } else if ('' !== mod.secondaryType_3) {
      return 'purple';
    } else if ('' !== mod.secondaryType_2) {
      return 'blue';
    } else if ('' !== mod.secondaryType_1) {
      return 'green';
    } else {
      return 'gray';
    }
  }
}

export default ModDetail;
