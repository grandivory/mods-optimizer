// @flow

import React, {PureComponent} from "react";
import Optimizer from "../../utils/Optimizer";
import ReviewList from "../ReviewList/ReviewList";
import ReviewSets from "../ReviewSets/ReviewSets";
import CharacterEditView from "../CharacterEditView/CharacterEditView";

import "./OptimizerView.css";
import {connect} from "react-redux";
import {changeOptimizerView, startModOptimization} from "../../state/actions";

class OptimizerView extends PureComponent {
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
    dispatch(startModOptimization(allyCode))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OptimizerView);
