/**
 * Component. Application
 * @file
 */

import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';

import './Application.css';
import WebSocketProvider from '../WebSocketProvider';
import MainPage from 'pages/MainPage';
import SessionPage from 'pages/SessionPage';
// import GamePage from 'pages/GamePage';
// import ResultsPage from 'pages/ResultsPage';

class Application extends Component {
  render() {
    const { isConnected } = this.props;
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
    // applicationLoaded: sequences`applicationLoaded`,
  },
  Application,
);
