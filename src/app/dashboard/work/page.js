'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import WorkList from './listwork';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

export default function WorkPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  return (
    <main style={{ padding: 20 }}>
      <ReturnButton routeName={'/dashboard'} />

      <div>
        <button
          onClick={() => router.push('/dashboard/work/add-work')}
          style={buttonStyle}
        >
          ➕ Ajouter une expérience
        </button>
        <WorkList key={refreshKey} />
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
