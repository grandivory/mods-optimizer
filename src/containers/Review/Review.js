// @flow

import React from 'react';
import ModDetail from "../../components/ModDetail/ModDetail";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";

import './Review.css';
import Arrow from "../../components/Arrow/Arrow";
import Toggle from "../../components/Toggle/Toggle";
import ModSet from "../../domain/ModSet";
import ModSetView from "../../components/ModSetView/ModSetView";
import copyToClipboard from "../../utils/clipboard"
import { mapObjectByKeyAndValue } from "../../utils/mapObject";
import groupByKey from "../../utils/groupByKey";
import collectByKey from "../../utils/collectByKey";
import {
  changeModListFilter,
  changeOptimizerView,
  reassignMod,
  reassignMods,
  unequipMod,
  unequipMods
} from "../../state/actions/review";
import { hideModal, showModal } from "../../state/actions/app";
import Sidebar from "../../components/Sidebar/Sidebar";
import ModSetDetail from "../../components/ModSetDetail/ModSetDetail";
import flatten from "../../utils/flatten";
import { connect } from "react-redux";
import Credits from "../../components/Credits/Credits";
import OptimizationPlan from "../../domain/OptimizationPlan";
import { saveAs } from 'file-saver';
import Help from "../../components/Help/Help"

const sortOptions = {
  'currentCharacter': 'currentCharacter',
  'assignedCharacter': 'assignedCharacter'
};

const viewOptions = {
  'list': 'list',
  'sets': 'sets'
};

const showOptions = {
  'upgrades': 'upgrades',
  'change': 'change',
  'all': 'all'
};

// A map from number of pips that a mod has to the cost to remove it
const modRemovalCosts = {
  1: 550,
  2: 1050,
  3: 1900,
  4: 3000,
  5: 4750,
  6: 8000
};

// A map from number of pips to a map from current mod level to the total cost to upgrade the mod to level 15
const modUpgradeCosts = {
  5: {
    1: 248400,
    2: 244950,
    3: 241500,
    4: 238050,
    5: 234600,
    6: 229950,
    7: 224300,
    8: 218500,
    9: 210500,
    10: 200150,
    11: 189800,
    12: 162200,
    13: 126550,
    14: 90900,
    15: 0
  },
  4: {
    1: 128700,
    2: 126900,
    3: 124200,
    4: 121500,
    5: 118800,
    6: 116100,
    7: 113400,
    8: 110700,
    9: 106200,
    10: 100800,
    11: 95400,
    12: 81000,
    13: 64800,
    14: 46800,
    15: 0
  },
  3: {
    1: 73200,
    2: 72000,
    3: 70800,
    4: 69600,
    5: 67800,
    6: 66000,
    7: 64200,
    8: 62400,
    9: 60000,
    10: 57000,
    11: 54000,
    12: 45600,
    13: 35400,
    14: 24000,
    15: 0
  },
  2: {
    1: 28800,
    2: 28050,
    3: 27300,
    4: 26550,
    5: 25800,
    6: 24675,
    7: 23550,
    8: 22425,
    9: 21300,
    10: 19800,
    11: 18300,
    12: 16500,
    13: 12700,
    14: 8200,
    15: 0
  },
  1: {
    1: 13400,
    2: 13050,
    3: 12700,
    4: 12350,
    5: 12000,
    6: 11475,
    7: 10950,
    8: 10425,
    9: 9900,
    10: 9200,
    11: 8500,
    12: 7625,
    13: 5875,
    14: 3775,
    15: 0
  }
};

class Review extends React.PureComponent {
  render() {
    let modRows;

    const summaryButton = (
      <button type={'button'} className={'small'} onClick={() => this.props.showModal('', this.reviewModal())}>
        Show Summary
      </button>
    );

    switch (this.props.filter.view) {
      case viewOptions.list:
        modRows = this.listView(this.props.displayedMods);
        break;
      default:
        modRows = this.setsView(this.props.displayedMods);
    }

    const formatNumber = number => number.toLocaleString(navigator.language, { 'useGrouping': true });

    const subheading = 0 < this.props.modUpgradeCost ?
      <h3>
        Your mods will cost {formatNumber(this.props.modRemovalCost)} <Credits /> to move,
        and an additional {formatNumber(this.props.modUpgradeCost)} <Credits /> to level up to 15.
      </h3> :
      <h3>
        Your mods will cost {formatNumber(this.props.modRemovalCost)} <Credits /> to move
      </h3>;

    if (0 === this.props.numMovingMods) {
      return <div className={'review-list'}>
        <Sidebar content={this.sidebarActions()} />
        <h2>You don't have any mods left to move! Great job!</h2>
        <h3>Don't forget to assign mods to all your pilots!</h3>
      </div>;
    } else {
      return (
        <div className={'review-list'}>
          <Sidebar content={this.fullSidebar()} />
          <h2>Reassigning {this.props.numMovingMods} mods {summaryButton}</h2>
          {subheading}
          {(0 < this.props.displayedMods.length) &&
            <div className={'mods-list'}>
              {modRows}
            </div>
          }
          {(0 === this.props.displayedMods.length) &&
            <h3>No more mods to move under that filter. Try a different filter now!</h3>
          }
        </div>
      );
    }
  }

