import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {Provider} from "react-redux";
import modsOptimizer from "./state/reducers/modsOptimizer";
import Database from "./state/storage/Database";

const store = createStore(
  modsOptimizer,
  applyMiddleware(
    thunkMiddleware
  )
);

// Instantiate the database
new Database(store.dispatch);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
