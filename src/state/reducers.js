import {CHANGE_SECTION} from "./actions";

const initialState = {
  section: 'optimize',
  allyCode: ''
};

export function optimizerApp(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case CHANGE_SECTION:
      return Object.assign({}, state, {
        section: action.section
      });
    default:
      return state;
  }
}
