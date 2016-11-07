import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import '../App.css'
import Summary from './Summary'
import LinksToAccounts from './LinksToAccounts'
import Container from './Container'
import NotFound from './NotFound'

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

        <Router history={hashHistory}>
          <Route path='/' component={Container}>
            <IndexRoute component={Summary} />
            <Route path='/contact' component={LinksToAccounts} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App
