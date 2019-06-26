// @flow

import React from "react";

import './FileInput.css';

class FileInput extends React.PureComponent {
  render() {
    const fileHandler = this.props.handler;
    const extraClass = this.props.className || '';

    return (
      <form className={'file-input'}>
        <label className={`file button ${extraClass}`}>{this.props.label}
          <input type={'file'} ref={fileInput => this.input = fileInput}
                 onChange={() => this.input.files[0] && fileHandler(this.input.files[0])}/>
        </label>
      </form>
    );
  }
}

export default FileInput;
