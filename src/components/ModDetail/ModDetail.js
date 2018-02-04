import React from 'react';

function importImages(context) {
  let images = {};
  context.keys().forEach((item) => {images[item.replace('./', '')] = context(item)});

  return images;
}

const mod_images = importImages(require.context('./images', false, /\.png/));

class ModDetail extends React.Component {

  render() {
    return (
      <div>
        <img src={mod_images[this.modImageName(this.props.mod) + '.png']} alt={this.modImageName(this.props.mod)}/>
      </div>
    );
  }

  modImageName(mod) {
    return mod.set + '_' + mod.slot;
  }
}

export default ModDetail;
