// @flow

import React from "react";

import './WarningLabel.css';

class WarningLabel extends React.PureComponent {
  render() {
    return (
      <svg className={'warning-label'} viewBox="504.729 350.76 195.116 168.305">
        <path
          d="M 577.153 350.76 L 624.815 350.76 L 624.815 387.251 L 577.153 387.251 L 577.153 350.76 Z M 504.729 479.965 L 560.021 424.672 L 593.724 458.375 L 538.431 513.667 L 504.729 479.965 Z M 592.792 490.767 L 614.389 490.767 L 641.199 519.065 L 564.493 519.065 L 592.792 490.767 Z M 636.156 415.95 L 602.215 449.891 L 568.274 415.95 L 579.845 404.379 L 624.585 404.379 Z M 644.552 424.3 L 699.845 479.592 L 666.143 513.294 L 610.85 458.002 L 644.552 424.3 Z"/>
      </svg>
    );
  }
}

export default WarningLabel;
