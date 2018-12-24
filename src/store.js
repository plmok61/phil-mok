import { createStore, applyMiddleware, compose } from 'redux';
import { responsiveStoreEnhancer } from 'redux-responsive';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducers';


// Note: this API requires redux@>=3.1.0
const store = createStore(
  reducers,
  compose(
    responsiveStoreEnhancer,
    applyMiddleware(thunk, logger),
  ),
);

export default store;
