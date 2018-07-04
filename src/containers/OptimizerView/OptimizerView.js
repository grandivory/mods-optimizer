import React from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import {characters} from "../../constants/characters";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import Character from "../../domain/Character";
import DefaultCharacter from "../../domain/DefaultCharacter";
import Spinner from "../../components/Spinner/Spinner";
import BaseStats from "../../domain/BaseStats";
import OptimizationPlan from "../../domain/OptimizationPlan";

class OptimizerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'view': 'edit',
    };

    const superSave = 'function' === typeof props.saveState ? props.saveState : function() {};

    this.saveState = function() {
      window.localStorage.setItem(
        'availableCharacters',
        JSON.stringify(this.state.availableCharacters.map(character => character.serialize()))
      );
      window.localStorage.setItem(
        'selectedCharacters',
        JSON.stringify(this.state.selectedCharacters.map(character => character.serialize()))
      );
      window.localStorage.setItem(
        'lockedCharacters',
        JSON.stringify(this.state.lockedCharacters.map(character => character.serialize()))
      );
      superSave();
    }.bind(this);

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
    const savedLockedCharacters = (JSON.parse(window.localStorage.getItem('lockedCharacters')) || []).map(
      characterJson => Character.deserialize(characterJson)
    );

    const savedCharacters = savedAvailableCharacters.concat(savedSelectedCharacters, savedLockedCharacters);

    const newCharacters = characterDefaults.filter(character =>
      !savedCharacters.some(c => c.name === character.name)
    );

    let availableCharacters = [];
    let selectedCharacters = [];
    let lockedCharacters = [];

    savedAvailableCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name) ||
        new DefaultCharacter(character.name);
      defaultCharacter.optimizationPlan = character.optimizationPlan;
      defaultCharacter.baseStats = character.baseStats;
      availableCharacters.push(defaultCharacter);
    });
    savedSelectedCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name) ||
        new DefaultCharacter(character.name);
      defaultCharacter.optimizationPlan = character.optimizationPlan;
      defaultCharacter.baseStats = character.baseStats;
      selectedCharacters.push(defaultCharacter);
    });
    savedLockedCharacters.forEach(character => {
      const defaultCharacter = characterDefaults.find(c => c.name === character.name) ||
        new DefaultCharacter(character.name);
      defaultCharacter.optimizationPlan = character.optimizationPlan;
      defaultCharacter.baseStats = character.baseStats;
      lockedCharacters.push(defaultCharacter);
    });

    return {
      'availableCharacters': availableCharacters.concat(newCharacters),
      'selectedCharacters': selectedCharacters,
      'lockedCharacters': lockedCharacters
    };
  }

  render() {
    const mods = this.props.mods;

    return (
      <div className={'optimizer-view'}>
        <Spinner show={this.state.loading} />
        {'edit' !== this.state.view &&
        <div className={'actions'}>
          <button onClick={this.updateView.bind(this, 'edit')}>
            Change my character selection
          </button>
          <button onClick={this.updateView.bind(this, 'mods' === this.state.view ? 'sets' : 'mods')}>
            {'mods' === this.state.view ? 'Let me review the changes' : 'Show me the mods to move'}
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
          lockedCharacters={this.state.lockedCharacters}
          saveState={this.saveState}
        />
        }
        {'sets' === this.state.view &&
        <ReviewSets characterSets={this.state.modAssignments} mods={mods}/>}
        {'mods' === this.state.view &&
        <ReviewList mods={mods} saveState={this.saveState} characters={this.state.selectedCharacters}/>
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
    }

    if ('edit' === this.state.view) {
      this.setState({
        'loading': true
      });

      // Set a timeout so that the loading state is propagated before the optimizer runs
      setTimeout(() => {
        // If we're going from edit to another view, then run the optimization
        this.optimizeMods(this.props.mods);
        this.setState({
          'view': view,
          'loading': false
        });
      }, 0);
    } else {
      this.setState({
        'view': view
      });
    }
  }

  /**
   * Run the optimizer, and store the results in this.state.modAssignments
   *
   * @param mods Array the mods to use in the optimization
   */
  optimizeMods(mods) {
    const modAssignments = new Optimizer(mods).optimizeMods(this.state.selectedCharacters, this.state.lockedCharacters);

    this.setState({
      'modAssignments': modAssignments
    });

    this.saveState();
  }
}

export default OptimizerView;
