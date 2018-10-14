/**
 * Component. Public page
 * @file
 */

import React, { Component, Fragment } from "react";
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Grid, Button, Form, Input, Icon, Message, Segment } from 'semantic-ui-react'

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

  handleLoadData = (e) => {
    e.preventDefault();
    e.target.files[0] &&
    this.props.loadFile({ filename: e.target.files[0] });
    e.target.value = null;
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
              isConnected &&
              <Fragment>
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
              </Fragment>
            }
            {
              !sessionId && isConnected &&
              <Fragment>
                <Button.Group fluid>
                  <Button onClick={this.handleStartSession} color="blue" disabled={!login}>Створити сесію</Button>
                  <Button.Or text='або' />
                  <input
                    accept="application/json"
                    className="input__file"
                    id="button-data-load"
                    type="file"
                    onChange={this.handleLoadData}
                    hidden
                  />
                  <label htmlFor="button-data-load">
                    <Button icon color="green" as="span">
                      &nbsp;&nbsp;&nbsp;&nbsp;<Icon name="folder open" />&nbsp;&nbsp;
                      Завантажити сесію
                    </Button>
                  </label>
                </Button.Group>
              </Fragment>
            }
            {
              !isConnected &&
              <Fragment>
                <input
                  accept="application/json"
                  className="input__file"
                  id="button-data-load"
                  type="file"
                  onChange={this.handleLoadData}
                  hidden
                />
                <label htmlFor="button-data-load" style={{ width: '100%' }}>
                  <Button fliud icon color="green" as="span" style={{ display: 'block' }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;<Icon name="folder open" />&nbsp;&nbsp;
                    Завантажити сесію
                  </Button>
                </label>
              </Fragment>
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
    createSession: signal`createSession`,
    updateField: signal`updateField`,
    loadFile: signal`loadFile`,
  },
  MainPage,
);
