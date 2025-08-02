'use client';

import { useState } from 'react';
import AddProject from './addproject';
import ProjectList from './listproject';

export default function ProjectsPage() {
  const [view, setView] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProjectAdded = () => {
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
            ➕ Ajouter un projet
          </button>
          <ProjectList key={refreshKey} />
        </>
      ) : (
        <AddProject onAdded={handleProjectAdded} onBack={handleBack} />
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
