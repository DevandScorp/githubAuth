const express = require('express');
const passport = require('passport');
const fs = require('fs');
const GithubStrategy = require('passport-github').Strategy;

const callbackURL = `${process.env.URL || 'http://localhost:5000/'}login/github/return`;
passport.use(new GithubStrategy({
  clientID: '01d05ca82c882bf7d51b',
  clientSecret: '38bcb2acba8d3fa1588d5584eb1e967d7af20bf9',
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


app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// index route
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff',
  (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

app.get('/auth/github', passport.authenticate('github'));

app.get('/login/github/return',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Object.keys(res).forEach(key => {
    //     console.log(Object.keys(res[key]))
    // })
    // fs.writeFile('text.txt', JSON.stringify(Object.keys(res)), (err) => {
    //   console.log(err);
    // });
    // res.setHeader('Content-Type', 'application/json');
    // res.statusCode = 200;
    // res.json(req.user._json);
    res.redirect('/');
  });

app.get('/success',
  require('connect-ensure-login').ensureLoggedIn('/'),
  (req, res) => {
    console.log(req.user._json);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.json(req.user._json);
    // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    // res.sendFile(`${__dirname}/views/success.html`);
  });

// listen for requests :)
const listener = app.listen(process.env.PORT || 5000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
