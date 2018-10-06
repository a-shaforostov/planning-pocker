var express = require('express');
var router = express.Router();
const sessions = require('../sessions');

function withSessions(req, res, next) {
  req.sessions = sessions;
  next(req, res, next);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

function room(req, res, next) {
  res.render('new-session', { url: req.params.id, token: req.token });
}

router.get('/:id', room);

/* POST new session. */
router.post('/', function(req, res, next) {
  const ses = sessions.createSession({
    login: req.body.login,
  });
  console.log(sessions.pool);
  // res.set('x-token', ses.token).send(req.headers.origin + '/' + ses.id);
  // res.render('new-session', { url: `${req.headers.origin}/${ses.id}`, token: ses.token });
  req.token = ses.token;
  req.params.id = ses.id;
  room(req, res, next);
});

module.exports = router;
