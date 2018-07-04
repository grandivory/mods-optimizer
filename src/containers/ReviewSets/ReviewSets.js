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
        1: 486000,
        2: 479250,
        3: 472500,
        4: 465750,
        5: 459000,
        6: 450000,
        7: 438800,
        8: 427500,
        9: 411800,
        10: 391500,
        11: 371300,
        12: 317300,
        13: 247500,
        14: 177800,
        15: 0
      },
      4: {
        1: 250200,
        2: 246700,
        3: 241450,
        4: 236200,
        5: 230950,
        6: 225700,
        7: 220450,
        8: 215200,
        9: 206500,
        10: 196000,
        11: 185500,
        12: 157500,
        13: 126000,
        14: 91000,
        15: 0
      },
      3: {
        1: 152500,
        2: 150000,
        3: 147500,
        4: 145000,
        5: 141250,
        6: 137500,
        7: 133750,
        8: 130000,
        9: 125000,
        10: 118800,
        11: 112500,
        12: 95000,
        13: 73800,
        14: 50000,
        15: 0
      },
      2: {
        1: 57750,
        2: 56250,
        3: 54750,
        4: 53250,
        5: 51750,
        6: 49500,
        7: 47250,
        8: 45000,
        9: 42750,
        10: 39750,
        11: 36750,
        12: 33000,
        13: 25500,
        14: 16500,
        15: 0
      },
      1: {
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
          <div className={'filters'}>
            {this.filterForm()}
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
}

export default ReviewSets;
