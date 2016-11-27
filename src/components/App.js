import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import '../App.css'
import Summary from './Summary'
import LinksToAccounts from './LinksToAccounts'
import Container from './Container'
import NotFound from './NotFound'

export default class App extends Component {
  render() {
    return (
      <div>
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

