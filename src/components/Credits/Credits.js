import React from 'react';

import './Credits.css';

class Credits extends React.PureComponent {
  render() {
    return <svg className={'credits'} viewBox="0 0 100 100">
      <path
        d="M 100 15.997 L 35.567 100 L 14.433 100 L 62.112 36.532 L 36.855 36.532 L 36.855 52.266 L 27.836 52.266 L 27.836 36.265 L 18.3 36.265 L 18.3 52.266 L 9.022 52.266 L 9.022 36.265 L 0 36.265 L 0 15.999 L 8.764 15.999 L 8.764 0 L 18.3 0 L 18.3 15.999 L 27.836 15.999 L 27.836 0 L 36.855 0 L 36.855 15.999 Z"></path>
    </svg>
  }
}

export default Credits;
