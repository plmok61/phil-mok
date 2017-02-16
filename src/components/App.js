import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import '../App.css';
import Summary from './Summary';
import LinksToAccounts from './LinksToAccounts';
import About from './About';
import Container from './Container';
import MyWork from './MyWork';
import NotFound from './NotFound';

export default class App extends Component {

  render() {
    return (
      <div className="appContainer">
        <Router history={hashHistory}>
          <Route path="/" component={Container}>
            <IndexRoute component={Summary} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={LinksToAccounts} />
            <Route path="/work" component={MyWork} />
            <Route path="*" component={NotFound} />
          </Route>
        </Router>
      </div>
    );
  }
}
