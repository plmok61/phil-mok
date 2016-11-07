import React from 'react'
import Nav from './Nav'

const Container = (props) => (
  <div>
    <Nav />
    {props.children}
  </div>
)

export default Container