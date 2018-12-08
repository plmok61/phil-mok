import React, { Component } from 'react';

import '../App.css';
import deepField from '../assets/deep-field.jpg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: window.scrollY,
    };
  }

  componentDidMount() {
    const image = document.getElementById('deepField');
    const initialWidth = 1680;
    console.log('````', image.width);
    const initialHeight = 1050;
    window.addEventListener('scroll', () => {
      this.setState({ scrollY: window.scrollY });

      const scrolled = window.scrollY / (image.offsetHeight + 1);

      console.log(`window.scrollY: ${window.scrollY}`);
      console.log(`scrolled: ${scrolled}`);

      const zoomLevels = 0.3; // change to have a different behavior
      const scale = Math.pow(3, scrolled * zoomLevels);
      // .getElementsByTagName('img');
      console.log(`scale:${scale}`);
      image.width = Math.round(initialWidth / scale);
      image.height = Math.round(initialHeight / scale);
      console.log('~~~~~~~', image.width);
      this.setState({
        imageWidth: image.width,
      });
    }, true);
  }

  render() {
    const heroClass = this.state.scrollY < 3000 ? 'heroImage' : 'heroImage2';
    return (
      <div className="appContainer">
        <div className="heroContainer">
          <img id="deepField" className={heroClass} src={deepField} alt="deep field" />
        </div>
      </div>
    );
  }
}

// import panAndZoomHoc from 'react-pan-and-zoom-hoc';
//
// class Figure extends React.Component {
//   render() {
//     const {
//       x, y, scale, width, height, ...other
//     } = this.props;
//     return (<div style={{
// width, height, overflow: 'hidden', border: '1px solid black',
// }}
//     >
//       <img style={{ transform: `scale(${scale}, ${scale}) translate(${(0.5 - x) * width}px, ${(0.5 - y) * height}px` }} width={width} height={height} {...other} />
//             </div>);
//   }
// }
//
// const PannableAndZoomableFigure = panAndZoomHoc(Figure);
//
// class App extends React.Component {
//   render() {
//     return (<PannableAndZoomableFigure
//       renderOnChange
//       passOnProps
//       src={deepField}
//       width={400}
//       height={200}
//     />);
//   }
// }

export default App;
