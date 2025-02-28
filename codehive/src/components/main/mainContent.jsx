import React from 'react'
import ide from '../../assets/ide.png'
import code from '../../assets/code.png'
import lang from '../../assets/lang.png'
import lb from '../../assets/leaderboard.png'
import { Link, useNavigate } from 'react-router-dom';

const mainContent = () => {
  return (
    <div className='mt-6 overflow-hidden'>
      <div className='grid justify-center text-center text-3xl font-bold text-white pt-9 gap-3'>
        <p className='animate-slide-in-left'>Ready to code?</p>
        <p className='animate-slide-in-right'>Join Us and Turn Ideas into Code!</p>
        <p className='animate-slide-in-left'>From Errors to Excellence.</p>
      </div>
      <div className='grid justify-center text-center text-2xl font-bold text-white mt-3 '>
        <Link to='/login'><p className='border-2 border-black p-2 hover:bg-black/20 rounded-md hover:scale-110 cursor-pointer '>Get Started</p></Link>
      </div>
      <div className='flex items-center justify-between gap-7 text-white  text-md mt-24 grid grid-cols-1 md:grid-cols-4'>
        <div className='grid justify-items-center'>
          <img src={ide} alt="" className='h-10 w-10' />
          <p className='p-3'>Interactive Editors</p>
        </div>
        <div className='grid justify-items-center'>
          <img src={code} alt="" className='h-10 w-10' />
          <p className='p-3'>Code Challenges</p>
        </div>
        <div className='grid justify-items-center'>
          <img src={lang} alt="" className='h-10 w-10' />
          <p className='p-3'>Multi-Language Support</p>
        </div>
        <div className='grid justify-items-center'>
          <img src={lb} alt="" className='h-10 w-10'/>
          <p className='p-3'>LeaderBoard</p>
        </div>
      </div>
    </div>
  )
}

export default mainContent
