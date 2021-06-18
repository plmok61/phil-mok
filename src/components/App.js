import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import '../App.css';
import Navigation from './navigation/navigation.container';
import Footer from './footer/footer.container.js';
import Home from './home/home.container';
import DrakeEquation from './drake-equation/drake-equation.container';

class App extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <Navigation />
        <Route exact path="/" component={Home} />
        <Route exact path="/drake-equation" component={DrakeEquation} />
        <Footer />
      </div>
    );
  }
}

export default App;
