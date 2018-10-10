import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import {Button, Input, Form, TextArea, Icon, Table} from 'semantic-ui-react';

let timerId;

const playersInGame = (story) => {
  if (!story) return null;

  return story.players.map(p => {
    let mark;
    if (p.mark === true) {
      mark = <Icon name="plus" />
    } else if (p.mark === false) {
      mark = <Icon name="minus" />
    } else {
      mark = p.mark;
    }

    return (
      <Table celled striped>
        <Table.Body>
          <Table.Row key={p.login}>
            <Table.Cell>{p.login}</Table.Cell>
            <Table.Cell>
              { mark }
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
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
        console.log(this.props);
        if (playground && playground.currentStory) {
          const delta = new Date(new Date().getTime() - playground.currentStory.start);

          setTime({
            time: `
              ${String(delta.getUTCHours()).padStart(2, '0')}:
              ${String(delta.getMinutes()).padStart(2, '0')}:
              ${String(delta.getSeconds()).padStart(2, '0')}`
          });
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
        { playersList(playground.players, login) }
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

        { playersInGame(playground.currentStory) }

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
