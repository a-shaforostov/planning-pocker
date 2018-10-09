import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';

import MarksPanel from '../MarksPanel';

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
        <MarksPanel />
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
