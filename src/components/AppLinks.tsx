import React from 'react';

interface AppEntry {
  name: string;
  description: string;
  appStoreUrl: string;
}

// Add iOS apps here — each renders as a card linking to the App Store.
const apps: AppEntry[] = [
  {
    name: 'Luxwend',
    description: 'A calm focus timer — a thread of light winds through a generated maze until your time is up.',
    appStoreUrl: 'https://apps.apple.com/us/app/luxwend/id6785949480',
  },
  {
    name: 'Drake Equation Calculator',
    description: 'Estimate the number of communicative extraterrestrial civilizations in the Milky Way.',
    appStoreUrl: 'https://apps.apple.com/us/app/drake-equation-calculator/id1360650293',
  },
];

function AppLinks() {
  if (apps.length === 0) {
    return null;
  }

  return (
    <section className="appsSection">
      <h2>Apps</h2>
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
