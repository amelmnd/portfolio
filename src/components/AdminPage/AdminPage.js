'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AddProjectForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    repoURL: '',
    demoURL: '',
    image: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload image to Cloudinary
      const imageData = new FormData();
      imageData.append('file', form.image);
      imageData.append('upload_preset', 'TON_UPLOAD_PRESET'); // à configurer sur cloudinary
      imageData.append('cloud_name', 'TON_CLOUD_NAME');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/TON_CLOUD_NAME/image/upload',
        {
          method: 'POST',
          body: imageData,
        }
      );

      const cloudinaryData = await res.json();

      if (!cloudinaryData.secure_url) {
        throw new Error("Échec de l'upload sur Cloudinary");
      }

      // 2. Save project in Supabase
      const { error } = await supabase.from('projects').insert([
        {
          title: form.title,
          description: form.description,
          repoURL: form.repoURL,
          demoURL: form.demoURL,
          imgSrc: cloudinaryData.secure_url, // URL de l’image uploadée
        },
      ]);

      if (error) {
        console.error('Erreur Supabase:', error);
        alert('Erreur lors de l’envoi à Supabase');
      } else {
        alert('Projet ajouté avec succès ✅');
        setForm({
          title: '',
          description: '',
          repoURL: '',
          demoURL: '',
          image: null,
        });
      }
    } catch (err) {
      console.error(err);
      alert('Erreur durant le processus');
    }

    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: 500,
      }}
    >
      <input
        type='text'
        name='title'
        placeholder='Titre'
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        name='description'
        placeholder='Description'
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type='url'
        name='repoURL'
        placeholder='Lien GitHub'
        value={form.repoURL}
        onChange={handleChange}
        required
      />
      <input
        type='url'
        name='demoURL'
        placeholder='Lien Démo'
        value={form.demoURL}
        onChange={handleChange}
      />
      <input
        type='file'
        name='image'
        accept='image/*'
        onChange={handleChange}
        required
      />
      <button type='submit' disabled={uploading}>
        {uploading ? 'Envoi en cours...' : 'Ajouter le projet'}
      </button>
    </form>
  );
}
