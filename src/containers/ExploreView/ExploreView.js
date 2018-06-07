import React from "react";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter'

class ExploreView extends React.Component {

  filterUpdated(){
    this.setState({});
  }

  render() {
    let mods = this.props.mods;
    if(this.filter){
      mods = this.filter.apply_filter(mods);
    }

    const modElements = mods.map(
      (mod) => <ModDetail key={mod.id} mod={mod}/>
    );

    return (
      <div>
        <div className="explore-view-filter">
          <ModFilter
            updated={this.filterUpdated.bind(this)}
            ref={(filter) => {this.filter = filter;}}
          />
        </div>
        <div className='mods'>
          {modElements}
        </div>
      </div>
    );

  }
}

export default ExploreView;
