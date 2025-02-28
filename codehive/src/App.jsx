import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home'
import Login from './pages/login/login'
import Code from './pages/code/code'
import Ques from './pages/ques/ques'
import Admin from './pages/admin/admin'

const App = () => {
  return (
    <div>
       <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/ques' element={<Ques/>} />
            <Route path='/code' element={<Code/>} />
            <Route path='/admin' element={<Admin/>} />
       </Routes>
    </div>
  )
}

export default App
