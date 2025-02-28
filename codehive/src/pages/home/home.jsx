import React from 'react'
import Navbar from '../../components/navbar/navbar'
import Main from '../../components/main/mainContent'

const home = () => {
  return (
    <div className=' bg-gradient-to-b from-blue-800 via-blue-900 to-gray-800 min-h-screen w-full pt-4'>
      <div>
        <Navbar/>
        <Main/>
      </div>
    </div>
  )
}

export default home
