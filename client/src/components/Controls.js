/**
 * Component. Application
 * @file
 */

import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import injectSheet from 'react-jss';

const styles = {
  container: {
    width: '440px',
    margin: '0 auto',
    backgroundColor: 'lightgray',
    padding: '10px',
  },
  table: {
    width: '100%',
  },
  turn: {
    padding: '1%',
    width: '100%',
    height: '15px',
  }
};

class Controls extends Component {
  handleChange = path => e => {
    this.props.updateField({ path, value: e.target.value });
  };

  handleThrowStone = e => {
    e.preventDefault();
    this.props.newTurn();
  };

  render() {
    const { classes, turnParams } = this.props;
    return (
      <div className={classes.container}>
        <form onSubmit={this.handleThrowStone}>
          <span>Кут:</span>&nbsp;
          <input type="number" min="-5" max="5" step="0.01" name="angle" value={turnParams.angle} onChange={this.handleChange('turnParams.angle')}/>&nbsp;
          <span>Сила:</span>&nbsp;
          <input type="number" min="10" max="100" name="power" value={turnParams.power} onChange={this.handleChange('turnParams.power')}/>&nbsp;
          <button type="submit">Кинути</button>
        </form>
      </div>
    )
  }
}

export default connect(
  {
    turnParams: state`turnParams`,
    updateField: signal`updateField`,
    newTurn: signal`newTurn`,
  },
  injectSheet(styles)(Controls),
);
