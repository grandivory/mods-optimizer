import React from 'react';
import Modal from "../../components/Modal/Modal";

import './ModFilter.css';
import ModSet from "../../domain/ModSet";

function importImages(context) {
  let images = {};
  context.keys().forEach((item) => {images[item.replace('./', '')] = context(item)});
  return images;
}
const images = importImages(require.context('./images', false, /\.png/));

/**
 * --------------------
 * Filter Component
 * --------------------
 * Renders as a button.
 * Clicking the button will display a mod filter modal dialog
 *
 * Properties:
 *  updated: a callback function to call whenever the mod filter is saved
 *
 *  To Use:
 *  Store a reference to the component, ex: ref={(filter) => {this.filter = filter;}}
 *  To get the current filter selections, this.filter.get_filters();
 *  To filter an array of Mod objects, this.filter.apply_filter(mods);
 *
 */
class modFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      'show': false,
    };
    this.filters = modFilter.getDefaultFilter();
  }

  /**
   *
   * @returns An object with four properties (slot, set, primary, secondary) that each
   *            contain a list of strings representing selections for each mod component
   */
  get_filters(){
    const filtered_shapes = this.filters.shape.filter(e=>e.checked).map(e=>e.name);
    const filtered_sets = this.filters.set.filter(e=>e.checked).map(e=>e.name);
    const filtered_primaries = this.filters.primary.filter(e=>e.checked).map(e=>e.name);
    const filtered_secondaries = this.filters.secondary.filter(e=>e.checked).map(e=>e.name);
    return  {
      'slot':filtered_shapes,
      'set': filtered_sets,
      'primary': filtered_primaries,
      'secondary':filtered_secondaries,
    }
  };

  /**
   * @param mods An array of Mod objects
   * @returns An array of Mod objects, filtered using the options selected in the filter
   */
  apply_filter(mods){
    const filters= this.get_filters();
    mods = mods.filter(e=> filters.slot.includes(e.slot));
    mods = mods.filter(e=> filters.set.includes(e.set.name));
    mods = mods.filter(e=> filters.primary.includes(e.primaryStat.displayType));
    if(filters.secondary.length > 0){
      mods = mods.filter(
        e => filters.secondary.every(f=>e.secondaryStats.map(s=>s.type).includes(f))
      );
    }
    return mods;
  }

  static getDefaultFilter() {
    return {
      'shape': [
        {'name': 'square', 'checked': true},
        {'name': 'arrow', 'checked': true},
        {'name': 'diamond', 'checked': true},
        {'name': 'triangle', 'checked': true},
        {'name': 'circle', 'checked': true},
        {'name': 'cross', 'checked': true}
      ],
      'set': [
        {'name': 'potency', 'checked': true},
        {'name': 'defense', 'checked': true},
        {'name': 'offense', 'checked': true},
        {'name': 'critchance', 'checked': true},
        {'name': 'critdamage', 'checked': true},
        {'name': 'health', 'checked': true},
        {'name': 'speed', 'checked': true},
        {'name': 'tenacity', 'checked': true}
      ],
      'primary': [
        {'name': 'Speed', 'checked': true},
        {'name': 'Critical Chance', 'checked': true},
        {'name': 'Critical Damage', 'checked': true},
        {'name': 'Potency', 'checked': true},
        {'name': 'Tenacity', 'checked': true},
        {'name': 'Accuracy', 'checked': true},
        {'name': 'Critical Avoidance', 'checked': true},
        {'name': 'Offense', 'checked': true},
        {'name': 'Defense', 'checked': true},
        {'name': 'Health', 'checked': true},
        {'name': 'Protection', 'checked': true},
      ],
      'secondary': [
        {'name': 'Speed', 'checked': false},
        {'name': 'Critical Chance', 'checked': false},
        {'name': 'Potency', 'checked': false},
        {'name': 'Tenacity', 'checked': false},
        {'name': 'Offense', 'checked': false},
        {'name': 'Defense', 'checked': false},
        {'name': 'Health', 'checked': false},
        {'name': 'Protection', 'checked': false},
        {'name': 'Offense %', 'checked': false},
        {'name': 'Defense %', 'checked': false},
        {'name': 'Health %', 'checked': false},
        {'name': 'Protection %', 'checked': false},
      ]
    }
  }


  toggle_checkbox(toggle){
    toggle.checked = !toggle.checked;
    this.forceUpdate();
  }

  filter_images(elements, img, name){
    const toggleCheckbox = this.toggle_checkbox.bind(this);
    const select_all = ()=> {
      elements.map(e=>e.checked=true);
      this.forceUpdate();
    };
    const select_none = ()=>{
      elements.map(e=>e.checked=false);
      this.forceUpdate();
    };
    const toggles =  elements.map(shape =>
      <div className={'toggle'} key={name+"_"+shape.name}>
        <label className={shape.checked?'active':''}>
          <input
            type={'checkbox'}
            defaultChecked={shape.checked}
            onChange={()=>toggleCheckbox(shape)}/>
          {img &&
          <img
            src={images[img.replace('{}', shape.name)]}
            alt={"Filter " + shape.name}/>
          }
        </label>
      </div>
    );
    const all =(
        <div className={'toggle'} key={name+"_"+'extras'}>
          <label className={'active'}>
            <input type={'button'} onClick={select_all.bind(this)}/>
            <img
              src={images['transparent.png']}
              alt={"Filter All"}/>
            <span>All</span>
          </label>
        </div>);
    const none = (
        <div className={'toggle'} key={name+"_"+'extras'}>
          <label className={'active'}>
            <input type={'button'} onClick={select_none.bind(this)}/>
            <img
              src={images['transparent.png']}
              alt={"Filter None"}/>
            <span>None</span>
          </label>
        </div>
    );
    return <div>{toggles}{all}{none}</div>
  }

  slotFilter() {
    return ModSet.slots.map(slot => <input type={'checkbox'} name={'slot-filter'} value={slot} />);
  }

  filter_text(elements, name) {
    const toggleCheckbox = this.toggle_checkbox.bind(this);
    const select_all = ()=> {
      elements.map(e=>e.checked=true);
      this.forceUpdate();
    };
    const select_none = ()=>{
      elements.map(e=>e.checked=false);
      this.forceUpdate();
    };

    const rows = [];
    // Split up the filter into sets of four, then render each set as a row
    for (let i = 0; i < elements.length; i += 4) {
      let row = [];
      row.push(elements.slice(i, i + 4).map(element => {
        return (
          <div className={'toggle'} key={element.name}>
            <label className={element.checked ? 'active' : ''}>
              <input
                type={'checkbox'}
                defaultChecked={element.checked}
                onChange={() => toggleCheckbox(element)}/>
              <span> {element.name}</span>
            </label>
          </div>
        )
      }));
      rows.push(row);
    }

    const filter_rows = rows.map((row, index)=>
        <div className={'row'} key={'row-'+index+'_'+name}>{row}</div>
    );

    const all =(
      <div className={'toggle'} key={name+"_"+'extras'}>
        <label className={'active'}>
          <input type={'button'} onClick={select_all.bind(this)}/>
          <span>All</span>
        </label>
      </div>);
    const none = (
      <div className={'toggle'} key={name+"_"+'extras'}>
        <label className={'active'}>
          <input type={'button'} onClick={select_none.bind(this)}/>
          <span>None</span>
        </label>
      </div>
    );
    const extras_row = (
      <div className={'row'} key={'extras-row_'+name}>{'secondary' !== name &&all}{none}</div>
    );

    return (
      <div>
        {filter_rows}
        {extras_row}
      </div>
    )

  }

  filter_table(){
    return(
      <table>
        <tbody>
        <tr>
          <td>Slots</td>
          <td>{this.filter_images(this.filters.shape, 'empty_{}.png', 'slot')}</td>
        </tr>
        <tr>
          <td>Sets</td>
          <td>{this.filter_images(this.filters.set, 'icon_buff_{}.png', 'set')}</td>
        </tr>
        <tr>
          <td>Primary Stats</td>
          <td><div className={'multi-row'}>{this.filter_text(this.filters.primary, 'primary')}</div></td>
        </tr>
        <tr>
          <td>Required Secondary Stats</td>
          <td><div className={'multi-row'}>{this.filter_text(this.filters.secondary, 'secondary')}</div></td>
        </tr>
        </tbody>
      </table>

    )
  }

  modalContent(){
    const updated = this.props.updated || function(){};
    const save = ()=>{
      updated();
      this.setState({'show':false});
    };

    const reset = function(){
      // noinspection JSPotentiallyInvalidUsageOfClassThis
      this.filters = modFilter.getDefaultFilter();
      this.forceUpdate();
    };

    return (
      <div className={'mod-filter'}>
        {this.filter_table()}
        <div className={'actions'}>
          <button onClick={()=>this.setState({'show':false})} className={'red'}>Cancel</button>
          <button onClick={reset.bind(this)}>Reset</button>
          <button onClick={save}>Apply</button>
        </div>
      </div>
    )
  }


  render() {
    return <form className={'mod-filters'}>
        <label htmlFor={'slot-filter'}>Slot</label>
        {this.slotFilter()}
      </form>;
      {/*<div>*/}
        {/*{this.modalContent()}*/}
        {/*/!*<button onClick={()=>this.setState({'show':true})}>Mod Filter</button>*!/*/}
        {/*/!*<Modal show={this.state.show} className={'reset-modal'} content={this.modalContent()} />*!/*/}
      {/*</div>*/}
  }
}

export default modFilter;
