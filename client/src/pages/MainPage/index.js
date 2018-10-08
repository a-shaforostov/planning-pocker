/**
 * Component. Public page
 * @file
 */

import React, { Component } from "react";
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button, Form, Input, Label } from 'semantic-ui-react'
import router from '../../app/router';

class MainPage extends Component {
  handleChange = path => e => {
    this.props.updateField({ path, value: e.target.value });
  };

  handleStartSession = e => {
    e.preventDefault();
    const { login } = this.props;
    this.props.createSession({ login });
  };

  render() {
    const { page, login, sessionId } = this.props;
    const url = `${window.location.origin}/${sessionId}`;
    return (
      page === 'main' &&
      <div className="container">
        <Form onSubmit={this.handleStartSession}>
          <Form.Group>
            <Form.Field>
              <Input label="Ім'я ведучого:" type="text" value={login} onChange={this.handleChange('data.login')} />
            </Form.Field>
            <Button type="submit" color="green" disabled={!!sessionId}>Створити сесію</Button>
          </Form.Group>
        </Form>
        {
          sessionId &&
          <div>
            <div>Посилання для гравців:</div>
            <a href={url} target="_blank">{url}</a>
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
    sessionId: state`data.sessionId`,
    // player2Index: state`data.player2Index`,
    createSession: signal`createSession`,
    updateField: signal`updateField`,
    // updateName: sequences`updateName`,
    // newGame: sequences`newGame`,
  },
  MainPage,
);