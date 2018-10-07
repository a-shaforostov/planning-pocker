import React, { Component } from "react";
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import PageWithTransition from 'components/PageWithTransition';
import injectSheet from 'react-jss';

const styles = {
  wrapper: {
    height: '100%',
  },
  container: {
    display: 'flex',
    width: '440px',
    minWidth: '440px',
    maxWidth: '960px',
    margin: '0 auto',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100%',
  },
};

class ResultsPage extends Component {
  handleNewGame = () => {
    this.props.start();
  };

  render() {
    const { classes, game, users, player2Index } = this.props;

    const winner = game.gameWinner === null
     ? ''
     : game.gameWinner === 0 ? users[0].name : users[player2Index].name;

    return (
      <PageWithTransition page="results" className={classes.wrapper}>
        <div className={classes.container}>
          <div>Рахунок {`${game.gameResult[0]}:${game.gameResult[1]}`}</div>
          {
            winner &&
            <div>Переможець: {winner}</div>
          }
          {
            !winner &&
            <div>Нічия</div>
          }
          <button onClick={this.handleNewGame}>Нова гра</button>
        </div>
      </PageWithTransition>
    )
  }
}

export default connect(
  {
    game: state`data.game`,
    users: state`data.users`,
    player2Index: state`data.player2Index`,
    start: signal`start`,
  },
  injectSheet(styles)(ResultsPage),
);
