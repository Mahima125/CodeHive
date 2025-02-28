import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Admin = () => {
  const [questionData, setQuestionData] = useState({
    name: '',
    difficulty: '',
    category: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    testCases: [{ input: '', expectedOutput: '' }],
    status: 'Unattempted',
  });
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const categories = ['Arrays', 'Trees', 'Strings', 'Graph', 'DP'];
  const difficulties = ['Easy', 'Medium', 'Difficult'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...questionData.testCases];
    updatedTestCases[index][field] = value;
    setQuestionData((prevData) => ({ ...prevData, testCases: updatedTestCases }));
  };

  const addTestCase = () => {
    setQuestionData((prevData) => ({
      ...prevData,
      testCases: [...prevData.testCases, { input: '', expectedOutput: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionData.name || !questionData.difficulty || !questionData.category || !questionData.description) {
      alert('Please fill in all fields');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/${editingId}`, questionData);
        alert('Question updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/admin', questionData);
        alert('Question added successfully');
      }
      setQuestionData({
        name: '',
        difficulty: '',
        category: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        constraints: '',
        testCases: [{ input: '', expectedOutput: '' }],
        status: 'Unattempted',
      });
      setEditingId(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error adding/updating question:', error);
      alert('Failed to add/update question');
    }
  };

  const handleEdit = (question) => {
    setEditingId(question._id);  // Ensure this is set correctly
    setQuestionData({
      name: question.name,
      difficulty: question.difficulty,
      category: question.category,
      description: question.description,
      inputFormat: question.inputFormat || '', // Include new fields
      outputFormat: question.outputFormat || '',
      constraints: question.constraints || '',
      testCases: question.testCases || [],
      status: question.status,
    });
  };
  

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/${id}`);
        alert('Question deleted successfully');
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-blue-900 to-gray-800 p-6">
      <h1 className='text-center text-3xl mb-6 font-bold'>Admin Panel</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-6">{editingId ? 'Edit Question' : 'Add New Question'}</h1>
        <input type="text" name="name" value={questionData.name} onChange={handleInputChange} placeholder="Question Name" className="w-full border p-2 rounded-md mb-4" required />
        <select name="difficulty" value={questionData.difficulty} onChange={handleInputChange} className="w-full border p-2 rounded-md mb-4" required>
          <option value="">Select Difficulty</option>
          {difficulties.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
        <select name="category" value={questionData.category} onChange={handleInputChange} className="w-full border p-2 rounded-md mb-4" required>
          <option value="">Select Category</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <textarea name="description" value={questionData.description} onChange={handleInputChange} placeholder="Description" className="w-full border p-2 rounded-md mb-4" required />
        <input type="text" name="inputFormat" value={questionData.inputFormat} onChange={handleInputChange} placeholder="Input Format" className="w-full border p-2 rounded-md mb-4" />
        <input type="text" name="outputFormat" value={questionData.outputFormat} onChange={handleInputChange} placeholder="Output Format" className="w-full border p-2 rounded-md mb-4" />
        <input type="text" name="constraints" value={questionData.constraints} onChange={handleInputChange} placeholder="Constraints" className="w-full border p-2 rounded-md mb-4" />
        <h3 className="font-bold mb-2">Test Cases</h3>
        {questionData.testCases.map((testCase, index) => (
          <div key={index} className="mb-4">
            <input type="text" value={testCase.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} placeholder="Input" className="w-full border p-2 rounded-md mb-2" />
            <input type="text" value={testCase.expectedOutput} onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)} placeholder="Expected Output" className="w-full border p-2 rounded-md" />
          </div>
        ))}
        <div className='flex gap-2'>
        <button type="button" onClick={addTestCase} className="bg-gray-600 text-white px-4 py-2 rounded-md mb-4">Add Test Case</button>
        <button type="submit" className="bg-blue-600 text-white  px-4 py-2 rounded-md mb-4">{editingId ? 'Update Question' : 'Add Question'}</button>
        </div>
      </form>
      <div className=' bg-white m-3 text-center rounded-lg shadow-md'>
      <h2 className="text-2xl font-bold mt-8 mb-4 ">Questions List</h2>
      {questions.map((question, index) => (
        <div key={question._id} className="flex justify-between p-4 border-b">
          <p>{index + 1}. {question.name} ({question.category} - {question.difficulty})</p>
          <div>
            <button className="bg-green-500 text-white px-2 py-1 rounded-md mr-2" onClick={() => handleEdit(question)}>Edit</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => handleDelete(question._id)}>Delete</button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Admin;
