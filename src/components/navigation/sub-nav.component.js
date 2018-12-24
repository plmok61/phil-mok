import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  Nav,
  Container,
  NavbarBrand,
  NavItem,
  Button,
} from 'reactstrap';

function backToTop() {
  global.window.scrollTo({ top: 0, behavior: 'smooth' });
}

class SubNav extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div
        className={`${this.props.className} border-bottom`}
        ref={this.props.innerRef}
      >
        <Navbar
          color="white"
          light
          expand="md"
        >
          <Container>
            <NavbarBrand style={{ width: '93px' }}>
              {this.props.subNavFixedTop ? 'Phil Mok' : ''}
            </NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem>
                {
                  this.props.subNavFixedTop
                  ? <Button color="link" onClick={backToTop}><h2>Back to top</h2></Button>
                  : <h2>Scroll down</h2>
                }
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default SubNav;
