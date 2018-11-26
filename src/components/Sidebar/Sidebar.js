import {connect} from "react-redux";
import React from "react";
import {toggleSidebar} from "../../state/actions/app";

import "./Sidebar.css";

class Sidebar extends React.PureComponent {
  render() {
    return <div className={`sidebar ${this.props.showSidebar ? 'show' : 'hide'}`} key={'sidebar'}>
      {this.props.content}
      <button className={`toggle-sidebar ${this.props.showSidebar ? 'hide' : 'show'}`}
              onClick={() => {this.props.toggleSidebar()}}>
      </button>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  showSidebar: state.showSidebar
});

const mapDispatchToProps = (dispatch) => ({
  toggleSidebar: () => dispatch(toggleSidebar())
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
