// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  
  return (
    <>
      <section className='search'>
        <label className='label search__label'>
          <span className='label__text'>Search</span>
          <input className='input input--search' type="search"/>
        </label>
      </section>
      <main>
        <Outlet/>
        
      </main>
    </>
  )
}

export default App
