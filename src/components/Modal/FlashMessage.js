// @flow

import React from 'react';

import './Modal.css';
import {hideFlash} from "../../state/actions/app";
import {connect} from "react-redux";

class FlashMessage extends React.PureComponent {
  render() {
    if (!this.props.content) {
      return null;
    }

    const className = this.props.className ? ('modal flash ' + this.props.className) : 'modal flash';

    return <div className={'overlay'}>
      <div className={className}>
        <h2>{this.props.content.heading}</h2>
        <div className={'content'}>{this.props.content.content}</div>
        <div className={'actions'}>
          <button type={'button'} onClick={this.props.hideFlash}>OK</button>
        </div>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  content: state.flashMessage
});

const mapDispatchToProps = (dispatch) => ({
  hideFlash: () => dispatch(hideFlash())
});

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);
