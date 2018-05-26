import React from "react";

import "./Toggle.css";

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.leftValue || !this.props.rightValue) {
      throw new Error('Both a left and right value must be specified for the toggle');
    }

    if (this.props.value && ![this.props.leftValue, this.props.rightValue].includes(this.props.value)) {
      throw new Error('The value specified for the toggle must be one of the left or right values');
    }

    this.value = this.props.value || this.props.rightValue;
  }

  /**
   * Process the onChange event for the hidden input that actually switches the toggle value.
   * If there is an onChange handler for the toggle as a whole, pass the value to it
   */
  onChange(e) {
    const checked = e.target.checked;

    if (checked) {
      this.value = this.props.rightValue;
    } else {
      this.value = this.props.leftValue;
    }

    if (this.props.onChange) {
      this.props.onChange(this.value);
    }
  }

  render() {
    return <div className={'toggle-wrapper'}>
      <div className={'toggle-label'}>{this.props.inputLabel}</div>
      <label>
        <input type={'checkbox'}
               className={'toggle'}
               value={this.props.rightValue}
               checked={this.value === this.props.rightValue}
               onChange={this.onChange.bind(this)}
        />
        <span className={'toggle-left-value'}>{this.props.leftLabel}</span>
        <span className={'toggle-switch ' + (this.value === this.props.leftValue ? 'left' : 'right')} />
        <span className={'toggle-right-value'}>{this.props.rightLabel}</span>
      </label>
    </div>;
  }
}

export default Toggle;
