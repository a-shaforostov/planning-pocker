import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button } from 'semantic-ui-react';
import { Table, Modal } from 'semantic-ui-react';

import { formatTime } from '../../app/helpers';
import './Stats.css';

class Stats extends Component {
  closeStats = () => {
    this.props.showStats({ visible: false });
  };

  render() {
    const { isVisible, stats } = this.props;
    if (!stats) return null;

    const { avgTimes, mostVariablePlayer, mostVariableStories } = stats;
    return (
      <Modal size="small" open={isVisible} onClose={this.closeStats}>
        <Modal.Header>Статистика сесії</Modal.Header>
        <Modal.Content>
          <Table celled>
            <Table.Header className="stat__table__header">
              <Table.Row>
                <Table.HeaderCell colSpan='2'>Середній час на голосування по кожному учаснику:</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Учасник</Table.HeaderCell>
                <Table.HeaderCell>Середній час</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                Object.entries(avgTimes).map(([login, time]) => (
                  <Table.Row key={login}>
                    <Table.Cell>{login}</Table.Cell>
                    <Table.Cell>{formatTime(new Date(time))}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>

          <Table celled>
            <Table.Header className="stat__table__header">
              <Table.Row>
                <Table.HeaderCell colSpan='2'>Учасники, які мали найбільшу різницю в своїх оцінках:</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Учасники</Table.HeaderCell>
                <Table.HeaderCell>Різниця</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{mostVariablePlayer.logins.join(', ')}</Table.Cell>
                <Table.Cell>{mostVariablePlayer.max}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <Table celled>
            <Table.Header className="stat__table__header">
              <Table.Row>
                <Table.HeaderCell colSpan='4'>Топ 3 user story, які отримали найрізноманітніші оцінки від учасників:</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>№</Table.HeaderCell>
                <Table.HeaderCell>Issue</Table.HeaderCell>
                <Table.HeaderCell>Текст історії</Table.HeaderCell>
                <Table.HeaderCell>Оцінок</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                mostVariableStories.map(({story, unique}) => (
                  <Table.Row key={story.num}>
                    <Table.Cell>{story.num}</Table.Cell>
                    <Table.Cell>{story.issue}</Table.Cell>
                    <Table.Cell>{`${story.text.slice(0, 100)}${story.text.length > 100 ? '...' : ''}`}</Table.Cell>
                    <Table.Cell>{unique}</Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button positive icon='checkmark' labelPosition='right' content='Ok' onClick={this.closeStats} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default connect(
  {
    stats: state`data.playground.stats`,
    isVisible: state`data.statsVisible`,
    showStats: signal`showStats`,
  },
  Stats,
);
