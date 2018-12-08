import React, { Component } from 'react';
import deepField from '../../assets/deep-field.jpg';

class ImageZoomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomedOut: false,
    };
    this.trackYScroll = this.trackYScroll.bind(this);
  }

  componentDidMount() {
    this.trackYScroll();
  }

  trackYScroll() {
    const image = document.getElementById('deepField');
    const initialWidth = 1680;
    const initialHeight = 1050;
    global.window.addEventListener('scroll', () => {
      const { scrollY } = global.window;

      if (initialWidth - scrollY > 300) {
        image.width = initialWidth - scrollY;
      }

      if (initialWidth - 300 < scrollY && !this.state.zoomedOut) {
        this.setState({ zoomedOut: true });
        console.log('zommedOut');
      }

      if (initialWidth - 300 > scrollY && this.state.zoomedOut) {
        this.setState({ zoomedOut: false });
      }
    }, true);
  }

  render() {
    const { zoomedOut } = this.state;

    return (
      <div className="imageZoomerContainer">
        <div
          className={`d-flex justify-content-center w-100 ${zoomedOut ? 'd-none' : 'position-fixed'}`}
          style={{ height: zoomedOut ? '1380px' : '' }}
        >
          <img
            id="deepField"
            className={zoomedOut ? 'd-none' : 'position-fixed'}
            src={deepField}
            alt="deep field"
          />
        </div>
        <div className={!zoomedOut ? 'd-none' : 'd-flex justify-content-center'}>
          <img
            style={{ width: '300px', height: '191px' }}
            src={deepField}
            alt="deep field"
          />
        </div>
      </div>
    );
  }
}

export default ImageZoomer;
