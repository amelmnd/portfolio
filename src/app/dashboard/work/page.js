'use client';

import { useState } from 'react';
import AddWork from './addwork';
import WorkList from './listwork';

export default function WorkPage() {
  const [view, setView] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWorkAdded = () => {
    setView('list');
    setRefreshKey((prev) => prev + 1);
  };

  const handleBack = () => {
    setView('list');
  };

  return (
    <main style={{ padding: 20 }}>
      {view === 'list' ? (
        <>
          <button onClick={() => setView('form')} style={buttonStyle}>
            ➕ Ajouter une expérience
          </button>
          <WorkList key={refreshKey} />
        </>
      ) : (
        <AddWork onAdded={handleWorkAdded} onBack={handleBack} />
      )}
    </main>
  );
}

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#0070f3',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  marginBottom: '20px',
  cursor: 'pointer',
};
