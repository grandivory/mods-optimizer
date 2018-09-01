// @flow

import React from "react";

import './FileInput.css';

class FileInput extends React.Component {
  render() {
    const fileHandler = this.props.handler;

    return (
      <form>
        <label className={'file button'}>{this.props.label}
          <input type={'file'} ref={fileInput => this.input = fileInput}
                 onChange={() => this.input.files[0] && fileHandler(this.input.files[0])} />
        </label>
      </form>
    );
  }
}

export default FileInput;
