import React, { Component } from 'react';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { Input, Button } from 'semantic-ui-react';

import './MarksEditor.css';

class MarksEditor extends Component {
  updateMark = e => {
    this.props.updateMark({ value: e.target.value });
  };

  keyUp = e => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    if (e.keyCode === 13) {
      this.addMark();
    }
  };

  removeMark = index => () => {
    this.props.removeMark({ index });
  };

  addMark = () => {
    const { editor } = this.props;
    if (isNaN(parseFloat(editor)) || Number(editor) != editor) {
      alert('Використовуйте тільки числові значення');
      return;
    }
    this.props.addMark({ value: +this.props.editor });
    this.props.updateMark({ value: '' });
  };

  render() {
    const { marks, editor, disabled } = this.props;

    return (
      <div className="marks__editor__wrapper">
        <div><b>Доступні оцінки:</b></div>
        {
          marks.map((mark, index) => (
            disabled
              ? <Input
                  className="marks__mark"
                  key={index}
                  value={mark}
                  title={mark}
                />
              : <Input
                  className="marks__mark"
                  key={index}
                  value={mark}
                  title={mark}
                  labelPosition="right"
                  label={
                      <Button
                        disabled={mark === '?' || disabled}
                        color="red"
                        className="marks__mark__remove"
                        onClick={this.removeMark(index).bind(this)}>
                        x
                      </Button>
                  }
                />
          ))
        }
        {
          !disabled &&
          <Input
            value={editor}
            className="marks__input"
            icon={{ name: 'plus', color: 'green', circular: true, link: true, onClick: this.addMark}}
            onChange={this.updateMark}
            onKeyUp={this.keyUp}
          />
        }
      </div>
    )
  }
}

export default connect(
  {
    marks: state`data.marks.items`,
    editor: state`data.marks.editor`,
    updateMark: signal`updateMark`,
    addMark: signal`addMark`,
    removeMark: signal`removeMark`,
  },
  MarksEditor,
);
