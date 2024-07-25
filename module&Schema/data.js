
const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose')

const mentorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  mentee: {
    type: [],
    unique:true
  },
}, {
  timestamps:true
});

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
  },
  mentor: {
    type: [],
    unique:true
  },
}, {
  timestamps: true
});

const mentorModule = mongoose.model("mentor", mentorSchema);
const studentModule = mongoose.model("student", studentSchema);

module.exports = { mentorModule, studentModule };