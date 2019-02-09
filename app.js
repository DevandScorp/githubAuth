const express = require('express');
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MentorTable = require('./models/Mentor');
const mentorRouter = require('./routes/mentorRouter');

const callbackURL = `${process.env.URL || 'http://localhost:5000/'}login/github/return`;

passport.use(new GithubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL,
},
((token, tokenSecret, profile, cb) => cb(null, profile))));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const app = express();

const connect = mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });

connect.then(() => {
  console.log('Connected correctly to the server');
}, (err) => { console.log(err); });


app.use(require('cookie-parser')());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('client/dist'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/mentors', mentorRouter);

app.get('/logoff',
  (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

app.get('/auth/github', passport.authenticate('github'));

app.get('/login/github/return',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    MentorTable
      .remove({}, (err) => {
        if (err) {
          console.log(err);
        }
      })
      .then(() => {
        new MentorTable(req.user._json)
          .save((err, product) => {
            if (err) {
              console.log(err);
            }
          });
        res.redirect('https://devandscorp.github.io/rss-mentor-dashboard/');
      });
  });


// listen for requests :)
const listener = app.listen(process.env.PORT || 5000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
