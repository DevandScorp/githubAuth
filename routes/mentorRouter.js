const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const MentorTable = require('../models/Mentor');

const MentorRouter = express.Router();

MentorRouter.use(bodyParser.json());
MentorRouter.use(bodyParser.urlencoded({
  extended: true,
}));
MentorRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.corsWithOptions, (req, res, next) => {
    MentorTable.find({})
      .then((mentors) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(mentors);
      }, err => next(err))
      .catch(err => next(err));
  });
module.exports = MentorRouter;
