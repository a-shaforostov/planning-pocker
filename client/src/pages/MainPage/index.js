/**
 * Component. Public page
 * @file
 */

import React, { Component } from "react";
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button, Form, Input, Label } from 'semantic-ui-react'
import router from '../../app/router';
import MarksEditor from '../../components/MarksEditor';

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
    const { page, login, sessionId, jiraUrl, jiraLogin, jiraPass } = this.props;
    const url = `${window.location.origin}/${sessionId}`;
    return (
      page === 'main' &&
      <div className="container">
        {
          !sessionId &&
          <Form>
            <Form.Field>
              <Input icon={{name: 'asterisk', color: 'red'}} label="Ім'я ведучого:" type="text" value={login}
                     onChange={this.handleChange('data.login')}/>
            </Form.Field>
            <div><b>Інтеграція з Jira:</b></div>
            <Form.Field>
              <Input label="Jira url:" type="text" value={jiraUrl} onChange={this.handleChange('data.jiraUrl')}/>
            </Form.Field>
            <Form.Field>
              <Input label="Логін:" type="text" value={jiraLogin} onChange={this.handleChange('data.jiraLogin')}/>
            </Form.Field>
            <Form.Field>
              <Input className="pass__input" label="Пароль:" type="password" value={jiraPass}
                     onChange={this.handleChange('data.jiraPass')}/>
            </Form.Field>
          </Form>
        }

        <MarksEditor disabled={!!sessionId} />

        {
          !sessionId &&
          <Button onClick={this.handleStartSession} color="green" disabled={!login}>Створити сесію</Button>
        }

        {
          sessionId &&
          <div>
            <div>Посилання для гравців:</div>
            {/*<a href={url} target="_blank">{url}</a>*/}
            <a href={url}>{url}</a>
          </div>
        }
      </div>
    );
  }
}

export default connect(
  {
    page: state`data.page`,
    login: state`data.login`,
    jiraUrl: state`data.jiraUrl`,
    jiraLogin: state`data.jiraLogin`,
    jiraPass: state`data.jiraPass`,
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
