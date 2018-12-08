import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import axios from 'axios';
import ImageZoomer from './image-zoomer';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitHubData: false,
    };
  }

  componentDidMount() {
    axios.get('https://api.github.com/users/plmok61')
      .then((response) => {
        console.log(response.data);
        this.setState({
          gitHubData: response.data,
        });
      });
  }

  render() {
    return (
      <Container fluid>
        <ImageZoomer />
        <Container>
          <Row>
            <Col className="d-flex justify-content-center">
              <div className="w-100 text-center">
                <div className="m-auto w-50">
                  <img
                    src={this.state.gitHubData.avatar_url}
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

export default Home;
