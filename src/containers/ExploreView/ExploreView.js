import React from "react";
import ModDetail from '../../components/ModDetail/ModDetail';

class ExploreView extends React.Component {
  render() {
    const mods = this.props.mods;

    const modElements = mods.map(
      (mod) => <ModDetail key={mod.id} mod={mod}/>
    );

    return (
      <div className='mods'>
        {modElements}
      </div>
    );

  }
}

export default ExploreView;
