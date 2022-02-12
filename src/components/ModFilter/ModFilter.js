// @flow

import React from 'react';

import './ModFilter.css';
import ModSet from "../../domain/ModSet";
import setBonuses from "../../constants/setbonuses";
import { connect } from "react-redux";
import { changeModsFilter } from "../../state/actions/explore";
import Pips from "../Pips/Pips";
import { Dropdown } from '../Dropdown/Dropdown';

function cycleState(e) {
  e.target.value = e.target.valueAsNumber + 1;
  if (e.target.value > 1) {
    e.target.value = -1;
  }
  e.target.classList.remove('select', 'unselect');
  if (1 === e.target.valueAsNumber) {
    e.target.classList.add('select');
  }
  if (-1 === e.target.valueAsNumber) {
    e.target.classList.add('unselect');
  }
}

function selectElement(element) {
  element.value = 1;
  element.classList.remove('unselect');
  element.classList.add('select');
}

function unselectElement(element) {
  element.value = 0;
  element.classList.remove('select', 'unselect');
}

function classForValue(value) {
  switch (value) {
    case 1: return 'select';
    case -1: return 'unselect';
    default: return '';
  }
}

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
      ModSet.slots.forEach(slot => selectElement(document.getElementById(`slot-filter-${slot}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      ModSet.slots.forEach(slot => unselectElement(document.getElementById(`slot-filter-${slot}`)));
    };

    const slots = ModSet.slots.map(slot => {
      const inputName = `slot-filter-${slot}`;
      const value = this.props.filter.slot[slot] || 0;

      return <label htmlFor={inputName} key={slot}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState}
        />
        <span className={'option-image shape ' + slot} />
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
        .forEach(set => selectElement(document.getElementById(`set-filter-${set}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      Object.keys(setBonuses)
        .forEach(set => unselectElement(document.getElementById(`set-filter-${set}`)));
    };

    const sets = Object.keys(setBonuses).map(set => {
      const inputName = `set-filter-${set}`;
      const value = this.props.filter.set[set] || 0;

      return <label htmlFor={inputName} key={set}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState}
        />
        <span className={'option-image set ' + set} />
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
        .forEach(rarity => selectElement(document.getElementById(`rarity-filter-${rarity}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      [1, 2, 3, 4, 5, 6]
        .forEach(rarity => unselectElement(document.getElementById(`rarity-filter-${rarity}`)));
    };

    const pips = [6, 5, 4, 3, 2, 1].map(rarity => {
      const inputName = `rarity-filter-${rarity}`;
      const value = this.props.filter.rarity[rarity] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState}
        />
        <span className={'option pips-button'}>
          <Pips pips={rarity} />
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
        .forEach(rarity => selectElement(document.getElementById(`tier-filter-${rarity}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      Object.keys(tiers)
        .forEach(rarity => unselectElement(document.getElementById(`tier-filter-${rarity}`)));
    };

    const tierButtons = Object.keys(tiers).sort().reverse().map(tier => {
      const inputName = `tier-filter-${tier}`;
      const value = this.props.filter.tier[tier] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
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
        .forEach(rarity => selectElement(document.getElementById(`level-filter-${rarity}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        .forEach(rarity => unselectElement(document.getElementById(`level-filter-${rarity}`)));
    };

    const levelButtons = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(level => {
      const inputName = `level-filter-${level}`;
      const value = this.props.filter.level[level] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
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
      ['equipped', 'unequipped'].forEach(equipState =>
        selectElement(document.getElementById(`equipped-filter-${equipState}`))
      );

    };
    const selectNone = (e) => {
      e.preventDefault();
      ['equipped', 'unequipped'].forEach(equipState =>
        unselectElement(document.getElementById(`equipped-filter-${equipState}`))
      );
    };

    const equippedButtons = ['equipped', 'unequipped'].map(equipState => {
      const inputName = `equipped-filter-${equipState}`;
      const value = this.props.filter.equipped[equipState] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>
          {equipState[0].toUpperCase() + equipState.substr(1)}
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
      primaryStats.forEach(stat => selectElement(document.getElementById(`primary-filter-${stat}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      primaryStats.forEach(stat => unselectElement(document.getElementById(`primary-filter-${stat}`)));
    };

    const primaries = primaryStats.map(stat => {
      const inputName = `primary-filter-${stat}`;
      const value = this.props.filter.primary[stat] || 0;

      return <label htmlFor={inputName} key={stat}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
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
      secondaryStats.forEach(stat => selectElement(document.getElementById(`secondary-filter-${stat}`)));
    };
    const selectNone = (e) => {
      e.preventDefault();
      secondaryStats.forEach(stat => unselectElement(document.getElementById(`secondary-filter-${stat}`)));
    };

    const secondaries = secondaryStats.map(stat => {
      const inputName = `secondary-filter-${stat}`;
      const value = this.props.filter.secondary[stat] || 0;

      return <label htmlFor={inputName} key={stat}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
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
   * Render filters that will show or hide mods based on whether the optimizer
   * has assigned them to any characters
   */
  optimizerFilter() {
    const selectAll = (e) => {
      e.preventDefault();
      ['assigned', 'unassigned'].forEach(assignedState =>
        selectElement(document.getElementById(`optimizer-filter-${assignedState}`))
      );

    };
    const selectNone = (e) => {
      e.preventDefault();
      ['assigned', 'unassigned'].forEach(assignedState =>
        unselectElement(document.getElementById(`optimizer-filter-${assignedState}`))
      );
    };

    const optimizerButtons = ['assigned', 'unassigned'].map(assignedState => {
      const inputName = `optimizer-filter-${assignedState}`;
      const value = this.props.filter.optimizer[assignedState] || 0;

      return <label htmlFor={inputName} key={inputName}>
        <input type={'number'}
          id={inputName}
          name={inputName}
          defaultValue={value}
          className={classForValue(value)}
          onClick={cycleState} />
        <span className={'option'}>
          {assignedState[0].toUpperCase() + assignedState.substr(1)}
        </span>
      </label>
    });

    return <div id={'optimizer-filters'}>
      <div className={'toggle-label'}>Optimizer Recommendations</div>
      <div className={'level'}>
        {optimizerButtons}
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
      <Dropdown name={'sort-option'} defaultValue={this.props.filter.sort}>
        <option value={''}>default</option>
        <option value={'rolls'}># of Stat Upgrades</option>
        <option value={'offenseScore'}>Offense Score</option>
        <option value={'secondaryStatScore'}>Secondary Stat Score</option>
        <option value={'character'}>Character</option>
        {sortOptions}
      </Dropdown>
    </div>;
  }

  /**
   * Reset all filters so that all values are selected
   */
  resetFilters() {
    [...document.getElementById('mod-filters').getElementsByTagName('input')]
      .forEach(element => unselectElement(element));
    [...document.getElementById('mod-filters').getElementsByTagName('select')].forEach(element => {
      element.value = '';
    });
  }

  /**
   * @returns Object an object with keys for 'slot', 'set', 'primary', 'secondary', each containing an
   *                 array of selected values, plus 'sort', containing the value to sort by
   */
  collectFilters(form) {
    const filters = {};

    [...form.elements].filter(element => element.name.includes('-filter-')).forEach(element => {
      const [filterType, filterKey] = element.name.split('-filter-');
      if (!filters[filterType]) {
        filters[filterType] = {};
      }
      filters[filterType][filterKey] = element.valueAsNumber;
    });

    filters.sort = form['sort-option'].value;

    return filters;
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
      {this.optimizerFilter()}
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
  mods: state.profile.mods
});

const mapDispatchToProps = (dispatch) => ({
  updateFilter: (filter) => dispatch(changeModsFilter(filter))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModFilter);
