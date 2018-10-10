import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import {Form, Icon, Table, TextArea} from 'semantic-ui-react';

import MarksPanel from '../MarksPanel';

const playersInGame = (story, login, finished) => {
  if (!story) return null;

  return story.players.map(p => {
    let mark;
    if (p.mark === true) {
      mark = <Icon name="plus" />
    } else if (p.mark === false) {
      mark = <Icon name="minus" />
    } else {
      mark = finished ? p.mark : !!p.mark;
    }

    return (
      <Table celled striped>
        <Table.Body>
          <Table.Row key={p.login}>
            <Table.Cell><div style={{color: login === p.login ? 'blue' : 'black'}}>{p.login}</div></Table.Cell>
            <Table.Cell>
              { mark }
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  })
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
    const { playground, login } = this.props;
    if (!playground) return null;

    return (
      <div>
        <p><b>Ведучий:</b> {playground.observer}</p>
        { playersList(playground.players, login) }

        {
          playground.currentStory &&
          <Form>
            <TextArea
              value={playground.currentStory.text}
              disabled={true}
              rows={6}
            />
          </Form>
        }
        <div>&nbsp;</div>

        <MarksPanel />
        { playersInGame(playground.currentStory, login, playground.status === 'finished') }
      </div>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
    login: state`data.login`,
  },
  PlaygroundPlayer,
);
