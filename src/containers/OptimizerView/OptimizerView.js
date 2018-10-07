// @flow

import React, {PureComponent} from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import {connect} from "react-redux";
import {changeOptimizerView, optimizeMods} from "../../state/actions";

class OptimizerView extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={'optimizer-view'}>
        {'edit' === this.props.view &&
        <CharacterEditView />
        }
        {'sets' === this.props.view &&
        <ReviewSets
          characterSets={{}/*this.state.modAssignments*/}
          mods={this.props.mods}
          onBack={() => this.props.changeView('edit')}
          onNextView={() => this.props.changeView('mods')}
        />
        }
        {'mods' === this.props.view &&
        <ReviewList
          mods={this.props.mods}
          characters={this.props.selectedCharacters}
          onBack={() => this.props.changeView('edit')}
          onNextView={() => this.props.changeView('sets')}
        />
        }
      </div>
    );
  }

  /**
   * Update the view with a new page
   *
   * @param view The name of the new view to show.
   * TODO: Move to Redux
   */
  // updateView(view) {
  //   if (view === this.state.view) {
  //     return;
  //   }
  //
  //   const missingData =
  //     this.state.selectedCharacters.filter(character => !character.baseStats || !character.baseStats.isValid());
  //
  //   if (missingData.length > 0) {
  //     this.setState({
  //       'error': 'Missing character data required to optimize your mods. Please fetch your data again.'
  //     });
  //     return
  //   }
  //
  //
  //   if ('edit' === this.state.view) {
  //     this.setState({
  //       'loading': true
  //     });
  //
  //     // Set a timeout so that the loading state is propagated before the optimizer runs
  //     setTimeout(() => {
  //       // If we're going from edit to another view, then run the optimization
  //       this.optimizeMods(this.props.mods);
  //       this.setState({
  //         'view': view,
  //         'loading': false
  //       });
  //     }, 0);
  //   } else {
  //     this.setState({
  //       'view': view
  //     });
  //   }
  // }

  /**
   * Run the optimizer, and store the results in this.state.modAssignments
   *
   * @param mods Array the mods to use in the optimization
   * TODO: Move to Redux
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

const mapStateToProps = (state) => ({
  allyCode: state.allyCode,
  view: state.optimizerView,
  availableCharacters: [],
  selectedCharacters: [],
  mods: []
});

const mapDispatchToProps = (dispatch) => ({
  changeView: (view) => {
    dispatch(changeOptimizerView(view))
  },
  optimizeMods: (allyCode) => {
    dispatch(optimizeMods(allyCode))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OptimizerView);
