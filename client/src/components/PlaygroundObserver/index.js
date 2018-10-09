import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';

const playersInGame = (story, login) => {
  return story.players.map(p => (
    <table>
      <tr key={p.login}>
        <td><div style={{color: login === p.login ? 'blue' : 'black'}}>{p.login}</div></td>
        <td><div>{p.mark}</div></td>
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
      <p>Коли всі зберуться, публікуйте першу історію.</p>
    </Fragment>
  )
};

class PlaygroundObserver extends Component {
  render() {
    const { session, login } = this.props;
    if (!session) return null;

    return (
      <div>
        <div>&nbsp;</div>
        <p><b>Ведучий:</b> {session.observer}</p>
        { playersList(session.players, login) }
      </div>
    )
  }
}

export default connect(
  {
    session: state`data.playground`,
    login: state`data.login`,
  },
  PlaygroundObserver,
);
