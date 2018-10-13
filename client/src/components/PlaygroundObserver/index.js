import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { formatTime } from '../../app/helpers';
import {Button, Label, Form, TextArea, Icon, Table, Segment } from 'semantic-ui-react';

import History from '../../components/History';
import Players from '../../components/Players';

import './PlaygroundObserver.css';

let timerId;

const playersInGame = (props) => {
  const { playground, finishStory } = props;
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
            } else if (currentStory.finish) {
              mark = (
                <Button
                  color="green"
                  size="mini"
                  disabled={!!currentStory.result}
                  onClick={() => finishStory({ result: p.mark })}
                >
                  {p.mark}
                </Button>
              )
            } else {
              mark = p.mark
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
        const { playground, setTime, time } = this.props;
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
    const { createStory, storyedit: story } = this.props;
    createStory({ story });
  };

  createStoryFromJira = () => {
    const { createStoryFromJira, issueedit } = this.props;
    createStoryFromJira({ issue: issueedit });
  };

  keyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.nativeEvent.stopImmediatePropagation();
      this.createStoryFromJira();
    }
  };

  finishStory = result => () => {
    this.props.finishStory({ result });
  };

  newStory = () => {
    this.props.newStory();
  };

  revoteStory = () => {
    this.props.revoteStory();
  };

  stopSession = () => {
    this.props.stopSession();
  };

  showStats = () => {
    this.props.showStats({ visible: true });
  };

  downloadFile = (e) => {
    e.preventDefault();
    const { data, sessionId } = this.props;
    if (data) {
      const uri = "data:application/json,"+encodeURIComponent(JSON.stringify(data));
      this.props.downloadFile({ data: uri, filename: `${sessionId}.json` });
    }
  };

  render() {
    const { playground, time, issueedit, storyedit, jira } = this.props;
    if (!playground) return null;

    let finalMark;

    return (
      <Fragment>
        <Players />
        <History />
        <Form>
          {
            !playground.currentStory &&
            <Fragment>
              <p></p>
              <div><b>Історія для оцінювання гравцями:</b></div>
              <Form.Input
                icon={{ name: 'send', color: 'blue', circular: true, link: true, onClick: this.createStoryFromJira }}
                onKeyDown={this.keyUp}
                value={issueedit}
                disabled={!jira.url || playground.sessionFinished}
                placeholder={!jira.url ? 'Не вказані реквізити доступу до Jira' : 'Введіть Jira issue key or ID ...'}
                onChange={this.handleChange(`data.issueedit`)}
              />
            </Fragment>
          }
          {
            playground.currentStory &&
            <Fragment>
              <div>&nbsp;</div>
              <span>{time} <b>Історія #{playground.currentStory.num}:</b></span>
            </Fragment>
          }
          <TextArea
            placeholder={!jira.url ? 'Введіть текст історії' : '... або введіть текст історії'}
            value={storyedit}
            disabled={!!playground.currentStory || playground.sessionFinished}
            onChange={this.handleChange(`data.storyedit`)}
            rows={6}
          />
          <div>&nbsp;</div>
          {
            !playground.currentStory && !playground.sessionFinished &&
            <Fragment>
              <Button color="green" onClick={this.createStory}>
                {
                  playground.state === 'sendingStory' &&
                  <Icon loading name='asterisk' />
                }
                Почати оцінювання
              </Button>
              <Button color="red" onClick={this.stopSession}>Закрити сесію</Button>
            </Fragment>
          }
        </Form>

        { playersInGame(this.props) }

        {/* Остаточне оцінювання */}
        {
          playground.currentStory && !playground.currentStory.result &&
          <Fragment>
            {
              playground.currentStory &&
              <div><b>Остаточне оцінювання:</b></div>
            }
            {
              finalMark &&
              <div>
                <Button onClick={this.finishStory(finalMark)}>Завершити з оцінкою {finalMark}</Button>
                <div>або оберіть оцінку із запропонованих гравцями</div>
              </div>
            }
            {
              playground.currentStory && playground.currentStory.finish &&
              <Fragment>
                оберіть оцінку із запропонованих гравцями або
                <Button onClick={this.finishStory('?')}>Завершити з невизначеним результатом</Button>
              </Fragment>
            }
            {
              playground.currentStory && !playground.currentStory.finish &&
              <Button onClick={this.finishStory('?')}>Завершити достроково з невизначеним результатом</Button>
            }
          </Fragment>
        }

        {/* Остаточний результат */}
        {
          playground.currentStory && playground.currentStory.result &&
          <Fragment>
            <div>Історія оцінена. Результат: <Label>{playground.currentStory.result}</Label></div>
            <div>&nbsp;</div>
          </Fragment>
        }

        {/* Керування сесією */}
        {
          playground.currentStory && playground.currentStory.result && !playground.sessionFinished &&
          <Fragment>
            <Button.Group>
              <Button className="control__button" color="blue" onClick={this.newStory}>Наступна історія</Button>
              <Button className="control__button" color="orange" onClick={this.revoteStory}>Переголосувати</Button>
              <Button className="control__button" color="red" onClick={this.stopSession}>Закрити сесію</Button>
            </Button.Group>
          </Fragment>
        }
        {
          playground.sessionFinished &&
          <div>
            <div>&nbsp;</div>
            Сесія закрита. Для створення нової сесії оновіть сторінку.
            <Button color="blue" onClick={this.showStats}>Переглянути статистику...</Button>
            <Button icon color="green" onClick={this.downloadFile}><Icon name="save" />Зберегти сесію</Button>
          </div>
        }
      </Fragment>
    )
  }
}

export default connect(
  {
    data: state`data`,
    playground: state`data.playground`,
    issueedit: state`data.issueedit`,
    storyedit: state`data.storyedit`,
    jira: state`data.jira`,
    sessionId: state`data.sessionId`,
    time: state`time`,
    login: state`data.login`,
    updateField: signal`updateField`,
    createStory: signal`createStory`,
    createStoryFromJira: signal`createStoryFromJira`,
    setTime: signal`setTime`,
    finishStory: signal`finishStory`,
    newStory: signal`newStory`,
    revoteStory: signal`revoteStory`,
    stopSession: signal`stopSession`,
    showStats: signal`showStats`,
    downloadFile: signal`downloadFile`,
  },
  PlaygroundObserver,
);
