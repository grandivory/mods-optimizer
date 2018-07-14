import React from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import Spinner from "../../components/Spinner/Spinner";

class OptimizerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'view': 'edit',
    };

    this.saveState = 'function' === typeof props.saveState ? props.saveState : function() {};

    this.state.availableCharacters = props.availableCharacters;
    this.state.selectedCharacters = props.selectedCharacters;
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
    const selectedCharacters = this.state.selectedCharacters.filter(character => !character.isLocked);
    const lockedCharacters = this.state.selectedCharacters.filter(character => character.isLocked);

    const modAssignments = new Optimizer(mods).optimizeMods(selectedCharacters, lockedCharacters);

    this.setState({
      'modAssignments': modAssignments
    });

    this.saveState();
  }
}

export default OptimizerView;
