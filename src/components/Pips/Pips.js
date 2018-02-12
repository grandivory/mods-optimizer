import React from 'react';
import './Pips.css';

class Pips extends React.Component {
  render() {
    const pips = this.props.pips;
    const pipElements = Array.from(Array(pips).keys()).map((_, index) => <span key={index} className='pip' />);


    return (
      <div className='pips inset'>
        {pipElements}
      </div>
    );
  }
}

export default Pips;
