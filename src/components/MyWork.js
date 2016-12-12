import React, { Component } from 'react'
import axios from 'axios'

export default class MyWork extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gitHubRepos: false,
    }
  }

  componentDidMount () {
    axios.get('https://api.github.com/users/plmok61/repos')
      .then((response) => {
        console.log(response.data)
        this.setState({
          gitHubRepos: response.data
        })
      })
      .catch((error) => {
        console.log('error getting repos: ', error)
      }) 
  }

  render () {
    return (
      <div>
        <h1><a href="https://sitstartpros.com" target="blank">Sit Start Pros</a></h1>
      </div>
    )
  }
}