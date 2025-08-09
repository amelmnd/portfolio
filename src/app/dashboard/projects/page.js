'use client';

import { useState } from 'react';
import EditableProjectList from '@/components/Projects/EditableProjectList';
import AddProject from '@/components/Projects/AddProject';

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
          <button
            onClick={() => setView('form')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              marginBottom: '20px',
              cursor: 'pointer',
            }}
          >
            ➕ Ajouter un projet
          </button>
          <EditableProjectList key={refreshKey} />
        </>
      ) : (
        <AddProject onAdded={handleProjectAdded} onBack={handleBack} />
      )}
    </main>
  );
}
