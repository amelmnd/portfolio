'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient'; // adapte le chemin si besoin
import styles from './AddProject.module.css';
import Link from 'next/link';

export default function AddProject({ onAdded, onBack }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    imgLink: '',
    repoURL: '',
    demoURL: '',
    date: '',
    fav: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Cloudinary upload error:', errorData);
    throw new Error('Erreur lors de l’upload sur Cloudinary');
  }

  const data = await res.json();
  return data.secure_url;
}


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let imageUrl = form.imgLink;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const { error } = await supabase.from('projects').insert([
        {
          title: form.title,
          description: form.description,
          imgLink: imageUrl,
          repoURL: form.repoURL,
          demoURL: form.demoURL,
          date: form.date || null,
          fav: form.fav,
        },
      ]);

      if (error) throw error;

      if (onAdded) onAdded();
    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <button onClick={onBack} className='backButton'>
        ← Retour
      </button>

      <h2 className={styles.title}>Ajouter un projet</h2>

      <label className={styles.label}>
        Titre:
        <input
          className={styles.input}
          type='text'
          name='title'
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Description:
        <textarea
          className={styles.textarea}
          name='description'
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        URL du dépôt (repoURL):
        <input
          className={styles.input}
          type='url'
          name='repoURL'
          value={form.repoURL}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        URL de la démo (demoURL):
        <input
          className={styles.input}
          type='url'
          name='demoURL'
          value={form.demoURL}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Date:
        <input
          className={styles.input}
          type='date'
          name='date'
          value={form.date}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        <input
          className={styles.checkbox}
          type='checkbox'
          name='fav'
          checked={form.fav}
          onChange={handleChange}
        />
        Favori
      </label>

      <label className={styles.label}>
        Image (upload) :
        <input
          className={styles.input}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <div className={styles.previewContainer}>
          <strong>Preview:</strong>
          <img src={preview} alt='preview' className={styles.previewImage} />
        </div>
      )}

      {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

      <div className={styles.buttonGroup}>
        <button className={styles.button} type='submit' disabled={loading}>
          {loading ? 'Chargement...' : 'Ajouter le projet'}
        </button>

        {onBack && (
          <button
            type='button'
            onClick={onBack}
            className={styles.button}
            disabled={loading}
            style={{ backgroundColor: '#666' }}
          >
            Retour
          </button>
        )}
      </div>
    </form>
  );
}
