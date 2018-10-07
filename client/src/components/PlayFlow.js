import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state } from 'cerebral/tags';
import injectSheet from 'react-jss';

const styles = {
  container: {
    width: '440px',
    margin: '0 auto',
    backgroundColor: 'lightgray',
  },
  table: {
    width: '100%',
  },
  turn: {
    padding: '1%',
    width: '100%',
    height: '15px',
  }
};

class PlayFlow extends Component {
  render() {
    const { classes, users, player2Index, game } = this.props;
    return (
      <div className={classes.container}>
        <table className={classes.table}>
          <tbody>
          {
            [0,player2Index].map((player, plIndex) => {
              const sum = game.teams[plIndex].ends.reduce((sum, item) => sum+item, 0);
              return (
                <tr key={plIndex}>
                  <td><div>{users[player].name}</div></td>
                  {
                    game.teams[plIndex].ends.map((end, index) => {
                      return (
                        <td style={{width: '8%'}} key={index}>
                          <div style={{backgroundColor: 'white', textAlign: 'center'}}>{end !== null ? end : '-'}</div>
                        </td>
                      )
                    })
                  }
                  <td style={{width: '10%'}}>
                    <div style={{backgroundColor: 'white', textAlign: 'center', fontWeight: '700'}}>{sum !== null ? sum : '-'}</div>
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        <table className={classes.table}>
          <thead>
            <tr>
              <td colSpan="8" style={{width: '50%'}}>{users[0].name}</td>
              <td colSpan="8">{users[player2Index].name}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                [0,1].map(team => {
                  return game.teams[team].turns.map((turn, index) => {
                    var color = 'white';
                    if (index + 1 === game.teams[team].currentTurn && game.currentTeam === team) {
                      color = 'yellow';
                    }
                    if (index + 1 < game.teams[team].currentTurn) {
                      color = 'green';
                    }
                    return (
                      <td key={index}>
                        <div
                          className={classes.turn}
                          style={{backgroundColor: color}}
                        >

                        </div>
                      </td>
                    )
                  })
                })
              }
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default connect(
  {
    users: state`data.users`,
    player2Index: state`data.player2Index`,
    game: state`data.game`,
  },
  injectSheet(styles)(PlayFlow),
);
