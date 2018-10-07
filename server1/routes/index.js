var express = require('express');
var router = express.Router();
const sessions = require('../sessions');

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
  res.render('index');
});

// /* POST new session. */
// router.post('/', function(req, res, next) {
//   const ses = sessions.createSession({
//     login: req.body.login,
//   });
//   console.log(sessions.pool);
//   // res.set('x-token', ses.token).send(req.headers.origin + '/' + ses.id);
//   // res.render('new-session', { url: `${req.headers.origin}/${ses.id}`, token: ses.token });
//   req.token = ses.token;
//   req.params.id = ses.id;
//   room(req, res, next);
// });

module.exports = router;
