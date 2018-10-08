import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';

class Playground extends Component {
  render() {
    const { playground } = this.props;
    if (!playground) return null;

    return (
      <div>
        <p><b>Ведучий:</b> {playground.observer}</p>
        <p><b>Гравці:</b></p>
        {
          playground.players.map(p => (
            <div key={p}>{p}</div>
          ))
        }
      </div>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
  },
  Playground,
);
