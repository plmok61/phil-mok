import axios from 'axios';

export const types = {
  FETCH_GITHUB_DATA_START: 'FETCH_GITHUB_DATA_START',
  FETCH_GITHUB_DATA_COMPLETE: 'FETCH_GITHUB_DATA_COMPLETE',
};

function fetchGitHubData() {
  return async (dispatch) => {
    dispatch({ type: types.FETCH_GITHUB_DATA_START });

    const response = await axios.get('https://api.github.com/users/plmok61');
    const repos = await axios.get('https://api.github.com/users/plmok61/repos');

    dispatch({
      type: types.FETCH_GITHUB_DATA_COMPLETE,
      githubData: response.data,
      repos: repos.data,
    });
  };
}

export const actions = {
  fetchGitHubData,
};
