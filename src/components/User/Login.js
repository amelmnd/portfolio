'use client';

import { supabase } from '../lib/supabaseClient';

const allowedEmails = ['ton@email.com', 'admin@exemple.com'];

export default function LoginWithGitHub() {
  const handleGitHubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error('Erreur connexion GitHub:', error.message);
    }
  };

  return <button onClick={handleGitHubLogin}>Se connecter avec GitHub</button>;
}
