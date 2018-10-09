import React, { Component } from 'react';
import Websocket from 'react-websocket';
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
    ws.comp = new WebSocket("ws://localhost:3002");

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
    return <Icon name="wifi" color={isConnected ? 'green' : 'grey'} title={isConnected ? 'Online' : 'Offline'} />;
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
