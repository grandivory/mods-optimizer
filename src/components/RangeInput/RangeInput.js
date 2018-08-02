import React from 'react';

class RangeInput extends React.Component {
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

    if (editable) {
      return [
        <input
          type={'range'}
          id={name + '-slider'}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            document.getElementById(id).value = e.target.value + (isPercent ? '%' : '');
            onChange(e.target.value);
          }}
          key={name + 'slider'}
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
            const value = e.target.value.replace(/%/g, '');
            document.getElementById(name + '-slider').value = value;
            onChange(value);
          }}
          key={name + 'input'}
        />
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
            document.getElementById(name + '-display').value = e.target.value + (isPercent ? '%' : '');
            onChange(e.target.value);
          }}
          key={name + 'input'}
        />,
        <output id={name + '-display'} htmlFor={id} key={name + 'output'}>
          {defaultValue}{isPercent && '%'}
        </output>
      ];
    }
  }
}

export default RangeInput;
