const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    language: String,
    code: String,
    questionId: String,
  });

module.exports = mongoose.model('Code', codeSchema);