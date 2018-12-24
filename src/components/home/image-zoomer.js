import React, { Component } from 'react';
import deepField from '../../assets/deep-field.jpg';

const windowMultiplier = 6;

class ImageZoomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomedOut: false,
      imageWidth: global.window.innerWidth * windowMultiplier,
    };
    this.trackYScroll = this.trackYScroll.bind(this);
  }

  componentDidMount() {
    this.trackYScroll();
    global.window.addEventListener('resize', this.trackYScroll, true);
  }

  trackYScroll() {
    const image = document.getElementById('deepField');
    const windowWidth = global.window.innerWidth;
    const initialWidth = windowWidth * windowMultiplier;
    // const initialHeight = initialWidth * 0.625;``

    image.width = initialWidth;
    const callback = () => {
      const { scrollY } = global.window;

      if (initialWidth - scrollY > windowWidth) {
        image.width = initialWidth - scrollY;
      }

      if (initialWidth - windowWidth < scrollY && !this.state.zoomedOut) {
        this.setState({ zoomedOut: true });
      }

      if (initialWidth - windowWidth > scrollY && this.state.zoomedOut) {
        this.setState({ zoomedOut: false });
      }
      this.setState({ imageWidth: image.width });
    };

    global.window.addEventListener('scroll', callback, true);
  }

  render() {
    const { zoomedOut } = this.state;
    const windowWidth = global.window.innerWidth;
    const imageHeight = this.state.imageWidth * 0.625;
    const percentZoomed = (this.state.imageWidth - windowWidth) / ((windowWidth * windowMultiplier) - windowWidth);
    const imageTopOffset = (imageHeight / 2) * percentZoomed;

    return (
      <div style={{ height: windowWidth * windowMultiplier }}>
        <div
          className={`d-flex justify-content-center w-100 ${zoomedOut ? 'd-none' : 'position-fixed'}`}
          style={{ height: zoomedOut ? (windowWidth * windowMultiplier) - windowWidth : '' }}
        >
          <img
            id="deepField"
            className={zoomedOut ? 'd-none' : 'position-fixed'}
            src={deepField}
            alt="deep field"
            style={{ top: `-${imageTopOffset}px` }}
          />
        </div>
        <div className={!zoomedOut ? 'd-none' : 'd-flex justify-content-center'}>
          <img
            style={{ width: windowWidth, height: windowWidth * 0.625 }}
            src={deepField}
            alt="deep field"
          />
        </div>
      </div>
    );
  }
}

export default ImageZoomer;
