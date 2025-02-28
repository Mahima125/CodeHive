const express = require('express');
const router = express.Router();
const {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestionById,
 
} = require('../controllers/quesController');

// Correct routes with IDs
router.post('/', addQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

module.exports = router;
