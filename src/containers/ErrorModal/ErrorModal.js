import Modal from "../../components/Modal/Modal";
import React from "react";
import { connect } from "react-redux";
import WarningLabel from "../../components/WarningLabel/WarningLabel";
import { hideError } from "../../state/actions/app";

class ErrorModal extends Modal {
  render() {
    if (!this.props.content) {
      return null;
    }

    return <div className={'overlay'}>
      <div className={'modal error-modal'}>
        <WarningLabel />
        <h2 key={'error-header'}>Error!</h2>
        <div key={'error-message'}>{this.props.content}</div>
        <div key={'error-actions'} className={'actions'}>
          <button type={'button'} onClick={this.props.close}>Ok</button>
        </div>
      </div>
    </div>;

  }
}

const mapStateToProps = state => ({
  content: state.error
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(hideError())
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal)