  /**
   * Convert a list of displayed mods into the renderable elements to display them as a list of individual mods
   * @param displayedMods {Array<Object>}
   * @returns {Array<*>}
   */
  listView(displayedMods) {
    let individualMods = flatten(displayedMods.map(({ id, target, assignedMods }) =>
      assignedMods.map(mod => ({ id: id, target: target, mod: mod }))
    ));

    if (sortOptions.currentCharacter === this.props.filter.sort) {
      individualMods.sort(({ mod: leftMod }, { mod: rightMod }) => {
        const leftCharacter = leftMod.characterID ? this.props.characters[leftMod.characterID] : null;
        const rightCharacter = rightMod.characterID ? this.props.characters[rightMod.characterID] : null;

        if (!leftCharacter) {
          return -1;
        } else if (!rightCharacter) {
          return 1;
        } else {
          return leftCharacter.compareGP(rightCharacter) || ModSet.slotSort(leftMod, rightMod);
        }
      });

      if (this.props.filter.tag) {
        individualMods = individualMods.filter(({ mod }) => {
          const tags = this.props.gameSettings[mod.characterID] ? this.props.gameSettings[mod.characterID].tags : [];
          return tags.includes(this.props.filter.tag);
        });
      }
    } else if (this.props.filter.tag) {
      individualMods = individualMods.filter(({ id, mod }) => {
        const tags = this.props.gameSettings[id] ? this.props.gameSettings[id].tags : [];
        return tags.includes(this.props.filter.tag);
      });
    }


    return individualMods.map(({ id: characterID, target, mod }) => {
      const character = this.props.characters[characterID];

      return <div className={'mod-row individual'} key={mod.id}>
        <ModDetail mod={mod} assignedCharacter={character} assignedTarget={target} />
        <div className={'character-id'}>
          <Arrow />
          <CharacterAvatar character={character} />
          <h3>
            {this.props.gameSettings[character.baseID] ?
              this.props.gameSettings[character.baseID].name :
              character.baseID}
          </h3>
          <h4>{target.name}</h4>
        </div>
        <div className={'actions'}>
          <button onClick={this.props.unequipMod.bind(this, mod.id)}>I removed this mod</button>
          <button onClick={this.props.reassignMod.bind(this, mod.id, characterID)}>I reassigned this mod</button>
        </div>
      </div>;
    });
  }

  /***
   * Convert a list of displayed mods into the renderable elements to display them as sets
   * @param modAssignments {array<Object>} An array of objects containing `id`, `target`, and `assignedMods` keys
   * @returns array[JSX Element]
   */
  setsView(modAssignments) {
    // Iterate over each character to render a full mod set
    return modAssignments.map(({ id: characterID, target, assignedMods: mods }, index) => {
      const character = this.props.characters[characterID];

      if (!character) {
        return null;
      }

      return <div className={'mod-row set'} key={index}>
        <div className={'character-id'}>
          <CharacterAvatar character={character} />
          <Arrow />
          <h3>
            {this.props.gameSettings[characterID] ? this.props.gameSettings[characterID].name : characterID}
          </h3>
          {target &&
            <h4>{target.name}</h4>
          }
          <div className={'actions'}>
            {sortOptions.currentCharacter === this.props.filter.sort &&
              <button onClick={this.props.unequipMods.bind(this, mods.map(mod => mod.id))}>I removed these mods</button>}
            {sortOptions.assignedCharacter === this.props.filter.sort &&
              <button onClick={this.props.reassignMods.bind(this, mods.map(mod => mod.id), characterID)}>
                I reassigned these mods
            </button>}
          </div>
        </div>
        {sortOptions.assignedCharacter === this.props.filter.sort &&
          <ModSetDetail
            set={new ModSet(mods)}
            diffset={new ModSet(this.props.currentModsByCharacter[characterID] || [])}
            showAvatars={sortOptions.currentCharacter !== this.props.filter.sort}
            character={character}
            target={target}
            useUpgrades={true}
            assignedCharacter={character}
            assignedTarget={target}
          />}
        {sortOptions.currentCharacter === this.props.filter.sort &&
          <div className={'mod-set-block'}>
            <ModSetView modSet={new ModSet(mods)}
              showAvatars={sortOptions.currentCharacter !== this.props.filter.sort}
            />
          </div>
        }
      </div>;
    });
  }

