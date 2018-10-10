import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import {Form, Icon, Table, TextArea} from 'semantic-ui-react';

import MarksPanel from '../MarksPanel';
import {formatTime} from "../../app/helpers";

let timerId;

const playersInGame = (props, finished) => {
  const { playground, login } = props;
  const { currentStory } = playground;
  if (!currentStory) return null;

  return (
    <Table celled striped>
      <Table.Body>
      {
        currentStory.players.map(p => {
          let mark, delta;
          if (p.mark === true) {
            mark = <Icon name="plus" />
          } else if (p.mark === false) {
            mark = <Icon name="minus" />
          } else {
            mark = currentStory.finish ? p.mark : <Icon name="plus" />;
          }
          delta = p.time && new Date(p.time - currentStory.start);

          return (
            <Table.Row key={p.login}>
              <Table.Cell><div style={{color: login === p.login ? 'blue' : 'black'}}>{p.login}</div></Table.Cell>
              <Table.Cell textAlign='center'>{mark}</Table.Cell>
              <Table.Cell textAlign='center'>{delta ? formatTime(delta) : '-'}</Table.Cell>
            </Table.Row>
          )
        })
      }
      </Table.Body>
    </Table>
  )
};

const playersList = (props) => {
  const { playground: { players }, login } = props;
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

class PlaygroundPlayer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    if (!timerId) {
      timerId = setInterval(() => {
        const { playground, setTime } = this.props;
        console.log(this.props);
        if (playground && playground.currentStory) {
          if (playground.currentStory.finish) {
            // Історія оцінена всіма учасниками
            const delta = new Date(playground.currentStory.finish - playground.currentStory.start);
            setTime({ time: formatTime(delta) });
            if (timerId) {
              clearInterval(timerId);
            }
          } else {
            const delta = new Date(new Date().getTime() - playground.currentStory.start);
            setTime({time: formatTime(delta)});
          }
        }
      }, 1000);
    }
  };

  componentWillUnmount = () => {
    if (timerId) {
      clearInterval(timerId);
    }
  };

  render() {
    const { playground, time } = this.props;
    if (!playground) return null;

    return (
      <div>
        <p><b>Ведучий:</b> {playground.observer}</p>
        { playersList(this.props) }

        {
          playground.currentStory &&
          <Form>
            <span>{time}&nbsp;&nbsp;&nbsp;<b>Історія, що розглядається:</b></span>
            <TextArea
              value={playground.currentStory.text}
              disabled={true}
              rows={6}
            />
          </Form>
        }
        <div>&nbsp;</div>

        <MarksPanel />
        { playersInGame(this.props) }
      </div>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
    login: state`data.login`,
    time: state`time`,
    setTime: signal`setTime`,
  },
  PlaygroundPlayer,
);
