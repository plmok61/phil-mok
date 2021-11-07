import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [expand, setExpand] = useState(false);
  const [githubInfo, setInfo] = useState({
    profilePic: '',
    repos: [],
  });

  const fetchGHInfo = useCallback(async () => {
    const profile = await axios.get('https://api.github.com/users/plmok61');
    const repos = await axios.get('https://api.github.com/users/plmok61/repos');

    console.log(profile.data);
    console.log(repos.data);

    setInfo({
      profilePic: profile.data.avatar_url,
      repos: repos.data,
    });
  }, []);

  useEffect(() => {
    fetchGHInfo();
  }, [fetchGHInfo]);

  return (
    <div className={`profilePicContainer ${expand ? 'expandContainer' : ''}`}>
      <button
        type="button"
        className={`imgButton ${expand ? 'expandButton' : ''}`}
        onClick={() => {
          setExpand((prev) => !prev);
        }}
      >
        {githubInfo.profilePic && (
        <img
          src={githubInfo.profilePic}
          alt="profile"
        />
        )}
      </button>
      {expand && (
        <div className="links">
          <a href="https://github.com/plmok61">GitHub</a>
          <a href="https://www.linkedin.com/in/philiplmok/">LinkedIn</a>
        </div>
      )}
    </div>
  );
}

export default Profile;
