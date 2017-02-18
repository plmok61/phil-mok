import React, { PropTypes } from 'react';
import Navigation from './Navigation';
import '../App.css';

const App = ({ children }) => (
  <div className="appContainer">
    <Navigation />
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
