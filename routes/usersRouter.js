var express = require('express');
const bodyParser = require('body-parser')
const db = require('../models/index')
const passport = require('passport');
const authenticate = require('../authenticate');

const User = db.User

const userRouter = express.Router()
userRouter.use(bodyParser.json())


userRouter.post('/signup', (req, res, next) => {
  User.register(User.build({ username: req.body.username }), req.body.password, (err, user) => {
    console.log(req.body.password)
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      console.log(err)
      res.json({ err: err });
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, status: 'Registration Successful!' });
      });
    }
  })
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {

  let token = authenticate.getToken({ _id: req.user._id })
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

userRouter.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = userRouter;