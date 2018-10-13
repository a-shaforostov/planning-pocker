/**
 * Component. Public page
 * @file
 */

import React, { Component } from "react";
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Grid, Button, Form, Input, Label, Message, Segment } from 'semantic-ui-react'

import MarksEditor from '../../components/MarksEditor';
import PlaygroundObserver from '../../components/PlaygroundObserver';
import Stats from '../../components/Stats';

import './MainPage.css';

class MainPage extends Component {
  handleChange = path => e => {
    this.props.updateField({ path, value: e.target.value });
  };

  handleStartSession = e => {
    e.preventDefault();
    const { login, marks } = this.props;
    this.props.createSession({ login, marks });
  };

  render() {
    const { page, login, isConnected, sessionId, jira, error } = this.props;
    const url = `${window.location.origin}/${sessionId}`;
    return (
      page === 'main' &&
      <Grid centered>
        <Grid.Column>
          <Segment>
            {
              error &&
              <Message negative size='small'>
                <Message.Header>Сталася прикра помилка</Message.Header>
                <p>{error}</p>
              </Message>
            }
            {
              !sessionId &&
              <Form className="observer__login">
                <Form.Field>
                  <Input icon={{name: 'asterisk', color: 'red'}} label="Ім'я ведучого:" type="text" value={login}
                         onChange={this.handleChange('data.login')}/>
                </Form.Field>
                <div><b>Інтеграція з Jira:</b></div>
                <Form.Field>
                  <Input label="Jira url:" type="text" value={jira.url} onChange={this.handleChange('data.jira.url')}/>
                </Form.Field>
                <Form.Field>
                  <Input label="Логін:" type="text" value={jira.login} onChange={this.handleChange('data.jira.login')}/>
                </Form.Field>
                <Form.Field>
                  <Input className="pass__input" label="Пароль:" type="password" value={jira.pass}
                         onChange={this.handleChange('data.jira.pass')}/>
                </Form.Field>
              </Form>
            }

            <MarksEditor disabled={!!sessionId} />

            {
              !sessionId && isConnected &&
              <Button fluid onClick={this.handleStartSession} color="green" disabled={!login}>Створити сесію</Button>
            }

            {
              sessionId &&
              <div>
                <div>Посилання для гравців:</div>
                <a href={url} target="_blank">{url}</a>
              </div>
            }
            <PlaygroundObserver />
          </Segment>
        </Grid.Column>
        <Stats />
      </Grid>
    )
  }
}

export default connect(
  {
    page: state`data.page`,
    login: state`data.login`,
    error: state`data.error`,
    isConnected: state`data.isConnected`,
    jira: state`data.jira`,
    sessionId: state`data.sessionId`,
    marks: state`data.marks.items`,
    // player2Index: state`data.player2Index`,
    createSession: signal`createSession`,
    updateField: signal`updateField`,
    // updateName: sequences`updateName`,
    // newGame: sequences`newGame`,
  },
  MainPage,
);
