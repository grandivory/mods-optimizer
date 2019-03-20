import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {Provider} from "react-redux";
import modsOptimizer from "./state/reducers/modsOptimizer";
import getDatabase from "./state/storage/Database";
import {showError} from "./state/actions/app";
import {databaseReady} from "./state/actions/storage";

const store = createStore(
  modsOptimizer,
  applyMiddleware(
    thunkMiddleware
  )
);

// Instantiate the database
getDatabase(
  () => store.dispatch(databaseReady(store.getState())),
  (error) => store.dispatch(showError(
    'Unable to load database: ' +
    error.message +
    ' Please fix the problem and try again, or ask for help in the discord server below.'
  ))
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
