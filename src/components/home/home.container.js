import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImageZoomer from './image-zoomer';
import { actions } from '../../actions/github.actions';

class Home extends Component {
  static propTypes = {
    fetchGitHubData: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.fetchGitHubData();
  }

  render() {
    console.log(this.props)
    return (
      <Container fluid>
        <ImageZoomer />
        <Container>
          <Row>
            <Col className="d-flex justify-content-center">
              <div className="wtext-center">
                <div className="m-auto w-50">
                  <img
                    src="https://avatars0.githubusercontent.com/u/3951831?v=4"
                    className="img-fluid rounded-circle"
                    alt="profile-pic"
                  />
                </div>
                <div>
                  <h1>Phil Mok</h1>
                </div>
                <p>Under Construction. Check back soon for updates!</p>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  githubData: state.githubState.githubData,
  loading: state.githubState.loading,
});

export default connect(mapStateToProps, actions)(Home);
