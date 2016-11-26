import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import '../App.css'

export default Nav = () => (
  <div className='navbar'>
    <div className='navLink'>
      <Link to='/'>About Me</Link>
    </div>
    <div className='navLink'>
      <Link to='/contact'>Contact</Link>
    </div>
  </div>
)