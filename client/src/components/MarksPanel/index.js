import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button, Icon } from 'semantic-ui-react';

import './MarksPanel.css';

class MarksPanel extends Component {
  giveMark = mark => () => {
    this.props.giveMark({ mark });
  };

  render() {
    const { marks, myMark, currentStory, login } = this.props;
    if (currentStory.finish) return null;

    if (!currentStory.players.find(p => p.login === login)) {
      return (
        <div>
          <div>&nbsp;</div>
          <Icon loading name='asterisk' />
          Ви щойно приєдналися і не можете ставити оцінку, дочекайтеся наступної історії...
        </div>
      )
    }

    return (
      <div>
        <div><b>Оцініть історію:</b></div>
        {
          marks.map((mark, index) => (
            <Button
              className="mark__button"
              key={index}
              color={myMark === mark ? 'orange' : 'green'}
              disabled={!!myMark}
              onClick={this.giveMark(mark)}
            >
              {mark}
            </Button>
          ))
        }
      </div>
    )
  }
}

export default connect(
  {
    marks: state`data.marks.items`,
    myMark: state`data.player.mark`,
    login: state`data.login`,
    currentStory: state`data.playground.currentStory`,
    giveMark: signal`giveMark`,
  },
  MarksPanel,
);
