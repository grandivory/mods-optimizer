// @flow

import React from "react";

import "./Toggle.css";

class Toggle extends React.Component {
  checkbox;
  toggleSwitch;

  constructor(props) {
    super(props);

    if ('undefined' === typeof this.props.leftValue || 'undefined' === typeof this.props.rightValue) {
      throw new Error('Both a left and right value must be specified for the toggle');
    }

    if (this.props.value && ![this.props.leftValue, this.props.rightValue].includes(this.props.value)) {
      throw new Error('The value specified for the toggle must be one of the left or right values');
    }

    this.value = this.props.value || this.props.rightValue;
    this.state = { disabled: this.props.disabled };
  }

  updateValue(newValue) {
    if (![this.props.leftValue, this.props.rightValue].includes(newValue)) {
      throw new Error('The value specified for the toggle must be one of the left or right values');
    }

    this.value = newValue;

    if (newValue === this.props.rightValue) {
      this.checkbox.checked = true;
      this.toggleSwitch.classList.remove('left');
      this.toggleSwitch.classList.add('right');
    } else {
      this.checkbox.checked = false;
      this.toggleSwitch.classList.remove('right');
      this.toggleSwitch.classList.add('left');
    }
  }

  disable() {
    this.setState({ disabled: true });
  }

  enable() {
    this.setState({ disabled: false });
  }

  /**
   * Process the onChange event for the hidden input that actually switches the toggle value.
   * If there is an onChange handler for the toggle as a whole, pass the value to it
   */
  onChange(e) {
    const input = e.target;

    if (input.checked) {
      this.value = this.props.rightValue;
      this.toggleSwitch.classList.remove('left');
      this.toggleSwitch.classList.add('right');
    } else {
      this.value = this.props.leftValue;
      this.toggleSwitch.classList.remove('right');
      this.toggleSwitch.classList.add('left');
    }

    if (this.props.onChange) {
      this.props.onChange(this.value);
    }
  }

  render() {
    const className = `toggle-wrapper ${this.props.className} ${this.state.disabled ? 'disabled' : ''}`;

    return <div className={className}>
      <div className={'toggle-label'}>{this.props.inputLabel}</div>
      <label>
        <input type={'checkbox'}
          className={'toggle'}
          ref={input => this.checkbox = input}
          name={this.props.name}
          id={this.props.id}
          value={this.props.rightValue}
          defaultChecked={this.value === this.props.rightValue}
          onChange={this.onChange.bind(this)}
          disabled={this.state.disabled}
        />
        <span className={'toggle-left-value'}>{this.props.leftLabel}</span>
        <span
          className={'toggle-switch ' + (this.value === this.props.leftValue ? 'left' : 'right')}
          ref={toggleSwitch => this.toggleSwitch = toggleSwitch} />
        <span className={'toggle-right-value'}>{this.props.rightLabel}</span>
      </label>
    </div>;
  }
}

export default Toggle;
