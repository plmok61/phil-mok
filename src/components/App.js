import React, { Component } from 'react'
import '../App.css'
import Summary from './Summary'
import LinksToAccounts from './LinksToAccounts'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Phil Mok</h2>
        </div>
        <p className="App-intro">
          Welcome to my awesome website.
        </p>
        <Summary />
        <LinksToAccounts />
      </div>
    );
  }
}

export default App
