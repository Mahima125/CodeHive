import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Ques = () => {
  const [questions, setQuestions] = useState([]);
  const [difficultyFilters, setDifficultyFilters] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleQuestionClick = (question) => {
    console.log("Navigating with Question:", question); // Debugging log
    navigate("/code", { state: { question } });
  };

 
  useEffect(() => {
    const fetchQuestionsWithFilters = async () => {
      const params = new URLSearchParams();
  
      if (difficultyFilters.length > 0) params.append('difficulty', difficultyFilters.join(','));
      if (statusFilters.length > 0) params.append('status', statusFilters.join(','));
      if (categoryFilters.length > 0) params.append('category', categoryFilters.join(','));
      if (searchTerm) params.append('name', searchTerm);
  
      try {
        const response = await axios.get(`http://localhost:5000/api/admin?${params.toString()}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching filtered questions:', error);
      }
    };
    fetchQuestionsWithFilters();
  }, [difficultyFilters, statusFilters, categoryFilters, searchTerm]);
  

 
  const filteredQuestions = questions.filter((question) => {
    const matchesDifficulty = difficultyFilters.length
      ? difficultyFilters.includes(question.difficulty)
      : true;
    const matchesStatus = statusFilters.length
      ? statusFilters.includes(question.status)
      : true;
    const matchesCategory = categoryFilters.length
      ? categoryFilters.includes(question.category)
      : true;
    const matchesSearch = question.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesStatus && matchesCategory && matchesSearch;
  });

  const handleCheckboxChange = (e, setFilterState, filterState) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilterState([...filterState, value]);
    } else {
      setFilterState(filterState.filter((item) => item !== value));
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 via-blue-900 to-gray-800 min-h-screen w-full">
      <div>
        <img src={logo} alt="Logo" className="h-15 w-32 pt-8 pl-8" />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap mt-9 px-4 lg:px-8 gap-4">
        <div className="bg-white rounded-lg p-4 w-full sm:w-1/4">
          
          <div className="mb-4">
            <h1 className="font-bold text-lg mb-2">Search</h1>
            <input
              type="text"
              placeholder="Search questions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded-md"
            />
          </div>


          <div className="mb-4">
            <h1 className="font-bold text-lg mb-2">Difficulty Level</h1>
            {['Easy', 'Medium', 'Difficult'].map((level) => (
              <div className="flex items-center mb-2" key={level}>
                <input
                  type="checkbox"
                  value={level}
                  onChange={(e) => handleCheckboxChange(e, setDifficultyFilters, difficultyFilters)}
                  className="mr-2"
                />
                <label>{level}</label>
              </div>
            ))}
          </div>

        
          <div className="mb-4">
            <h1 className="font-bold text-lg mb-2">Status</h1>
            {['Attempted', 'Solved', 'Unattempted'].map((status) => (
              <div className="flex items-center mb-2" key={status}>
                <input
                  type="checkbox"
                  value={status}
                  onChange={(e) => handleCheckboxChange(e, setStatusFilters, statusFilters)}
                  className="mr-2"
                />
                <label>{status}</label>
              </div>
            ))}
          </div>

         
          <div>
            <h1 className="font-bold text-lg mb-2">Category</h1>
            {['Arrays', 'Trees', 'Strings', 'Graph', 'DP'].map((category) => (
              <div className="flex items-center mb-2" key={category}>
                <input
                  type="checkbox"
                  value={category}
                  onChange={(e) => handleCheckboxChange(e, setCategoryFilters, categoryFilters)}
                  className="mr-2"
                />
                <label>{category}</label>
              </div>
            ))}
          </div>
        </div>

       
        <div className="bg-white rounded-lg p-4 w-full lg:flex-grow">
          <div className="font-bold grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-2 text-sm md:text-base">
            <p>No.</p>
            <p>Question</p>
            <p>Category</p>
            <p>Difficulty Level</p>
            <p>Status</p>
          </div>
          
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question, index) => (
              <div key={question._id} onClick={() => handleQuestionClick(question)}  className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-2 py-2 text-sm md:text-base hover:text-green">
                <p>{index + 1}</p>
                <p>{question.name}</p>
                <p>{question.category}</p>
                <p>{question.difficulty}</p>
                <p>{question.status}</p>
              </div>
            ))
          ) : (
            <p className="text-center mt-4 text-gray-500">No questions found</p>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Ques;
