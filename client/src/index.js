import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from '@cerebral/react';
import App from 'cerebral'
import main from "./app";

import './index.css';
import 'semantic-ui-css/semantic.min.css';

import Application from './components/Application';

import registerServiceWorker from './registerServiceWorker';
import Devtools from "cerebral/devtools";

let devtools = null;

if (process.env.NODE_ENV !== 'production') {
  devtools = Devtools({
    host: 'localhost:8585',
    bigComponentsWarning: 20,
  });
}

const app = App(main, {
  // The devtools
  devtools,
  // Also logs error handling to console.
  throwToConsole: true,
  // Prevent rethrow of errors (useful if you already use an on('error') handler)
  noRethrow: false,
  // A map of state changes to run before instantiation,
  // where the key is the path and value is the state value
  stateChanges: {},
  // Sequence execution returns promises
  returnSequencePromise: false
});

ReactDOM.render(
  <Container app={app}>
    <Application />
  </Container>,
  document.getElementById('root'),
);

registerServiceWorker();

if (module.hot) {
    module.hot.accept();
}
