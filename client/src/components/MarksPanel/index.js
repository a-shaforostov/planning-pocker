import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Button } from 'semantic-ui-react';

import './MarksPanel.css';

class MarksPanel extends Component {
  giveMark = mark => () => {
    this.props.giveMark({ mark });
  };

  render() {
    const { marks, myMark } = this.props;

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
    giveMark: signal`giveMark`,
  },
  MarksPanel,
);
