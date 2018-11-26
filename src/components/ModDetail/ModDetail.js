// @flow

import React from 'react';
import ModImage from '../ModImage/ModImage';
import ModStats from '../ModStats/ModStats';
import CharacterAvatar from '../CharacterAvatar/CharacterAvatar';
import './ModDetail.css';
import {connect} from "react-redux";
import {hideModal, showModal} from "../../state/actions/app";
import {deleteMod} from "../../state/actions/review";

class ModDetail extends React.PureComponent {
  render() {
    const mod = this.props.mod;
    const character = this.props.character;

    return (
      <div className='mod-detail'>
        <ModImage mod={mod}/>
        {character && <CharacterAvatar character={character}/>}
        <ModStats mod={mod}/>
        <button className={'delete-button red small'} onClick={() => this.props.showModal(this.deleteModal())}>
          Sell Mod
        </button>
      </div>
    );
  }

  /**
   * Render a modal that asks if the user is sure that they want to delete the mod
   */
  deleteModal() {
    return <div>
      <h2>Delete Mod</h2>
      <div className={'delete-mod-display'}>
        <ModImage mod={this.props.mod}/>
        {this.props.character && <CharacterAvatar character={this.props.character}/>}
        <ModStats mod={this.props.mod}/>
      </div>
      <p>Are you sure you want to delete this mod from the mods optimizer?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => {this.props.hideModal()}}>No</button>
        <button type={'button'} onClick={() => {this.props.deleteMod(this.props.mod)}} className={'red'}>
          Yes, Delete Mod
        </button>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  showModal: (content) => dispatch(showModal('', content)),
  hideModal: () => dispatch(hideModal()),
  deleteMod: (mod) => {dispatch(deleteMod(mod)); dispatch(hideModal())}
});

export default connect(mapStateToProps, mapDispatchToProps)(ModDetail);
