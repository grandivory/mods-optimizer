import React from 'react';
import './Pips.css';

class Pips extends React.Component {
  render() {
    const pips = this.props.pips;
    const pipElements = Array.from(Array(pips).keys()).map((_) => <span className='pip' />);


    return (
      <div className='pips'>
        {pipElements}
      </div>
    );
  }
}

export default Pips;
