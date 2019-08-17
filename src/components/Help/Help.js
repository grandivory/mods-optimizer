// @flow

import React from 'react';

import './Help.css';
import { showFlash } from '../../state/actions/app'
import { connect } from "react-redux";

class Help extends React.PureComponent {
    render() {
        return <span className={'icon help'}
            onClick={() =>
                this.props.showFlash(this.props.header, this.props.children)
            }
        />;
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    showFlash: (header, content) => dispatch(showFlash(header, content))
});

export default connect(mapStateToProps, mapDispatchToProps)(Help);
