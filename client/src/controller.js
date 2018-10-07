/**
 * Controller for operate application
 * @module controller
 */

import { Controller } from 'cerebral';
import Devtools from 'cerebral/devtools';

import app from './app/index';

const controller = Controller(app, {
  // devtools: null,
  devtools: navigator.userAgent.toLowerCase().includes('chrome')
    ? Devtools({
      host: 'localhost:8686',
      bigComponentsWarning: 20,
    })
    : null
});

export default controller;
