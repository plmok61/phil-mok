import React, { Component } from 'react';
import {
  Navbar,
  Nav,
  Container,
  NavbarBrand,
  NavItem,
  Collapse,
  Button,
} from 'reactstrap';

function backToTop() {
  global.window.scrollTo({ top: 0, behavior: 'smooth' });
}

class SubNav extends Component {
  render() {
    const lessThanMed = this.props.browser.lessThan.medium;
    return (
      <div
        className={`${this.props.className} border-bottom`}
        ref={this.props.innerRef}
      >
        <Navbar
          className={lessThanMed && !this.props.navOpen ? 'd-none' : ''}
          color="white"
          light
          expand="md"
        >
          <Container>
            <NavbarBrand style={{ width: '93px' }}>
              {this.props.subNavFixedTop && !lessThanMed ? 'Phil Mok' : ''}
            </NavbarBrand>
            <Collapse isOpen={this.props.navOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  {
                    this.props.subNavFixedTop
                    ? <Button color="link" onClick={backToTop}>Back to top</Button>
                    : <h2>Scroll down</h2>
                  }
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default SubNav;
