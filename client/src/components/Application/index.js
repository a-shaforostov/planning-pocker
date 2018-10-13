/**
 * Component. Application
 * @file
 */

import React, { Component } from 'react';
import { connect } from "@cerebral/react";
// import { state, signal } from 'cerebral/tags';

import './Application.css';
import WebSocketProvider from '../WebSocketProvider';
import MainPage from 'pages/MainPage';
import SessionPage from 'pages/SessionPage';

class Application extends Component {
  render() {
    return (
      <div className="container">
        <h1>Planning poker <WebSocketProvider /></h1>
        <MainPage />
        <SessionPage />
      </div>
    )
  }
}

export default connect(
  {
  },
  Application,
);
