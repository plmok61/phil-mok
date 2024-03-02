import React from 'react';
import dynamic from 'next/dynamic';

const App = dynamic(
  () => import('../components/App'),
  { ssr: false },
);

function Page() {
  return (
    <App />
  );
}

export default Page;
