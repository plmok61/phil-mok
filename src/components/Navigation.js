import React from 'react';
import { Link } from 'react-router';
import { Navbar, NavItem, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../App.css';

const Navigation = () => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to='/'>Phil Mok</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to='/about'>
          <NavItem eventKey={1} className="top-nav-link">About Me</NavItem>
        </LinkContainer>
        <LinkContainer to='/work'>
          <NavItem eventKey={2} className="top-nav-link">My Work</NavItem>
        </LinkContainer>
        <LinkContainer to='/contact'>
          <NavItem eventKey={2} className="top-nav-link">Contact</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Navigation;
