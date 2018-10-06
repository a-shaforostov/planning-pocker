var express = require('express');
var router = express.Router();
const sessions = require('../sessions');

function withSessions(req, res, next) {
  req.sessions = sessions;
  next(req, res, next);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, '../public') });
});

router.get('/:id', function(req, res, next) {
  res.send(req.params.id);
});

/* POST new session. */
router.post('/', function(req, res, next) {
  const ses = sessions.createSession({
    login: req.body.login,
  });
  console.log(sessions.pool);
  res.set('x-token', ses.token).send(req.headers.origin + '/' + ses.id);
});

module.exports = router;
