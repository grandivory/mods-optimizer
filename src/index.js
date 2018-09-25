import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import {optimizerApp} from "./state/reducers";
import {createStore} from "redux";
import {Provider} from "react-redux";

const store = createStore(optimizerApp);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
