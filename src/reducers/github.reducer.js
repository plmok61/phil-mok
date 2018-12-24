import { types } from '../actions/github.actions';

const initialState = {
  githubData: {},
  loading: false,
};

export default function githubReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_GITHUB_DATA_START:
      return { ...state, loading: true };
    case types.FETCH_GITHUB_DATA_COMPLETE:
      return {
        ...state,
        loading: false,
        githubData: action.githubData,
        repose: action.repos,
      };
    default:
      return state;
  }
}
