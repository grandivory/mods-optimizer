// @flow

import React from 'react';

import './ModFilter.css';
import ModSet from "../../domain/ModSet";
import setBonuses from "../../constants/setbonuses";
import {connect} from "react-redux";
import {changeModsFilter} from "../../state/actions/explore";
import Pips from "../Pips/Pips";

function importImages(context) {
  let images = {};
  context.keys().forEach((item) => {
    images[item.replace('./', '')] = context(item)
  });
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
class ModFilter extends React.PureComponent {
  /**
   * Render the slot filter inputs
   * @returns {JSX Element}
   */
  slotFilter() {
    const selectAll = (e) => {
      e.preventDefault();
      ModSet.slots.forEach(slot => document.getElementById(`slot-filter-${slot}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      ModSet.slots.forEach(slot => document.getElementById(`slot-filter-${slot}`).checked = false);
    };

    const slots = ModSet.slots.map(slot => {
      const inputName = `slot-filter-${slot}`;

      return <label htmlFor={inputName} key={slot}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={slot}
               defaultChecked={this.props.filter.slot.includes(slot)}/>
        <img src={images[`empty_${slot}.png`]} alt={slot}/>
      </label>
    });

    return <div id={'slot-filters'}>
      <div className={'toggle-label'}>Slot</div>
      <div className={'slots'}>
        {slots}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render the set filter inputs
   * @returns {JSX Element}
   */
  setFilter() {
    const selectAll = (e) => {
      e.preventDefault();
      Object.keys(setBonuses)
        .forEach(set => document.getElementById(`set-filter-${set}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      Object.keys(setBonuses)
        .forEach(set => document.getElementById(`set-filter-${set}`).checked = false);
    };

    const sets = Object.keys(setBonuses).map(set => {
      const inputName = `set-filter-${set}`;

      return <label htmlFor={inputName} key={set}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={set}
               defaultChecked={this.props.filter.set.includes(set)}/>
        <img src={images[`icon_buff_${set}.png`]} alt={set}/>
      </label>
    });

    return <div id={'set-filters'}>
      <div className={'toggle-label'}>Set</div>
      <div className={'sets'}>
        {sets}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render the pips filter inputs
   * @returns {*}
   */
  rarityFilter() {
    const selectAll = (e) => {
      e.preventDefault();
      [1, 2, 3, 4, 5, 6]
        .forEach(rarity => document.getElementById(`pips-filter-${rarity}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      [1, 2, 3, 4, 5, 6]
        .forEach(rarity => document.getElementById(`pips-filter-${rarity}`).checked = false);
    };

    const pips = [6, 5, 4, 3, 2, 1].map(rarity => {
      const inputName = `pips-filter-${rarity}`;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={rarity}
               defaultChecked={this.props.filter.rarity.includes(rarity)}/>
        <span className={'option pips-button'}>
          <Pips pips={rarity}/>
        </span>
      </label>
    });

    return <div id={'pips-filters'}>
      <div className={'toggle-label'}>Rarity</div>
      <div className={'rarity'}>
        {pips}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render the mod tier filter inputs
   * @returns {*}
   */
  tierFilter() {
    const tiers = {
      5: 'gold',
      4: 'purple',
      3: 'blue',
      2: 'green',
      1: 'gray'
    };

    const selectAll = (e) => {
      e.preventDefault();
      Object.keys(tiers)
        .forEach(rarity => document.getElementById(`tier-filter-${rarity}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      Object.keys(tiers)
        .forEach(rarity => document.getElementById(`tier-filter-${rarity}`).checked = false);
    };

    const tierButtons = Object.keys(tiers).sort().reverse().map(tier => {
      const inputName = `tier-filter-${tier}`;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={tier}
               defaultChecked={this.props.filter.tier.includes(tier)}/>
        <span className={`option tier ${tiers[tier]}`}>
          {tiers[tier][0].toUpperCase() + tiers[tier].substr(1)}
        </span>
      </label>
    });

    return <div id={'tier-filters'}>
      <div className={'toggle-label'}>Tier</div>
      <div className={'tier'}>
        {tierButtons}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render the level filter inputs
   * @returns {*}
   */
  levelFilter() {
    const selectAll = (e) => {
      e.preventDefault();
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        .forEach(rarity => document.getElementById(`level-filter-${rarity}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        .forEach(rarity => document.getElementById(`level-filter-${rarity}`).checked = false);
    };

    const levelButtons = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(level => {
      const inputName = `level-filter-${level}`;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={level}
               defaultChecked={this.props.filter.level.includes(level)}/>
        <span className={'option'}>
          {level}
        </span>
      </label>
    });

    return <div id={'level-filters'}>
      <div className={'toggle-label'}>Level</div>
      <div className={'level'}>
        {levelButtons}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  equippedFilter() {
    const selectAll = (e) => {
      e.preventDefault();
      document.getElementById('equipped-filter-equipped').checked = true;
      document.getElementById('equipped-filter-unequipped').checked = true;
    };
    const selectNone = (e) => {
      e.preventDefault();
      document.getElementById('equipped-filter-equipped').checked = false;
      document.getElementById('equipped-filter-unequipped').checked = false;
    };

    const equippedButtons = ['equipped', 'unequipped'].map(equippedState => {
      const inputName = `equipped-filter-${equippedState}`;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={'equipped' === equippedState}
               defaultChecked={this.props.filter.equipped.includes(equippedState)}/>
        <span className={'option'}>
          {equippedState[0].toUpperCase() + equippedState.substr(1)}
        </span>
      </label>
    });

    return <div id={'equipped-filters'}>
      <div className={'toggle-label'}>Equipped</div>
      <div className={'level'}>
        {equippedButtons}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render the primary stat filter inputs, using the given mods as the source of possible values
   * @param mods [Mod] the list of mods being filtered
   * @returns {JSX Element}
   */
  primaryStatFilter(mods) {
    const primaryStats = mods.map(mod => mod.primaryStat.type)
      .reduce((acc, stat) => acc.includes(stat) ? acc : acc.concat([stat]), [])
      .sort();

    const selectAll = (e) => {
      e.preventDefault();
      primaryStats.forEach(stat => document.getElementById(`primary-filter-${stat}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      primaryStats.forEach(stat => document.getElementById(`primary-filter-${stat}`).checked = false);
    };

    const primaries = primaryStats.map(stat => {
      const inputName = `primary-filter-${stat}`;

      return <label htmlFor={inputName} key={stat}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={stat}
               defaultChecked={this.props.filter.primary.includes(stat)}/>
        <span className={'option'}>{stat}</span>
      </label>
    });

    return <div id={'primary-filters'}>
      <div className={'toggle-label'}>Primary Stat</div>
      <div className={'primaries'}>
        {primaries}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render the secondary stat filter inputs, using the given mods as the source of possible values
   * @param mods [Mod] the list of mods being filtered
   * @returns {JSX Element}
   */
  secondaryStatFilter(mods) {
    const secondaryStats = mods.map(mod => mod.secondaryStats)
      .reduce((acc, stats) => acc.concat(stats), [])
      .map(stat => stat.type)
      .reduce((acc, stat) => acc.includes(stat) ? acc : acc.concat([stat]), [])
      .sort();

    const selectAll = (e) => {
      e.preventDefault();
      secondaryStats.forEach(stat => document.getElementById(`secondary-filter-${stat}`).checked = true);
    };
    const selectNone = (e) => {
      e.preventDefault();
      secondaryStats.forEach(stat => document.getElementById(`secondary-filter-${stat}`).checked = false);
    };

    const secondaries = secondaryStats.map(stat => {
      const inputName = `secondary-filter-${stat}`;

      return <label htmlFor={inputName} key={stat}>
        <input type={'checkbox'}
               id={inputName}
               name={inputName}
               value={stat}
               defaultChecked={this.props.filter.secondary.includes(stat)}/>
        <span className={'option'}>{stat}</span>
      </label>
    });

    return <div id={'secondary-filters'}>
      <div className={'toggle-label'}>Secondary Stat</div>
      <div className={'secondaries'}>
        {secondaries}
      </div>
      <div className={'actions'}>
        <button onClick={selectAll}>All</button>
        <button onClick={selectNone}>None</button>
      </div>
    </div>;
  }

  /**
   * Render an input to select what stat to sort by, using the given mods as the source of possible values
   * @param mods [Mod] the list of mods being sorted
   * @returns {JSX Element}
   */
  sortOption(mods) {
    const secondaryStats = mods.map(mod => mod.secondaryStats)
      .reduce((acc, stats) => acc.concat(stats), [])
      .map(stat => stat.type)
      .reduce((acc, stat) => acc.includes(stat) ? acc : acc.concat([stat]), [])
      .sort();

    const sortOptions = secondaryStats.map(stat =>
      <option value={stat} key={stat}>{stat}</option>
    );

    return <div>
      <div className={'toggle-label'}>Sort By:</div>
      <div className={'dropdown'}>
        <select name={'sort-option'} defaultValue={this.props.filter.sort}>
          <option value={''}>default</option>
          <option value={'rolls'}># of Stat Upgrades</option>
          <option value={'character'}>Character</option>
          {sortOptions}
        </select>
      </div>
    </div>;
  }

  /**
   * Reset all filters so that all values are selected
   */
  resetFilters() {
    [...document.getElementById('mod-filters').getElementsByTagName('input')].forEach(element => {
      if ('checkbox' === element.type) {
        element.checked = false;
      }
    });
    [...document.getElementById('mod-filters').getElementsByTagName('select')].forEach(element => {
      element.value = '';
    });
  }

  /**
   * @returns Object an object with keys for 'slot', 'set', 'primary', 'secondary', each containing an
   *                 array of selected values, plus 'sort', containing the value to sort by
   */
  collectFilters(form) {
    const slot = [...form.elements]
      .filter(element => element.id.includes('slot-filter') && element.checked)
      .map(element => element.value);

    const set = [...form.elements]
      .filter(element => element.id.includes('set-filter') && element.checked)
      .map(element => element.value);

    const rarity = [...form.elements]
      .filter(element => element.id.includes('pips-filter') && element.checked)
      .map(element => +element.value);

    const tier = [...form.elements]
      .filter(element => element.id.includes('tier-filter') && element.checked)
      .map(element => +element.value);

    const level = [...form.elements]
      .filter(element => element.id.includes('level-filter') && element.checked)
      .map(element => +element.value);

    const equipped = [...form.elements]
      .filter(element => element.id.includes('equipped-filter') && element.checked)
      .map(element => 'true' === element.value);

    const primary = [...form.elements]
      .filter(element => element.id.includes('primary-filter') && element.checked)
      .map(element => element.value);

    const secondary = [...form.elements]
      .filter(element => element.id.includes('secondary-filter') && element.checked)
      .map(element => element.value);

    return {
      'slot': slot,
      'set': set,
      'rarity': rarity,
      'tier': tier,
      'level': level,
      'equipped': equipped,
      'primary': primary,
      'secondary': secondary,
      'sort': form['sort-option'].value
    }
  }

  render() {
    const mods = this.props.mods;
    const onSubmit = (e) => {
      e.preventDefault();
      this.props.updateFilter(this.collectFilters(e.target))
    };

    return <form className={'mod-filters filter-form'} id={'mod-filters'} onSubmit={onSubmit}>
      <div className={'form-actions'}>
        <button type={'button'} onClick={this.resetFilters}>Reset all filters</button>
        <button type={'submit'}>Apply Filters</button>
      </div>
      {this.slotFilter()}
      {this.setFilter()}
      {this.rarityFilter()}
      {this.tierFilter()}
      {this.levelFilter()}
      {this.equippedFilter()}
      {this.primaryStatFilter(mods)}
      {this.secondaryStatFilter(mods)}
      {this.sortOption(mods)}
      <div className={'form-actions'}>
        <button type={'button'} onClick={this.resetFilters}>Reset all filters</button>
        <button type={'submit'}>Apply Filters</button>
      </div>
    </form>;
  }
}

const mapStateToProps = (state) => ({
  filter: state.modsFilter,
  mods: state.profiles[state.allyCode].mods
});

const mapDispatchToProps = (dispatch) => ({
  updateFilter: (filter) => dispatch(changeModsFilter(filter))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModFilter);
