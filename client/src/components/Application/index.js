/**
 * Component. Application
 * @file
 */

import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import {  signal } from 'cerebral/tags';
import { Container } from '@cerebral/react';

import MainPage from 'pages/MainPage';
// import GamePage from 'pages/GamePage';
// import ResultsPage from 'pages/ResultsPage';
import controller from "../../controller";

class Application extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container controller={controller}>
        <div className={classes.container}>
          <MainPage />
        </div>
      </Container>
    )
  }
}

export default connect(
  {
    // applicationLoaded: signal`applicationLoaded`,
  },
  Application,
);
