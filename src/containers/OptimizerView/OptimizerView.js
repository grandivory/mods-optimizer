import React from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import Spinner from "../../components/Spinner/Spinner";
import WarningLabel from "../../components/WarningLabel/WarningLabel";
import Modal from "../../components/Modal/Modal";

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
        {'edit' === this.state.view &&
        <CharacterEditView
          availableCharacters={this.state.availableCharacters}
          selectedCharacters={this.state.selectedCharacters}
          saveState={this.saveState}
          onOptimize={this.updateView.bind(this, 'sets')}
        />
        }
        {'sets' === this.state.view &&
        <ReviewSets
          characterSets={this.state.modAssignments}
          mods={mods}
          onBack={this.updateView.bind(this, 'edit')}
          onNextView={this.updateView.bind(this, 'mods')}
        />
        }
        {'mods' === this.state.view &&
        <ReviewList
          mods={mods}
          saveState={this.saveState}
          characters={this.state.selectedCharacters}
          onBack={this.updateView.bind(this, 'edit')}
          onNextView={this.updateView.bind(this, 'sets')}
        />
        }
        <Modal show={this.state.error} className={'error-modal'} content={this.errorModal(this.state.error)} />
      </div>
    );
  }

  /**
   * Shows a popup with an error message
   * @param errorMessage
   * @returns JSX Element
   */
  errorModal(errorMessage) {
    return <div>
      <WarningLabel />
      <h2 key={'error-header'}>Error!</h2>
      <p key={'error-message'}>{errorMessage}</p>
      <div key={'error-actions'} className={'actions'}>
        <button type={'button'} onClick={() => this.setState({'error': false})}>Ok</button>
      </div>
    </div>;
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

    const missingData =
      this.state.selectedCharacters.filter(character => !character.baseStats || !character.baseStats.isValid());

    if (missingData.length > 0) {
      this.setState({
        'error': 'Missing character data required to optimize your mods. Please fetch your data again.'
      });
      return
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
