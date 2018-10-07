import React, { Component } from "react";
import { connect } from "@cerebral/react";
import { state } from 'cerebral/tags';
import injectSheet from 'react-jss';

import PageWithTransition from 'components/PageWithTransition';
import PlayFlow from 'components/PlayFlow';
import Controls from 'components/Controls';

const styles = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    height: '100%',
  },
  container: {
    width: '440px',
    minWidth: '440px',
    maxWidth: '960px',
    margin: '0 auto',
    height: 'calc(100% - 92px - 42px)',
    backgroundColor: 'white',
    overflowY: 'auto',
  },
  field: {
    height: `${440*9}px`,
    position: 'relative',
  },
};

class GamePage extends Component {
  render() {
    const { classes, window, field } = this.props;

    return (
      <PageWithTransition page="game" className={classes.wrapper}>
        <PlayFlow />
        <div className={classes.container}>
          <div className={classes.field}>
            <div
              style={{
                position: 'absolute',
                top: (field.height - field.home.top - field.home.diam) * window.koef,
                width: field.home.diam * window.koef,
                height: field.home.diam * window.koef,
                left: (field.width-field.home.diam)/2 * window.koef,
                right: (field.width-field.home.diam)/2 * window.koef,
                borderRadius: '50%',
                border: `${field.home.width * window.koef}px solid ${field.home.color1}`,
              }}
            >
            </div>
            <div
              style={{
                position: 'absolute',
                width: field.home.smallDiam * window.koef,
                height: field.home.smallDiam * window.koef,
                top: (field.height - field.home.top - field.home.diam/2 - field.home.smallDiam/2) * window.koef,
                left: (field.width-field.home.smallDiam)/2 * window.koef,
                right: (field.width-field.home.smallDiam)/2 * window.koef,
                borderRadius: '50%',
                border: `${field.home.width * window.koef}px solid ${field.home.color2}`,
              }}
            >
            </div>
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: field.hol.width * window.koef,
                top: (field.height - field.hol.pos - field.hol.width/2) * window.koef,
                backgroundColor: field.home.color1,
              }}
            >
            </div>
          </div>
        </div>
        <Controls />
      </PageWithTransition>
    )
  }
}

export default connect(
  {
    users: state`data.users`,
    player2Index: state`data.player2Index`,
    teamMates: state`teamMates`,
    window: state`window`,
    field: state`field`,
  },
  injectSheet(styles)(GamePage),
);
