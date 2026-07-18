import React from 'react';

interface AppEntry {
  name: string;
  description: string;
  appStoreUrl: string;
}

// Add iOS apps here — each renders as a card linking to the App Store.
const apps: AppEntry[] = [
  // { name: 'My App', description: 'One-liner.', appStoreUrl: 'https://apps.apple.com/...' },
];

function AppLinks() {
  if (apps.length === 0) {
    return null;
  }

  return (
    <section className="appsSection">
      <h2>~/apps</h2>
      <div className="appCards">
        {apps.map((app) => (
          <a
            key={app.appStoreUrl}
            className="appCard"
            href={app.appStoreUrl}
            target="_blank"
            rel="noreferrer"
          >
            <p className="appCardName">{app.name}</p>
            <p className="appCardDescription">{app.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default AppLinks;
