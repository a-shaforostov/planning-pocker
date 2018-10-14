import React, { Component } from 'react';
import config from '../../app/config';
import { connect } from "@cerebral/react";
import { state, signal } from 'cerebral/tags';
import { ws } from '../../app/actions';
import { Icon } from 'semantic-ui-react';

class WebSocketProvider extends Component {
  handleData = (data) => {
    console.log(data);
  };

  componentDidMount() {
    const self = this;
    const { host, port } = config.wsServer;
    ws.comp = new WebSocket(`ws://${host}:${port}`);

    ws.comp.onerror = (err) => {
      console.log(err)
    };

    ws.comp.onopen = function() {
      const { updateIsConnected } = self.props;
      updateIsConnected({ value: true });
    };

    ws.comp.onclose = function() {
      const { updateIsConnected } = self.props;
      updateIsConnected({ value: false });
    };

    ws.comp.onmessage = function(message) {
      const { onServerMessage } = self.props;
      onServerMessage(JSON.parse(message.data));
    };
  }

  componentWillUnmount() {
    ws.comp = null;
  }

  render() {
    const { isConnected } = this.props;
    return (
      <Icon
        name="wifi"
        color={isConnected ? 'green' : 'grey'}
        title={isConnected ? 'Online' : `Відсутнє з'єднання з сервером\nСпробуйте оновити сторінку`}
      />
    );
  }
}

export default connect(
  {
    isConnected: state`data.isConnected`,
    onServerMessage: signal`serverMessage`,
    updateIsConnected: signal`updateIsConnected`,
  },
  WebSocketProvider,
);
