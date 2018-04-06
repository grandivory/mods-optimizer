import React from "react";

class FileInput extends React.Component {
  render() {
    const fileHandler = this.props.handler;

    return (
      <form>
        <input type={'file'} ref={fileInput => this.input = fileInput} onChange={() => fileHandler(this.input.files[0])} />
      </form>
    );
  }
}

export default FileInput;
