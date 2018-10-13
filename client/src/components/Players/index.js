import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state } from 'cerebral/tags';

import { Rail, Segment } from 'semantic-ui-react';

import './Players.css';

const playersList = (props) => {
  const { playground: { players }, login } = props;
  return (
    <Fragment>
      <span>
        <strong>Список гравців: </strong>
        {
          players.map(p => (
            <div
              className="player__rail"
              key={p}
              style={login === p ? {color: 'blue', fontWeight: 700} : {}}
            >
              {p}
            </div>
          ))
        }
      </span>
    </Fragment>
  )
};

class Players extends Component {
  render() {
    const { playground } = this.props;
    return (
      <Rail position='left' className="players__rail">
        <Segment>
          <b>Ведучий:</b>
          <div className="player__rail" style={{ color: 'blue', fontWeight: 700 }}>{playground.observer}</div>
          <div>&nbsp;</div>
          { playersList(this.props) }
        </Segment>
      </Rail>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
    login: state`data.login`,
  },
  Players,
);
