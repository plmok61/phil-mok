import React from 'react'
import '../App.css'
import profilePic from '../assets/profile-pic.jpg'

export default class Summary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <div>
        <img src={profilePic} className="profile-pic" alt="profile-pic" />
        <div>
          <h2>Phil Mok</h2>
        </div>
        <p>My story goes here...</p>
      </div>
    )
  }
}