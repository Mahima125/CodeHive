import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const location = useLocation();
  const initialState = location.state?.currentState || 'signin';
  const [currentState, setCurrentState] = useState(initialState);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let newUrl = "http://localhost:5000";
      let requestData = data;

      if (currentState === "signin") {
        newUrl += "/api/users";
        requestData = data;  // Send name, email, and password
      } else {
        newUrl += "/api/auth";
        requestData = { email: data.email, password: data.password };
      }

      const { data: res } = await axios.post(newUrl, requestData);

      if (res.data) {
        localStorage.setItem("token", res.data);
        navigate("/ques");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error("Error occurred:", error.response || error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 via-blue-900 to-gray-800 min-h-screen w-full flex justify-center items-center">
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-center gap-5 m-8 font-bold">
              {currentState === "signin" && (
                <label className="flex gap-4">
                  Name: 
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    required 
                    className="bg-gray-300 pl-2 rounded-md"
                    name="name" 
                    value={data.name} 
                    onChange={handleChange} 
                  />
                </label>
              )}
              <label className="flex gap-4">
                E-mail: 
                <input 
                  type="email" 
                  placeholder="Your email" 
                  required 
                  className="bg-gray-300 pl-2 rounded-md"
                  name="email" 
                  value={data.email} 
                  onChange={handleChange} 
                />
              </label>
              <label className="flex gap-2">
                Password: 
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className="bg-gray-300 pl-2 rounded-md"
                  name="password" 
                  value={data.password} 
                  onChange={handleChange} 
                />
              </label>
            </div>
            <div className="flex m-4 justify-center items-center">
              <button
                type="submit"
                className="bg-gray-300 rounded-full p-3 font-bold hover:scale-110 transition-transform duration-300"
              >
                {currentState === 'signin' ? 'Create account' : 'Login'}
              </button>
            </div>
          </form>
          <div className="flex gap-3 m-4">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
          <div className="flex justify-center items-center p-4">
            {currentState === "login" ? (
              <p>Don't have an account? 
                <span onClick={() => { setCurrentState("signin") }} className="underline italic hover:cursor-pointer hover:font-bold">
                  Click here
                </span>
              </p>
            ) : (
              <p>Already have an account? 
                <span onClick={() => { setCurrentState("login") }} className="underline italic hover:cursor-pointer hover:font-bold">
                  Login here
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