  /**
   * Render a form used to filter and sort the mods displayed on the page
   * @returns JSX Element
   */
  filterForm() {
    const filter = this.props.filter;
    const tagOptions = this.props.tags.map(tag => <option value={tag} key={tag}>{tag}</option>);

    return <div className={'filter-form'}>
      <Toggle inputLabel={'Organize mods by:'}
        leftLabel={'Currently Equipped'}
        leftValue={sortOptions.currentCharacter}
        rightLabel={'Assigned Character'}
        rightValue={sortOptions.assignedCharacter}
        value={filter.sort}
        onChange={sortBy => this.props.changeFilter(Object.assign({}, filter, { sort: sortBy }))}
      />
      <Toggle inputLabel={'Show mods as:'}
        leftLabel={'Sets'}
        leftValue={viewOptions.sets}
        rightLabel={'Individual mods'}
        rightValue={viewOptions.list}
        value={filter.view}
        onChange={viewAs => this.props.changeFilter(Object.assign({}, filter, { view: viewAs }))}
      />
      <label htmlFor={'show'}>Show me:</label>
      <div className={'dropdown'}>
        <select id={'show'}
          value={filter.show}
          onChange={e => this.props.changeFilter(Object.assign({}, filter, { show: e.target.value }))}
        >
          <option value={showOptions.all}>All assignments</option>
          <option value={showOptions.change}>Changing characters</option>
          <option value={showOptions.upgrades}>Mod Upgrades</option>
        </select>
      </div>
      <label htmlFor={'tag'}>Show characters by tag:</label>
      <div className={'dropdown'}>
        <select id={'tag'}
          value={filter.tag || ''}
          onChange={e => this.props.changeFilter(Object.assign({}, filter, { tag: e.target.value }))}
        >
          <option value={''}>All</option>
          {tagOptions}
        </select>
      </div>
    </div>;
  }

  /**
   * Renders a sidebar box with action buttons
   *
   * @returns JSX Element
   */
  sidebarActions() {
    function hotUtilsExport() {
      // Save the results to a file
      const exportObject = {
        'allyCode': this.props.allyCode,
        'modAssignments': this.props.assignedMods
          .filter(x => null !== x)
          .filter(({ id }) => this.props.characters[id].playerValues.level >= 50)
          .map(({ id, assignedMods, target }) => ({
            id: id,
            assignedMods: assignedMods,
            target: target.name
          }))
      };
      const serializedExport = JSON.stringify(exportObject);
      const exportBlob = new Blob([serializedExport], { type: 'application/json;charset=utf-8' });
      saveAs(exportBlob, `hotUtils-${(new Date()).toISOString().slice(0, 10)}.json`);
    }

    return <div className={'sidebar-actions'} key={'sidebar-actions'}>
      <h3>I don't like these results...</h3>
      <button type={'button'} onClick={this.props.edit}>
        Change my selection
      </button>
      <hr />
      <button type={'button'} onClick={hotUtilsExport.bind(this)}>
        Export for HotUtils
      </button>
      <Help header={'What is HotUtils?'}>
        {this.hotUtilsHelp()}
      </Help>
    </div>
  }

  /**
   * Render both the filter form and standard sidebar actions
   * @returns {*[]}
   */
  fullSidebar() {
    return [
      <div className={'filters'} key={'filters'}>
        {this.filterForm()}
      </div>,
      this.sidebarActions()
    ];
  }

