import React from "react";

import './Dropdown.css'

export class Dropdown extends React.PureComponent {
    render() {
        return (
            <div className={'dropdown'}>
                <select {...this.props} />
            </div>
        );
    }
};