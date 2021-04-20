import React from "react";

import './Dropdown.css'

export const Dropdown = React.forwardRef(
    function Dropdown(props, ref) {
        return <div className={'dropdown'}>
            <select {...props} ref={ref} />
        </div>;
    }
);
