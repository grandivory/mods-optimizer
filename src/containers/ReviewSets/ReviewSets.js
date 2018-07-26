import React from "react";
import CharacterAvatar from "../../components/CharacterAvatar/CharacterAvatar";
import Arrow from "../../components/Arrow/Arrow";
import ModSet from "../../domain/ModSet";
import ModSetDetail from "../../components/ModSetDetail/ModSetDetail";

import './ReviewSets.css';
import Toggle from "../../components/Toggle/Toggle";
import Credits from "../../components/Credits/Credits";

class ReviewSets extends React.Component {
  constructor() {
    super();
    this.state = {'view': 'all'};
    this.filterOptions = {
      'all': 'all',
      'move': 'move'
    }
  }

  render() {
    let characterSets = this.props.characterSets;
    const mods = this.props.mods;
    const numOptimizedCharacters = characterSets.length;
    // A map from number of pips that a mod has to the cost to remove (but not destroy) it
    const modRemovalCosts = {
      1: 550,
      2: 1050,
      3: 1900,
      4: 3000,
      5: 4750
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

    // Filter out sets based on the view settings
    if ('move' === this.state.view) {
      characterSets = characterSets.filter(characterSet =>
        undefined !== characterSet.modSet.mods().find(mod =>
        mod.currentCharacter && mod.currentCharacter.name !== mod.assignTo.name
        )
      );
    }

    const modsByCharacter = mods.reduce((acc, mod) => {
      if (!mod.currentCharacter) {
        return acc;
      }
      if (acc.hasOwnProperty(mod.currentCharacter.name)) {
        acc[mod.currentCharacter.name].push(mod);
      } else {
        acc[mod.currentCharacter.name] = [mod];
      }

      return acc;
    }, {});

    // Get a count of how much it will cost to move the mods.
    // It only costs money to remove mods, so only account for mods that have a current character
    // and a different assignTo
    const modRemovalCost = mods
      .filter(mod => mod.currentCharacter && ((mod.assignTo && mod.currentCharacter !== mod.assignTo) ||
        mods.some(m => m !== mod && m.slot === mod.slot && m.assignTo === mod.currentCharacter))
      )
      .reduce((cost, mod) => cost + modRemovalCosts[mod.pips], 0);

    const modUpgradeCost = mods
      .filter(mod => 15 !== mod.level && mod.assignTo && mod.assignTo !== mod.currentCharacter)
      .reduce((cost, mod) => cost + modUpgradeCosts[mod.pips][mod.level], 0);

    // Create sets for everything each character already has equipped
    const rows = characterSets.map(characterSet => {
      const currentSet = new ModSet(modsByCharacter[characterSet.character.name] || []);

      return (
        <div className={'set-row'} key={characterSet.character.name}>
          <ModSetDetail
            changeClass={'remove'}
            set={currentSet}
            character={characterSet.character}/>
          <CharacterAvatar character={characterSet.character}/>
          <Arrow/>
          <ModSetDetail
            changeClass={'add'}
            set={characterSet.modSet}
            diffset={currentSet}
            character={characterSet.character}/>
        </div>
      );
    });

    const formatNumber = number => number.toLocaleString(navigator.language, {'useGrouping': true});

    if (0 === characterSets.length) {
      return (
        <div className={'review-sets'}>
          <div className={'sidebar'}>
            <div className={'filters'}>
              {this.filterForm()}
            </div>
            {this.sidebarActions()}
          </div>
          <h2>Your mods are already optimal. Congratulations!</h2>
        </div>
      );
    } else {
      const subHeading = 0 < modUpgradeCost ?
        <h3>
          Your mods will cost {formatNumber(modRemovalCost)} <Credits/> to move,
          and an additional {formatNumber(modUpgradeCost)} <Credits/> to level up to 15.
        </h3> :
        <h3>
          Your mods will cost {formatNumber(modRemovalCost)} <Credits/> to move
        </h3>

      return (
        <div className={'review-sets'}>
          <h2>Showing mod sets for {characterSets.length} out of {numOptimizedCharacters} characters</h2>
          {subHeading}
          <div className={'sidebar'}>
            <div className={'filters'}>
              {this.filterForm()}
            </div>
            {this.sidebarActions()}
          </div>
          <div className={'sets-list'}>
            {rows}
          </div>
        </div>
      );
    }
  }

  /**
   * Limit the view to only some sets
   *
   * @param filter string The indicator of what sets to show
   */
  showSets(filter) {
    this.setState({
      'view': filter
    })
  }

  /**
   * Render a form used to filter the sets displayed on the page
   * @returns JSX Element
   */
  filterForm() {
    return <div className={'filter-form'}>
      <Toggle inputLabel={'Show me:'}
              leftLabel={'Changing sets'}
              leftValue={this.filterOptions.move}
              rightLabel={'All sets'}
              rightValue={this.filterOptions.all}
              value={this.filterOptions.all}
              onChange={this.showSets.bind(this)}
      />
    </div>;
  }

  /**
   * Renders a sidebar box with action buttons
   *
   * @returns JSX Element
   */
  sidebarActions() {
    return <div className={'sidebar-actions'}>
      <h3>I don't like these results...</h3>
      <button
        type={'button'}
        onClick={this.props.onBack}
      >
        Change my selection
      </button>
      <h3>Looks good!</h3>
      <button
        type={'button'}
        onClick={this.props.onNextView}
      >
        Show me the mods to move
      </button>
    </div>
  }
}

export default ReviewSets;
