const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');
const indexRouter = require('./routes/index');
const sessions = require('./sessions');

const wss = new WebSocket.Server({
  port: 3002
});

const wsHandlers = require('./wsHandlers')(wss);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

wss.on('connection', (ws) => {
  sessions.addConnection(ws);
  console.log(sessions.getConnectionsSize());
  // sessions.createSession({ login: 'asd' });
  ws.on('message', processMessage);
  ws.on('close', function (code) {
    sessions.removeConnection(this.id);
    console.log(sessions.getConnectionsSize());
  });
});

wss.on('close', (ws) => {
  console.log('connection closed', ws);

});

app.listen(process.env.PORT || '3000');

function processMessage(message) {
  console.log(message);
  const { action, payload } = JSON.parse(message);
  wsHandlers[action](this, payload);
}
