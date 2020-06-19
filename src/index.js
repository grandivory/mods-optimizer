import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import modsOptimizer from "./state/reducers/modsOptimizer";
import getDatabase from "./state/storage/Database";
import { showError } from "./state/actions/app";
import { databaseReady } from "./state/actions/storage";

const store = createStore(
  modsOptimizer,
  applyMiddleware(
    thunkMiddleware
  )
);

// Instantiate the database
getDatabase(
  () => store.dispatch(databaseReady(store.getState())),
  (error) => {
    if (error instanceof DOMException) {
      store.dispatch(showError(
        [
          <p key={1}>Unable to load database. This may be caused by a bug in Firefox in Private Browsing mode or
          with history turned off. If using Firefox, please switch to normal browsing mode. If you are still having
            issues, please ask for help in the discord server below.</p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>,
          <p key={3}>Error Message: {error.message}</p>,
        ]
      ));
    } else {
      store.dispatch(showError(
        [
          <p key={1}>
            Unable to load database: {error.message} Please fix the problem and try again, or ask for help in the
            discord server below.
          </p>,
          <p key={2}>Grandivory's mods optimizer is tested to work in <strong>Firefox, Chrome, and Safari on desktop
            only</strong>! Other browsers may work, but they are not officially supported. If you're having trouble, try
            using one of the supported browsers before asking for help.</p>
        ]
      ));
    }
  }
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
