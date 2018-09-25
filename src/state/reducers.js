import {CHANGE_SECTION, REQUEST_PROFILE, RECEIVE_PROFILE, LOG} from "./actions";

const initialState = {
  section: 'optimize',
  allyCode: '',
  isBusy: false,
  profiles: {}
};

function changeSection(state, action) {
  return Object.assign({}, state, {
    section: action.section
  });
}

function requestProfile(state, action) {
  return Object.assign({}, state, {
    isBusy: true
  });
}

function receiveProfile(state, action) {
  return Object.assign({}, state, {
    isBusy: false,
    allyCode: action.allyCode,
    profiles: Object.assign({}, state.profiles, {
      [action.allyCode]: action.profile
    })
  });
}

export function optimizerApp(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case CHANGE_SECTION:
      return changeSection(state, action);
    case REQUEST_PROFILE:
      return requestProfile(state, action);
    case RECEIVE_PROFILE:
      return receiveProfile(state, action);
    case LOG:
      console.log(state);
      return Object.assign({}, state);
    default:
      return state;
  }
}
