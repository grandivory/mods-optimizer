import React from 'react';
import { hideModal, showModal } from "../../state/actions/app";
import { deleteMod } from "../../state/actions/storage";
import { connect } from "react-redux";
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import ModStats from "../ModStats/ModStats";
import ModImage from "../ModImage/ModImage";

class SellModButton extends React.PureComponent {
  render() {
    return <button className={'delete-button red small'} onClick={() => this.props.showModal(this.deleteModal())}>
      X
    </button>;
  }

  /**
   * Render a modal that asks if the user is sure that they want to delete the mod
   */
  deleteModal() {
    const mod = this.props.mod;
    const character = mod.characterID ? this.props.characters[mod.characterID] : null;

    return <div>
      <h2>Delete Mod</h2>
      <div className={'delete-mod-display'}>
        <ModImage mod={mod} />
        {character && <CharacterAvatar character={character} />}
        {character &&
          <h4 className={'character-name'}>{
            this.props.gameSettings[character.baseID] ? this.props.gameSettings[character.baseID].name : character.baseID
          }</h4>
        }
        <ModStats mod={mod} />
      </div>
      <p>Are you sure you want to delete this mod from the mods optimizer?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => { this.props.hideModal() }}>No</button>
        <button type={'button'} onClick={() => { this.props.deleteMod(mod) }} className={'red'}>
          Yes, Delete Mod
        </button>
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  characters: state.profile.characters,
  gameSettings: state.gameSettings
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (content) => dispatch(showModal('', content)),
  hideModal: () => dispatch(hideModal()),
  deleteMod: (mod) => { dispatch(deleteMod(mod)); dispatch(hideModal()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(SellModButton);