  /**
   * Render a modal with a copy-paste-able review of the mods to move
   * @returns Array[JSX Element]
   */
  reviewModal() {
    return <div key={'summary_modal_content'}>
      <h2>Move Summary</h2>
      <pre id="summary_pre" className={'summary'}>
        {this.summaryListContent()}
      </pre>
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.copySummaryToClipboard()}>
          Copy to Clipboard
        </button>
        <button type={'button'} onClick={this.props.hideModal}>OK</button>
      </div>
    </div>;
  }

  /**
   * Copies the summary display text into the clipboard
   */
  copySummaryToClipboard() {
    copyToClipboard(this.summaryListContent());
  }

  summaryListContent() {
    const capitalize = function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return this.props.movingModAssignments.map(({ id, target, assignedMods: mods }) => {
      const assignedCharacter = this.props.characters[id];
      const characterName = this.props.gameSettings[assignedCharacter.baseID] ?
        this.props.gameSettings[assignedCharacter.baseID].name :
        assignedCharacter.baseID;


      return [
        `${characterName} - ${target.name}`
      ].concat(
        mods.map(mod => {
          const moveFrom = mod.characterID ? this.props.gameSettings[mod.characterID].name : 'your unassigned mods';
          return `Move ${capitalize(mod.set.name)}(${mod.primaryStat.type}) ${capitalize(mod.slot)} from ${moveFrom}.`;
        })
      ).join('\r\n');
    }).join('\r\n\r\n');
  }

  hotUtilsHelp() {
    return <div className={'help'}>
      <p>
        HotUtils is another tool for SWGOH that allows you to directly modify your game account. By importing the
        recommendation from Grandivory's Mods Optimizer, you can instantly rearrange mods in-game and create profiles
        that you can switch back-and-forth between quickly.
      </p>
      <p>
        <strong>Use at your own risk!</strong> HotUtils functionality breaks the terms of service for Star Wars:
        Galaxy of Heroes. You assume all risk in using this tool. Grandivory's Mods Optimizer is not associated with
        HotUtils.
      </p>
      <p><a href={'https://www.hotutils.app/'} target={'_blank'} rel={'noopener'}>https://www.hotutils.app/</a></p>
      <p><img className={'fit'} src={'/img/hotsauce512.png'} alt={'hotsauce'} /></p>
    </div>;
  }
}

