import React from 'react'
import Nav from './Nav'

export default Container = (props) => (
  <div>
    <Nav />
    {props.children}
  </div>
)