'use client';

import { useState } from 'react';
import styles from '../styles/Dashboard.module.css';

export default function AddProject({ onAdded, onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imgLink: '',
    repoURL: '',
    demoURL: '',
    date: '',
    fav: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(file) {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'YOUR_PRESET'); // Remplace avec ton preset
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/{]/image/upload',
      {
        method: 'POST',
        body: form,
      }
    );
    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.imgLink;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
    }

    const { title, description, repoURL, demoURL, date, fav } = formData;
    const { data, error } = await fetch('/api/addProject', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        imgLink: imageUrl,
        repoURL,
        demoURL,
        date,
        fav,
      }),
    });

    setUploading(false);
    onAdded();
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <button type='button' onClick={onBack} className={styles.button}>
        ← Retour
      </button>

      <input name='title' placeholder='Titre' onChange={handleChange} />
      <textarea
        name='description'
        placeholder='Description'
        onChange={handleChange}
      />
      <input name='repoURL' placeholder='Repo URL' onChange={handleChange} />
      <input name='demoURL' placeholder='Demo URL' onChange={handleChange} />
      <input type='date' name='date' onChange={handleChange} />
      <label>
        Favori
        <input type='checkbox' name='fav' onChange={handleChange} />
      </label>

      <input type='file' onChange={(e) => setImageFile(e.target.files[0])} />

      {imageFile && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt='Preview'
          style={{ maxWidth: '200px', marginTop: '10px' }}
        />
      )}

      <button type='submit' disabled={uploading}>
        {uploading ? 'Envoi...' : 'Ajouter'}
      </button>
    </form>
  );
}