const mapStateToProps = (state) => {
  const profile = state.profile;
  const filter = state.modListFilter;
  const modsById = groupByKey(profile.mods, mod => mod.id);
  const modAssignments = profile.modAssignments.filter(x => null !== x).map(({ id, target, assignedMods }) => ({
    id: id,
    target: target,
    assignedMods: assignedMods ? assignedMods.map(id => modsById[id]).filter(mod => !!mod) : []
  }));

  const currentModsByCharacter = collectByKey(profile.mods, mod => mod.characterID);
  const numMovingMods = modAssignments.reduce((count, { id, assignedMods }) =>
    assignedMods.filter(mod => mod.characterID !== id).length + count
    , 0
  );

  let displayedMods;
  let tags;
  switch (filter.view) {
    case viewOptions.list:
      if (showOptions.upgrades === filter.show) {
        // If we're showing mods as a list and showing upgrades, show any upgraded mod, no matter if it's moving or not
        displayedMods = modAssignments.map(({ id, target, assignedMods }) => ({
          id: id,
          target: target,
          assignedMods:
            assignedMods.filter(mod => mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target))
        })).filter(({ assignedMods }) => assignedMods.length > 0);

      } else {
        // If we're not showing upgrades, then only show mods that aren't already assigned to that character
        displayedMods = modAssignments.map(({ id, target, assignedMods }) => ({
          id: id,
          target: target,
          assignedMods: assignedMods.filter(mod => mod.characterID !== id).sort(ModSet.slotSort)
        }));
      }

      if (sortOptions.currentCharacter === filter.sort) {
        const removedMods = collectByKey(
          flatten(displayedMods.map(({ id, assignedMods }) => assignedMods.filter(mod => mod.characterID !== id))),
          mod => mod.characterID
        );
        tags = Array.from(new Set(flatten(
          Object.keys(removedMods).map(id => state.gameSettings[id] ? state.gameSettings[id].tags : [])
        )));
      } else {
        tags = Array.from(new Set(flatten(
          displayedMods.map(({ id }) => state.gameSettings[id] ? state.gameSettings[id].tags : [])
        )));
      }
      break;
    default:
      // If we're displaying as sets, but sorting by current character, we need to rework the modAssignments
      // so that they're organized by current character rather than assigned character
      if (sortOptions.currentCharacter === filter.sort) {
        let modsToShow = modAssignments;
        // If we're only showing upgrades, then filter out any mod that isn't being upgraded
        if (showOptions.upgrades === filter.show) {
          modsToShow = modsToShow.map(({ id, target, assignedMods }) => ({
            id: id,
            target: target,
            assignedMods:
              assignedMods.filter(mod => mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target))
          }));
        }
        // Filter out any mods that aren't moving
        modsToShow = modsToShow.map(({ id, assignedMods }) => assignedMods.filter(mod => mod.characterID !== id));

        // Collect mods by current character ID.
        let currentMods = collectByKey(
          flatten(modsToShow),
          mod => mod.characterID
        );

        // Then, turn that into the same format as modAssignments - an array of {id, assignedMods}
        displayedMods = Object.values(mapObjectByKeyAndValue(
          currentMods,
          (id, mods) => ({ id: id, assignedMods: mods })
        ));
      } else if (showOptions.change === filter.show) {
        // If we're only showing changes, then filter out any character that isn't changing
        displayedMods = modAssignments.filter(({ id, assignedMods }) => assignedMods.some(mod => mod.characterID !== id));
      } else if (showOptions.upgrades === filter.show) {
        // If we're only showing upgrades, then filter out any character that doesn't have at least one upgrade
        displayedMods = modAssignments.filter(({ id, target, assignedMods }) => assignedMods.some(mod =>
          mod.shouldLevel(target) || mod.shouldSlice(profile.characters[id], target)
        ));
      } else {
        displayedMods = modAssignments;
      }

      // Set up the available tags for the sidebar
      tags = Array.from(new Set(flatten(
        displayedMods.map(({ id }) => state.gameSettings[id] ? state.gameSettings[id].tags : [])
      )));

      // Filter out any characters that we're not going to display based on the selected tag
      if (filter.tag) {
        displayedMods = displayedMods.filter(({ id }) => {
          const tags = state.gameSettings[id] ? state.gameSettings[id].tags : [];
          return tags.includes(filter.tag);
        });
      }
  }
  tags.sort();

  const movingModsByAssignedCharacter = modAssignments.map(({ id, target, assignedMods }) =>
    ({ id: id, target: target, assignedMods: assignedMods.filter(mod => mod.characterID !== id) })
  ).filter(({ assignedMods }) => assignedMods.length);

  const movingMods = flatten(
    movingModsByAssignedCharacter.map(({ assignedMods }) => assignedMods)
  ).filter(mod => mod.characterID);

  // Mod cost is the cost of all mods that are being REMOVED. Every mod
  // being assigned to a new character (so that isn't already unassigned) is
  // being removed from that character. Then, any mods that used to be equipped
  // are also being removed.
  const removedMods = flatten(
    movingModsByAssignedCharacter.map(({ id, assignedMods }) => {
      const changingSlots = assignedMods.map(mod => mod.slot);
      return currentModsByCharacter[id] ?
        currentModsByCharacter[id].filter(mod => changingSlots.includes(mod.slot)) :
        []
    })
  ).filter(mod => !movingMods.includes(mod));

  const modCostBasis = movingMods.concat(removedMods);
  // Get a count of how much it will cost to move the mods. It only costs money to remove mods
  const modRemovalCost = modCostBasis.reduce(
    (cost, mod) => cost + modRemovalCosts[mod.pips],
    0
  );

  const modsBeingUpgraded = modAssignments.filter(({ target }) => OptimizationPlan.shouldUpgradeMods(target))
    .map(({ id, assignedMods }) => assignedMods.filter(mod => 15 !== mod.level))
    .reduce((allMods, characterMods) => allMods.concat(characterMods), []);

  const modUpgradeCost = modsBeingUpgraded.reduce((cost, mod) => cost + modUpgradeCosts[mod.pips][mod.level], 0);

  /**
   * {{
   *   displayedMods: [[CharacterID, Mod]]
   * }}
   */
  return {
    allyCode: state.allyCode,
    assignedMods: profile.modAssignments,
    characters: profile.characters,
    gameSettings: state.gameSettings,
    currentModsByCharacter: currentModsByCharacter,
    displayedMods: displayedMods,
    movingModAssignments: movingModsByAssignedCharacter,
    modRemovalCost: modRemovalCost,
    modUpgradeCost: modUpgradeCost,
    numMovingMods: numMovingMods,
    filter: state.modListFilter,
    tags: tags
  };
};

const mapDispatchToProps = (dispatch) => ({
  edit: () => dispatch(changeOptimizerView('edit')),
  changeFilter: (filter) => dispatch(changeModListFilter(filter)),
  unequipMod: (modID) => dispatch(unequipMod(modID)),
  reassignMod: (modID, characterID) => dispatch(reassignMod(modID, characterID)),
  unequipMods: (modIDs) => dispatch(unequipMods(modIDs)),
  reassignMods: (modIDs, characterID) => dispatch(reassignMods(modIDs, characterID)),
  showModal: (clazz, content) => dispatch(showModal(clazz, content)),
  hideModal: () => dispatch(hideModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(Review);
