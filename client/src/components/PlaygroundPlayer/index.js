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
    <Fragment>
      <div style={{ marginBottom: '-10px' }}><b>Оцінки гравців:</b></div>
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
    </Fragment>
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
        const { playground, setTime, time } = this.props;
        console.log(this.props);
        if (playground && playground.currentStory) {
          if (playground.currentStory.finish) {
            // Історія оцінена всіма учасниками
            const delta = new Date(playground.currentStory.finish - playground.currentStory.start);
            const formated = formatTime(delta);
            if (formated !== time) {
              setTime({time: formatTime(delta)});
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
          !playground.sessionFinished &&
          <Fragment>
            {
              !playground.currentStory &&
              <div>
                <div>&nbsp;</div>
                <Icon loading name='asterisk' />
                Чекаємо історію на оцінювання...
              </div>
            }
            {
              playground.currentStory &&
              <Fragment>
                <Form>
                  <div>&nbsp;</div>
                  <div>{time} <b>Історія #{playground.currentStory.num}:</b></div>
                  <TextArea
                    value={playground.currentStory.text}
                    disabled={true}
                    rows={6}
                  />
                </Form>
                <div>&nbsp;</div>

                <MarksPanel />
              </Fragment>
            }
            { playersInGame(this.props) }
            {
              playground.currentStory && playground.currentStory.finish &&
              <div>
                <div>&nbsp;</div>
                <Icon loading name='asterisk' />
                Чекаємо рішення ведучого...
              </div>
            }
          </Fragment>
        }
        {
          playground.sessionFinished &&
          <div>
            <div>&nbsp;</div>
            Сесія закрита. Приєднуйтесь до іншої або створюйте нову.
          </div>
        }
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
