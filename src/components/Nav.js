import React from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'


const Nav = () => (
  <div>
    <Link to='/'>About Me</Link>&nbsp;
    <Link to='/contact'>Contact</Link>
  </div>
)

export default Nav