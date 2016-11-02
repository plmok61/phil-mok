import React, { Component } from 'react';
import logo from './darion.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Phil Mok</h2>
        </div>
        <p className="App-intro">
          Welcome to my awesome website.
        </p>
      </div>
    );
  }
}

export default App;
