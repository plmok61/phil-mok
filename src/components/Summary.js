import React from 'react'
import '../App.css'

class Summary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <div>
        <div className="App-header">
          <h2>Phil Mok</h2>
        </div>
        <p>My story goes here...</p>
      </div>
    )
  }
}

export default Summary