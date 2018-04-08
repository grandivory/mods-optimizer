import React from "react";

import './FileDropZone.css';

class FileDropZone extends React.Component {

  constructor() {
    super();
    this.state = {
      'dragState': ' drag-inactive'
    };
  }

  /**
   * Event handler to do nothing. This also stops the event from propagating, so no action is taken whatsoever.
   *
   * @param event
   * @private
   */
  _nothingHandler(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Handle a file upload, passing actual file processing to a given file handler
   *
   * @param event
   * @private
   */
  _handleFileUpload(event, handler) {
    event.stopPropagation();
    event.preventDefault();

    handler(event.dataTransfer.files[0]);
  }

  componentDidMount() {
    window.addEventListener('dragenter', this._nothingHandler, false);
    window.addEventListener('dragover', this._nothingHandler, false);
    window.addEventListener('drop', this._nothingHandler, false);
  }

  componentWillUnmount() {
    window.removeEventListener('dragenter', this._nothingHandler);
    window.removeEventListener('dragover', this._nothingHandler);
    window.addEventListener('drop', this._nothingHandler, false);
  }

  render() {
    const label = this.props.label;
    const handler = this.props.handler;

    return (
      <div dropzone="true"
           className={'drop-target' + this.state.dragState}
           onDragEnter={this.setDragActive.bind(this)}
           onDragLeave={this.setDragInactive.bind(this)}
           onDrop={(event) => this._handleFileUpload(event, handler)}>
        {label}
      </div>
    )
  }

  setDragActive() {
    this.setState({
      'dragState': ' drag-active'
    });
  }

  setDragInactive() {
    this.setState({
      'dragState': ' drag-inactive'
    });
  }
}

export default FileDropZone;
