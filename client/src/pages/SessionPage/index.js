/**
 * Component. Public page
 * @file
 */

import React, { Component } from "react";
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button, Form, Input, Label } from 'semantic-ui-react'
import router from '../../app/router';

import Playground from '../../components/Playground';

class MainPage extends Component {
  handleChange = path => e => {
    this.props.updateField({ path, value: e.target.value });
  };

  handleJoinSession = e => {
    e.preventDefault();
    const { joinSession, login } = this.props;
    joinSession({ login });
  };

  render() {
    const { page, login, sessionId, auth, isConnected, error } = this.props;
    const url = `${window.location.origin}/${sessionId}`;
    return (
      page === 'session' &&
      <div className="container">
        {
          sessionId &&
          <div>Сесія: {sessionId}</div>
        }
        <Form onSubmit={this.handleJoinSession}>
          <Form.Group>
            <Form.Field>
              <Input label="Ім'я гравця:" type="text" value={login} onChange={this.handleChange('data.login')} />
            </Form.Field>
            <Button type="submit" color="green" disabled={auth || !isConnected || !login}>Приєднатися до сесії</Button>
          </Form.Group>
        </Form>
        {
          error &&
          <div className="error" style={{ color: 'red' }}>{error}</div>
        }
        <Playground />
      </div>
    );
  }
}

export default connect(
  {
    page: state`data.page`,
    login: state`data.login`,
    auth: state`data.auth`,
    isConnected: state`data.isConnected`,
    error: state`data.error`,
    sessionId: state`data.sessionId`,
    // player2Index: state`data.player2Index`,
    joinSession: signal`joinSession`,
    updateField: signal`updateField`,
    // updateName: sequences`updateName`,
    // newGame: sequences`newGame`,
  },
  MainPage,
);
