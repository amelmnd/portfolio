'use client';

import { useState } from 'react';
import AddEducation from './addeducation';
import EducationList from './listeducation';
import SkillSelector from '../../../components/SkillSelector/SkillSelector';

export default function EducationPage() {
  const [view, setView] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEducationAdded = () => {
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
            ➕ Ajouter une formation
          </button>
          <EducationList key={refreshKey} />
        </>
      ) : (
        <AddEducation onAdded={handleEducationAdded} onBack={handleBack} />
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
