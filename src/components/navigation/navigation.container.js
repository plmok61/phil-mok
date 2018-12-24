import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import {
  Navbar,
  Nav,
  Container,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  Collapse,
} from 'reactstrap';
import SubNav from './sub-nav.component';

class Navigation extends Component {
  static propTypes = {
    browser: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
      offsets: {
        mainNavRef: 0,
        subNavRef: 0,
      },
      subNavFixedTop: false,
    };
    this.toggleNav = this.toggleNav.bind(this);
    this.getComponentHeights = this.getComponentHeights.bind(this);
    this.checkScrollY = this.checkScrollY.bind(this);
    this.navRefs = {
      mainNavRef: createRef(),
      subNavRef: createRef(),
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.checkScrollY);
    this.getComponentHeights();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.navOpen !== prevState.navOpen ||
      this.props.browser.lessThan.medium !== prevProps.browser.lessThan.medium
    ) {
      this.getComponentHeights();
    }
  }

  toggleNav() {
    this.setState({ navOpen: !this.state.navOpen });
  }

  getComponentHeights() {
    const offsetObject = Object.keys(this.navRefs).reduce((result, item) => {
      if (this.navRefs[item].current) {
        // eslint-disable-next-line
        result[item] = this.navRefs[item].current.offsetHeight;
      }
      return result;
    }, {});

    this.setState({ offsets: offsetObject });
  }

  checkScrollY() {
    this.getComponentHeights();
    // if the user has scrolled below the main nav, make the subnav fixed top
    if (this.navRefs.mainNavRef.current
      && window.scrollY >= this.navRefs.mainNavRef.current.offsetHeight
      && !this.state.subNavFixedTop
    ) {
      this.setState({ subNavFixedTop: true });
    }

    if (this.navRefs.mainNavRef.current
      && window.scrollY < this.navRefs.mainNavRef.current.offsetHeight
      && this.state.subNavFixedTop
    ) {
      this.setState({ subNavFixedTop: false });
    }
  }


  render() {
    const lessThanMed = this.props.browser.lessThan.medium;
    let offset = 0;
    if (lessThanMed) {
      offset = 57;
    } else if (this.state.subNavFixedTop) {
      offset = this.state.offsets.subNavRef;
    }

    const logoStyle = { width: '93px' };
    if (!this.state.subNavFixedTop) {
      logoStyle.position = 'fixed';
      logoStyle.zIndex = '1200';
    }

    return (
      <div className="bg-white navContainer">
        <div className="bg-white">
          <div ref={this.navRefs.mainNavRef}>
            <Navbar color="white" light expand="md">
              <Container>
                <NavbarBrand
                  href="/"
                  style={logoStyle}
                >
                  Phil Mok
                </NavbarBrand>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink className="nav-link" to="/">Home</NavLink>
                  </NavItem>
                </Nav>
              </Container>
            </Navbar>
          </div>
          <SubNav
            browser={this.props.browser}
            navOpen={this.state.navOpen}
            innerRef={this.navRefs.subNavRef}
            subNavFixedTop={this.state.subNavFixedTop}
            className={this.state.subNavFixedTop ? 'fixed-top' : 'sticky-top'}
          />
        </div>
        {/* <div style={{ height: `${offset}px` }} /> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({ browser: state.browser });

export default connect(mapStateToProps)(Navigation);
