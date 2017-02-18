import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './index.css';

import App from './components/App';
import Summary from './components/Summary';
import About from './components/About';
import LinksToAccounts from './components/LinksToAccounts';
import MyWork from './components/MyWork';
import NotFound from './components/NotFound';

injectTapEventPlugin();

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Summary} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={LinksToAccounts} />
      <Route path="/work" component={MyWork} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>,
  document.getElementById('root')
);
