// @flow

import React from 'react';

class RangeInput extends React.PureComponent {
  render() {
    const id = this.props.id;
    const name = this.props.name;
    const defaultValue = this.props.defaultValue;
    const min = this.props.min || 0;
    const max = this.props.max || 100;
    const step = 'undefined' === typeof this.props.step ? 1 : this.props.step;
    const isPercent = this.props.isPercent || false;
    const editable = this.props.editable || false;
    const onChange = this.props.onChange || function() {};

    let slider, textField, output;

    if (editable) {
      return [
        <input
          type={'range'}
          id={name && name + '-slider'}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            textField.value = +e.target.value;
            onChange(+e.target.value);
          }}
          key={name + 'slider'}
          ref={input => slider = input}
        />,
        <input
          type={'number'}
          id={id}
          name={name}
          className={'slider-input'}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            slider.value = e.target.value;
            onChange(+e.target.value);
          }}
          key={name + 'input'}
          ref={input => textField = input}
        />,
        <span key={'percent'}>{isPercent && '%'}</span>
      ];
    } else {
      return [
        <input
          type={'range'}
          id={id}
          name={name}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            output.value = e.target.value + (isPercent ? '%' : '');
            onChange(+e.target.value);
          }}
          key={name + 'input'}
        />,
        <output id={name && name + '-display'} htmlFor={id} key={name + 'output'} ref={element => output = element}>
          {defaultValue}{isPercent && '%'}
        </output>
      ];
    }
  }
}

export default RangeInput;
