const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Difficult'], required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Arrays', 'Trees', 'Strings', 'Graph', 'DP'], required: true },
  status: { type: String, enum: ['Attempted', 'Solved', 'Unattempted'], default: 'Unattempted' },
  inputFormat: {type:String, required:true},
  outputFormat: {type:String, required:true},
  constraints: {type:String, required:true},
  testCases: [{ input: String, expectedOutput: String }]
});

module.exports = mongoose.model('Question', questionSchema);
