import React from 'react';
import Modal from "../../components/Modal/Modal";

import './ModFilter.css';



function importImages(context) {
  let images = {};
  context.keys().forEach((item) => {images[item.replace('./', '')] = context(item)});
  return images;
}

const images = importImages(require.context('./images', false, /\.png/));


class modFilter extends React.Component {
  constructor(props){
    super(props);
    this.filters = {
      'shape':[
        {'shape':'square', 'checked': true},
        {'shape':'arrow', 'checked': true},
        {'shape':'diamond', 'checked': false},
        {'shape':'triangle', 'checked': false},
        {'shape':'circle', 'checked': false},
        {'shape':'cross', 'checked': true}
      ],
      'set':[
        {'shape':'potency', 'checked': true},
        {'shape':'defense', 'checked': false},
        {'shape':'offense', 'checked': true},
        {'shape':'critchance', 'checked': false},
        {'shape':'critdamage', 'checked': true},
        {'shape':'health', 'checked': false},
        {'shape':'speed', 'checked': false},
        {'shape':'tenacity', 'checked': false}
      ],
      'primary':[
        {'shape':'Speed', 'checked': true},
        {'shape':'Critical Chance', 'checked': true},
        {'shape':'Critical Damage', 'checked': true},
        {'shape':'Potency', 'checked': true},
        {'shape':'Tenacity', 'checked': true},
        {'shape':'Accuracy', 'checked': true},
        {'shape':'Critical Avoidance', 'checked': true},
        {'shape':'Offense', 'checked': true},
        {'shape':'Defense', 'checked': true},
        {'shape':'Health', 'checked': true},
        {'shape':'Protection', 'checked': true},

      ],
      'secondary':[
        {'shape':'Speed', 'checked': true},
        {'shape':'Critical Chance', 'checked': true},
        {'shape':'Potency', 'checked': true},
        {'shape':'Tenacity', 'checked': true},
        {'shape':'Offense', 'checked': true},
        {'shape':'Defense', 'checked': true},
        {'shape':'Health', 'checked': true},
        {'shape':'Protection', 'checked': true},
        {'shape':'Offense %', 'checked': true},
        {'shape':'Defense %', 'checked': true},
        {'shape':'Health %', 'checked': true},
        {'shape':'Protection %', 'checked': true},

      ]
    }

  }

  filter_slots(){

    const toggleCheckbox = function(shape){
      shape.checked = !shape.checked;
      this.setState({});
    }.bind(this);

    return this.filters.shape.map(shape =>
      <div className={'mod-filter-option'} key={shape.shape}>
        <label className={shape.checked?'active':''}>
          <input
            type={'checkbox'}
            defaultChecked={shape.checked}
            onChange={()=>toggleCheckbox(shape)}/>
          <img
            src={images['empty_'+shape.shape+'.png']}
            alt={"Filter "+shape.shape}/>
        </label>
      </div>
    );
  }

  filter_sets(){

    const toggleCheckbox = function(shape){
      shape.checked = !shape.checked;
      this.setState({});
    }.bind(this);

    return this.filters.set.map(set =>
      <div className={'mod-filter-option'} key={set.shape}>
        <label className={set.checked?'active':''}>
          <input
            type={'checkbox'}
            defaultChecked={set.checked}
            onChange={()=>toggleCheckbox(set)}/>
          <img
            src={images['icon_buff_'+set.shape+'.png']}
            alt={"Filter "+set.shape}/>
        </label>
      </div>
    );
  }


  filter_primary() {

    const toggleCheckbox = function (shape) {
      shape.checked = !shape.checked;
      this.setState({});
    }.bind(this);

    const primaries = this.filters.primary;

    const rows = [];
    for (let i = 0; i < primaries.length; i += 4) {
      let row = [];
      row.push(primaries.slice(i, i + 4).map(primary => {
        return (
          <div className={'mod-filter-option'} key={primary.shape}>
            <label className={primary.checked ? 'active' : ''}>
              <input
                type={'checkbox'}
                defaultChecked={primary.checked}
                onChange={() => toggleCheckbox(primary)}/>
              <span> {primary.shape}</span>
            </label>
          </div>
        )
      }));
      rows.push(row);
    }
    return rows.map((row, index)=>
      <div className={'filter-option-row'} key={'primaries-row-'+index}>{row}</div>
    );
  }

  filter_secondary() {
    const toggleCheckbox = function (shape) {
      shape.checked = !shape.checked;
      this.setState({});
    }.bind(this);

    const secondaries = this.filters.secondary;

    const rows = [];
    for (let i = 0; i < secondaries.length; i += 4) {
      let row = [];
      row.push(secondaries.slice(i, i + 4).map(secondary => {
        return (
          <div className={'mod-filter-option'} key={secondary.shape}>
            <label className={secondary.checked ? 'active' : ''}>
              <input
                type={'checkbox'}
                defaultChecked={secondary.checked}
                onChange={() => toggleCheckbox(secondary)}/>
              <span> {secondary.shape}</span>
            </label>
          </div>
        )
      }));
      rows.push(row);
    }
    return rows.map((row, index)=>
      <div className={'filter-option-row'} key={'secondaries-row-'+index}>{row}</div>
    );
  }

  filter_table(){

    return(
      <table>
        <tbody>
        <tr>
          <td>Slots</td>
          <td>{this.filter_slots()}</td>
        </tr>
        <tr>
          <td>Sets</td>
          <td>{this.filter_sets()}</td>
        </tr>
        <tr>
          <td>Primary Stats</td>
          <td><div className={'multi-row'}>{this.filter_primary()}</div></td>
        </tr>
        <tr>
          <td>Secondary Stats</td>
          <td><div className={'multi-row'}>{this.filter_secondary()}</div></td>
        </tr>
        </tbody>
      </table>

    )
  }


  modalContent(){
    const hide = this.props.hide || function(){};
    const save = this.props.updated || function(){};

    return (
      <div className={'mod-filter'}>
        {this.filter_table()}

        <div className={'actions'}>
          <button onClick={hide} className={'red'}>Cancel</button>
          <button onClick={()=>{save(); hide();}}>Apply</button>
        </div>
      </div>
    )
  }


  render() {
    return (
      <Modal show={this.props.show} className={'reset-modal'} content={this.modalContent()} />
    );
  }
}

export default modFilter;
