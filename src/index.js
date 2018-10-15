import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import {Provider} from "react-redux";
import modsOptimizer from "./state/reducers/modsOptimizer";

const store = createStore(
  modsOptimizer,
  applyMiddleware(
    thunkMiddleware
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
