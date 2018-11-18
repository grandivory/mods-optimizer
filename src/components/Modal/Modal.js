// @flow

import React from 'react';

import './Modal.css';
import {hideModal} from "../../state/actions/app";
import {connect} from "react-redux";

class Modal extends React.PureComponent {
  render() {
    if (!this.props.show) {
      return null;
    }

    const className = this.props.className ? ('modal ' + this.props.className) : 'modal';
    const content = this.props.content;

    return <div className={'overlay'} onClick={this.props.hideModal}>
      <div className={className} onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
