import React from "react";
import ModDetail from '../../components/ModDetail/ModDetail';
import ModFilter from '../../components/ModFilter/ModFilter'

class ExploreView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'displayFilter': true,
    };
  }
  filterUpdated(){
    this.setState({});
  }
  showFilter(){
    this.setState({'displayFilter': true});
  }
  hideFilter(){
    this.setState({'displayFilter':false})
  }

  render() {
    let mods = this.props.mods;
    if(this.filter){
      const filters= this.filter.filters;
      const filtered_shapes = filters.shape.filter(e=>e.checked).map(e=>e.shape);
      const filtered_sets = filters.set.filter(e=>e.checked).map(e=>e.shape);
      const filtered_primaries = filters.shape.filter(e=>e.checked).map(e=>e.shape);
      const filtered_secondaries = filters.shape.filter(e=>e.checked).map(e=>e.shape);
      console.log(mods);
      console.log(filtered_sets);
      console.log(filters.set);
      mods = mods.filter(e=> filtered_shapes.includes(e.slot))
      mods = mods.filter(e=> filtered_sets.includes(e.set.name))
    }
    const modElements = mods.map(
      (mod) => <ModDetail key={mod.id} mod={mod}/>
    );

    return (
      <div>
        <div className="explore-view-filter">
          <button onClick={this.showFilter.bind(this)}>Mod Filter</button>
        </div>
        <div className='mods'>
          {modElements}
        </div>
        <ModFilter
          show={this.state.displayFilter}
          hide={this.hideFilter.bind(this)}
          updated={this.filterUpdated.bind(this)}
          ref={(filter) => {this.filter = filter;}}
        />
      </div>
    );

  }
}

export default ExploreView;
