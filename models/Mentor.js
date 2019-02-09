const mongoose = require('mongoose');

const { Schema } = mongoose;

const Mentor = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  avatar_url: {
    type: String,
    required: true,
  },
});
const MentorTable = mongoose.model('Mentor', Mentor);
module.exports = MentorTable;
