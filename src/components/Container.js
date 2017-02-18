import React, { PropTypes } from 'react';
import Navigation from './Nav';

const Container = (props) => (
  <div>
    <Navigation />
    {props.children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
