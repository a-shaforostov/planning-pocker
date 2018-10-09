import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';

import MarksPanel from '../MarksPanel';

const playersInGame = (story, login, finished) => {
  return story.players.map(p => (
    <table>
      <tr key={p.login}>
        <td><div style={{color: login === p.login ? 'blue' : 'black'}}>{p.login}</div></td>
        <td><div>
          {
            finished
              ? p.mark
              : !!p.mark
          }
        </div></td>
      </tr>
    </table>
  ))
};

const playersList = (players, login) => {
  return (
    <Fragment>
      <b>Список гравців: </b>
      {
        players.map(p => (
          <span key={p}><span style={login === p ? {color: 'blue', fontWeight: 700} : {}}>{p}</span>,&nbsp;</span>
        ))
      }
      <p>Чекаємо інших учасників та першу історію...</p>
    </Fragment>
  )
};

const players = (story, players, login, finished) => story ? playersInGame(story, login) : playersList(players, login);

class PlaygroundPlayer extends Component {
  render() {
    const { session, login } = this.props;
    if (!session) return null;

    return (
      <div>
        <p><b>Ведучий:</b> {session.observer}</p>
        { players(session.currentStory, session.players, login, session.status === 'finished') }
        <MarksPanel />
      </div>
    )
  }
}

export default connect(
  {
    session: state`data.playground`,
    login: state`data.login`,
  },
  PlaygroundPlayer,
);
