// @flow

import React from 'react';

import './Modal.css';

class Modal extends React.PureComponent {
  render() {
    if (!this.props.show) {
      return null;
    }

    const className = this.props.className ? ('modal ' + this.props.className) : 'modal';
    const content = this.props.content;

    return <div className={'overlay'}>
      <div className={'modal ' + className}>
        {content}
      </div>
    </div>;
  }
}

export default Modal;
