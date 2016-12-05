import React from 'react'
import '../App.css'
import axios from 'axios'

export default class Summary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gitHubData: false
    }
  }

  componentDidMount () {
    axios.get('https://api.github.com/users/plmok61')
    .then((response) => {
      console.log(response.data)
      this.setState({
        gitHubData: response.data
      })
    })
  }

  render () {
    return (
      <div>
        <img src={this.state.gitHubData.avatar_url} className="profile-pic" alt="profile-pic" />
        <div>
          <h2>Phil Mok</h2>
        </div>
        <p>Under Construction. Check back soon for updates!</p>
      </div>
    )
  }
}