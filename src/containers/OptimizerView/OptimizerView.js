import React from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import characters from "../../constants/characters";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import Character from "../../domain/Character";

class OptimizerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'view': 'edit',
    };

    if ('function' === typeof props.saveState) {
      this.saveState = function() {
        window.localStorage.setItem(
          'availableCharacters',
          JSON.stringify(this.state.availableCharacters.map(character => character.serialize()))
        );
        window.localStorage.setItem(
          'selectedCharacters',
          JSON.stringify(this.state.selectedCharacters.map(character => character.serialize()))
        );
        props.saveState();
      }.bind(this);
    } else {
      this.saveState = function() {
        window.localStorage.setItem(
          'availableCharacters',
          JSON.stringify(this.state.availableCharacters.map(character => character.serialize()))
        );
        window.localStorage.setItem(
          'selectedCharacters',
          JSON.stringify(this.state.selectedCharacters.map(character => character.serialize()))
        );
      }.bind(this);
    }

    this.state = Object.assign(this.state, this.restoreCharacterList());
  }

  restoreCharacterList() {
    const characterDefaults = Object.values(characters).sort((left, right) => {
      if (left.name < right.name) {
        return -1;
      } else if (right.name < left.name) {
        return 1;
      } else {
        return 0;
      }
    });

    const savedAvailableCharacters = (JSON.parse(window.localStorage.getItem('availableCharacters')) || []).map(
      characterJson => Character.deserialize(characterJson)
    );
    const savedSelectedCharacters = (JSON.parse(window.localStorage.getItem('selectedCharacters')) || []).map(
      characterJson => Character.deserialize(characterJson)
    );

    const savedCharacters = savedAvailableCharacters.concat(savedSelectedCharacters);

    const newCharacters = characterDefaults.filter(character =>
      !savedCharacters.some(c => c.name === character.name)
    );

    let availableCharacters = [];
    let selectedCharacters = [];

    savedAvailableCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name);
      defaultCharacter.optimizationPlan = character.optimizationPlan;
      defaultCharacter.baseStats = character.baseStats;
      availableCharacters.push(defaultCharacter);
    });
    savedSelectedCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name);
      defaultCharacter.optimizationPlan = character.optimizationPlan;
      defaultCharacter.baseStats = character.baseStats;
      selectedCharacters.push(defaultCharacter);
    });

    return {
      'availableCharacters': Object.assign(newCharacters, availableCharacters),
      'selectedCharacters': selectedCharacters
    };
  }

  render() {
    const mods = this.props.mods;

    return (
      <div className={'optimizer-view'}>
        {'edit' !== this.state.view &&
        <div className={'actions'}>
          <button onClick={this.updateView.bind(this, 'edit')}>
            Change my character selection
          </button>
          <button onClick={this.updateView.bind(this, 'mods' === this.state.view ? 'sets' : 'mods')}>
            {'mods' === this.state.view ? 'Show me as sets' : 'Show me a list of mods to move'}
          </button>
        </div>
        }
        {'edit' === this.state.view &&
        <div className={'actions'}>
          <button onClick={this.updateView.bind(this, 'sets')}>
            Optimize my mods!
          </button>
        </div>
        }

        {'edit' === this.state.view &&
        <CharacterEditView
          availableCharacters={this.state.availableCharacters}
          selectedCharacters={this.state.selectedCharacters}
          saveState={this.saveState}
        />
        }
        {'sets' === this.state.view &&
        <ReviewSets characterSets={this.state.modAssignments} mods={mods}/>}
        {'mods' === this.state.view &&
        <ReviewList mods={mods} saveState={this.saveState}/>
        }
      </div>
    );
  }

  /**
   * Update the view with a new page
   *
   * @param view The name of the new view to show.
   */
  updateView(view) {
    if (view === this.state.view) {
      return;
    } else if ('edit' === this.state.view) {
      // If we're going from edit to another view, then run the optimization
      this.optimizeMods(this.props.mods);
    }

    this.setState({'view': view});
  }

  /**
   * Run the optimizer, and store the results in this.state.modAssignments
   *
   * @param mods Array the mods to use in the optimization
   */
  optimizeMods(mods) {
    const modAssignments = new Optimizer(mods).optimizeMods(this.state.selectedCharacters);

    this.setState({
      'modAssignments': modAssignments
    });

    this.saveState();
  }
}

export default OptimizerView;
