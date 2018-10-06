var path = require('path');
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var indexRouter = require('./routes/index');
const sessions = require('./sessions');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

const wss = expressWs.getWss();

wss.on('connection', (data) => {
  console.log(data);
});

app.ws('/:id', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(req.params.id, msg);
  });
  ws.on('open', (data) => {
    console.log(data);
  });
  ws.on('close', () => {
    console.log('connection closed');
  });
  console.log('socket', req.testing);
});

app.listen(process.env.PORT || '3000');
