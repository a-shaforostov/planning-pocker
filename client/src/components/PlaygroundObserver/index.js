import React, { Component, Fragment } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { formatTime } from '../../app/helpers';
import {Button, Label, Form, TextArea, Icon, Table} from 'semantic-ui-react';

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

const playersList = (props) => {
  const { playground: { players }, login } = props;
  return (
    <Fragment>
      <span>
        <strong>Список гравців: </strong>
        {
          players.map(p => (
            <span key={p} style={login === p ? {color: 'blue', fontWeight: 700} : {}}>{p}, </span>
          ))
        }
      </span>
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

  render() {
    const { playground, time, issueedit, storyedit } = this.props;
    if (!playground) return null;

    let finalMark;

    return (
      <Fragment>
        <div>&nbsp;</div>
        <p><b>Ведучий:</b> {playground.observer}</p>
        { playersList(this.props) }
        <Form>
          {
            !playground.currentStory &&
            <Fragment>
              <p></p>
              <div><b>Історія для оцінювання гравцями:</b></div>
              <Form.Input
                icon={{ name: 'send', color: 'blue', circular: true, link: true, onClick: this.createStoryFromJira }}
                placeholder="Введіть jira issue key or ID ..."
                onKeyDown={this.keyUp}
                value={issueedit}
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
            placeholder="... або введіть текст story"
            value={storyedit}
            disabled={!!playground.currentStory}
            onChange={this.handleChange(`data.storyedit`)}
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
            <div>
              <Button color="blue" onClick={this.newStory}>Наступна історія</Button>
              <Button color="red" onClick={this.finishSession}>Закрити сесію</Button>
            </div>
          </Fragment>
        }
      </Fragment>
    )
  }
}

export default connect(
  {
    playground: state`data.playground`,
    issueedit: state`data.issueedit`,
    storyedit: state`data.storyedit`,
    time: state`time`,
    login: state`data.login`,
    updateField: signal`updateField`,
    createStory: signal`createStory`,
    createStoryFromJira: signal`createStoryFromJira`,
    setTime: signal`setTime`,
    finishStory: signal`finishStory`,
    newStory: signal`newStory`,
  },
  PlaygroundObserver,
);
