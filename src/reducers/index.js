import { combineReducers } from 'redux';
import { responsiveStateReducer } from 'redux-responsive';
import githubReducer from './github.reducer';

export default combineReducers({
  browser: responsiveStateReducer,
  githubState: githubReducer,
});
