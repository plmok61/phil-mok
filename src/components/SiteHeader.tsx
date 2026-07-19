import React from 'react';

function SiteHeader() {
  return (
    <header className="siteHeader">
      <h1 className="siteTitle">
        Phil Mok
        <span className="dot">.</span>
      </h1>
      <nav className="headerLinks">
        {/* future: <a href="/stories">stories</a> */}
        <a
          href="https://github.com/plmok61"
          target="_blank"
          rel="noreferrer"
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/philiplmok/"
          target="_blank"
          rel="noreferrer"
        >
          linkedin
        </a>
      </nav>
    </header>
  );
}

export default SiteHeader;
