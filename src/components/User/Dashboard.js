'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const allowedEmails = ['ton@email.com', 'admin@exemple.com'];

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const email = data?.user?.email;

      if (!email || !allowedEmails.includes(email)) {
        alert('Accès refusé. Email non autorisé.');
        await supabase.auth.signOut();
        router.push('/login');
      }
    };

    checkUser();
  }, []);

  return <div>Dashboard privé</div>;
}
