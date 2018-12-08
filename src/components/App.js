import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import '../App.css';
import Navigation from './navigation/navigation.container';
import Home from './home/home.container';
import DrakeEquation from './drake-equation/drake-equation.container';

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Route exact path="/" component={Home} />
        <Route exact path="/drake-equation" component={DrakeEquation} />
      </div>
    );
  }
}

export default App;
