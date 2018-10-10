import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button, Form, TextArea, Icon } from 'semantic-ui-react';

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
  handleChange = path => e => {
    this.props.updateField({ path, value: e.target.value });
  };

  createStory = () => {
    const { createStory, playground: { storyedit: story } } = this.props;
    createStory({ story });
  };

  createStoryFromJira = () => {
    const { createStoryFromJira } = this.props;
    createStoryFromJira({ issue: 'BIT-283' });
  };

  render() {
    const { playground, login } = this.props;
    if (!playground) return null;

    return (
      <div>
        <div>&nbsp;</div>
        <p><b>Ведучий:</b> {playground.observer}</p>
        { playersList(playground.players, login) }
        <Form>
          <TextArea
            placeholder="Історія для оцінювання"
            value={playground.storyedit}
            disabled={!!playground.currentStory}
            onChange={this.handleChange(`data.playground.storyedit`)}
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
          <Button onClick={this.createStoryFromJira}>Jira</Button>
        </Form>
      </div>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
    login: state`data.login`,
    updateField: signal`updateField`,
    createStory: signal`createStory`,
    createStoryFromJira: signal`createStoryFromJira`,
  },
  PlaygroundObserver,
);
