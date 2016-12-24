import React from 'react'
import Navigation from './Nav'

const Container = (props) => (
  <div>
    <Navigation />
    {props.children}
  </div>
)

export default Container