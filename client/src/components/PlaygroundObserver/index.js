import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { formatTime } from '../../app/helpers';
import {Button, Input, Form, TextArea, Icon, Table} from 'semantic-ui-react';

let timerId;

const playersInGame = (props) => {
  const { playground } = props;
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
            mark = <Button
              disabled={p.mark === '?'}
              color="green"
              size="mini"
            >
              {p.mark}
            </Button>
            ;
          }
          delta = p.time && new Date(p.time - currentStory.start);

          return (
            <Table.Row key={p.login}>
              <Table.Cell>{p.login}</Table.Cell>
              <Table.Cell textAlign='center'>{mark}</Table.Cell>
              <Table.Cell textAlign='center'>{delta ? formatTime(delta) : '-'}</Table.Cell>
            </Table.Row>
          );
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
      <p>Коли всі зберуться, публікуйте першу історію.</p>
    </Fragment>
  )
};

class PlaygroundObserver extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    if (!timerId) {
      timerId = setInterval(() => {
        const { playground, setTime } = this.props;
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
            setTime({ time: formatTime(delta) });
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

  handleChange = path => e => {
    this.props.updateField({ path, value: e.target.value });
  };

  createStory = () => {
    const { createStory, playground: { storyedit: story } } = this.props;
    createStory({ story });
  };

  createStoryFromJira = () => {
    const { createStoryFromJira, playground } = this.props;
    createStoryFromJira({ issue: playground.issueeditor });
  };

  keyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      this.createStoryFromJira();
    }
  };

  render() {
    const { playground, login, time } = this.props;
    if (!playground) return null;

    return (
      <div>
        <div>&nbsp;</div>
        <p><b>Ведучий:</b> {playground.observer}</p>
        { playersList(this.props) }
        <Form>
          {
            !playground.currentStory &&
            <Form.Input
              icon={{ name: 'send', color: 'blue', circular: true, link: true, onClick: this.createStoryFromJira }}
              placeholder="Введіть jira issue (ABC-123) ..."
              onKeyDown={this.keyUp}
              value={playground.issueeditor}
              onChange={this.handleChange(`data.playground.issueeditor`)}
            />
          }
          {
            playground.currentStory &&
            <span>{time}&nbsp;&nbsp;&nbsp;<b>Історія, що розглядається:</b></span>
          }
          <TextArea
            placeholder="... або введіть текст story"
            value={playground.storyedit}
            disabled={!!playground.currentStory}
            onChange={this.handleChange(`data.playground.storyedit`)}
            rows={6}
          />
          <div>&nbsp;</div>
          {
            !playground.currentStory &&
            <Button color="green" onClick={this.createStory}>
              {
                playground.state === 'sendingStory' &&
                <Icon loading name='asterisk' />
              }
              Почати оцінювання
            </Button>
          }
        </Form>

        { playersInGame(this.props) }

      </div>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
    time: state`time`,
    login: state`data.login`,
    updateField: signal`updateField`,
    createStory: signal`createStory`,
    createStoryFromJira: signal`createStoryFromJira`,
    setTime: signal`setTime`,
  },
  PlaygroundObserver,
);
