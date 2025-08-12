'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EducationList from './listeducation';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

export default function EducationPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  return (
    <main style={{ padding: 20 }}>
      <ReturnButton routeName={'/dashboard'} />
      <div>
        <button
          onClick={() =>
            router.push('/dashboard/education/add-education')
          }
          style={buttonStyle}
        >
          ➕ Ajouter une formation
        </button>
        <EducationList key={refreshKey} />
      </div>
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
