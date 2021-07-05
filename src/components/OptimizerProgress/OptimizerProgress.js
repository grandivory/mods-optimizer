import React from 'react';
import { connect } from "react-redux";
import CharacterAvatar from '../CharacterAvatar/CharacterAvatar';
import { cancelOptimizer } from '../../state/actions/optimize';
import { hideModal, setIsBusy } from '../../state/actions/app';

class OptimizerProgress extends React.Component {
  render() {
    return <div>
      <h3>Optimizing Your Mods...</h3>
      <div className={'progressBox'}>
        {this.props.character &&
          <div className={'character'}><CharacterAvatar character={this.props.character} /></div>
        }
        <div className={'step'}>{this.props.step}</div>
        <div className={'progress'}>
          <span className={'progress-bar'} id={'progress-bar'} style={{ width: `${this.props.progress}%` }} />
        </div>
      </div>
      <div className={'actions'}>
        <button type={'button'} className={'red'} onClick={() => this.props.cancel(!this.props.isIncremental)}>Cancel</button>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => {
  return {
    character: state.progress.character,
    step: state.progress.step,
    progress: state.progress.progress,
    isIncremental: !!state.profile.incrementalOptimizeIndex
  }
};

const mapDispatchToProps = (dispatch) => ({
  cancel: (closeModal) => {
    dispatch(cancelOptimizer());
    dispatch(setIsBusy(false));
    if (closeModal) {
      dispatch(hideModal());
    }
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(OptimizerProgress);
