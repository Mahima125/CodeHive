import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (state) => {
    
    navigate('/login', { state: { currentState: state } }); // Directly pass the desired state
  };

  return (
    <div className='rounded-lg bg-white m-4 flex justify-between items-center'>
      <div className='w-[150px] p-3'>
        <img src={logo} alt="" className='' />
      </div>
      <div className='flex gap-6 p-3 items-center'>
        <p
          onClick={() => handleNavigation('signin')}
          className='border-2 border-black p-2 rounded-md hover:bg-gray-200 cursor-pointer'
        >
          Sign In
        </p>
        <p
          onClick={() => handleNavigation('login')}
          className='border-2 border-black p-2 rounded-md hover:bg-gray-200 cursor-pointer'
        >
          Log In
        </p>
      </div>
    </div>
  );
};

export default Navbar;
