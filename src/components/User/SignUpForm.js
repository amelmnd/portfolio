'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SignUpForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Vérifie ta boîte mail pour confirmer ton compte ✅');
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <input
        type='email'
        name='email'
        placeholder='Email'
        onChange={handleChange}
        required
      />
      <input
        type='password'
        name='password'
        placeholder='Mot de passe'
        onChange={handleChange}
        required
      />
      <button type='submit'>Créer un compte</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}
    </form>
  );
}
