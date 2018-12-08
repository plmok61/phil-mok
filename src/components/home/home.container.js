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
    global.window.scrollTo(0, 0);
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
            <Col>
              <img src={this.state.gitHubData.avatar_url} className="profile-pic" alt="profile-pic" />
              <div>
                <h1>Phil Mok</h1>
              </div>
              <p>Under Construction. Check back soon for updates!</p>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default Home;
