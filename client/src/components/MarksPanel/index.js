import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state } from 'cerebral/tags';
import { Button } from 'semantic-ui-react';

import './MarksPanel.css';

class MarksPanel extends Component {
  render() {
    const { marks } = this.props;

    return (
      <div>
        <div><b>Оцінки:</b></div>
        {
          marks.map((mark, index) => (
            <Button className="mark__button" key={index} color="green">{mark}</Button>
          ))
        }
      </div>
    )
  }
}

export default connect(
  {
    marks: state`data.marks.items`,
  },
  MarksPanel,
);
