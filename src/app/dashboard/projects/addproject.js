'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from './AddProject.module.css';
import Link from 'next/link';
import SkillSelector from '../../../components/SkillSelector/SkillSelector';

export default function AddProject({ onAdded, onBack }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    imglink: '',
    repourl: '',
    demourl: '',
    date: '',
    fav: false,
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
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
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

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
      let imageUrl = form.imglink;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: form.title,
            description: form.description,
            imglink: imageUrl,
            repourl: form.repourl,
            demourl: form.demourl,
            date: form.date || null,
            fav: form.fav,
          },
        ])
        .select()
        .single(); // 👈 pour récupérer le nouvel ID

      if (error) throw error;

      // ⬇️ Lien projet ↔ compétences
      for (const skill of selectedSkills) {
        await supabase.from('project_skills').insert({
          project_id: data.id,
          skill_id: skill.id,
        });
      }

      if (onAdded) onAdded();
    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <button onClick={onBack} className='backButton'>← Retour</button>

      <h2 className={styles.title}>Ajouter un projet</h2>

      <label className={styles.label}>
        Titre:
        <input className={styles.input} type='text' name='title' value={form.title} onChange={handleChange} required />
      </label>

      <label className={styles.label}>
        Description:
        <textarea className={styles.textarea} name='description' value={form.description} onChange={handleChange} />
      </label>

      <label className={styles.label}>
        URL du dépôt (repourl):
        <input className={styles.input} type='url' name='repourl' value={form.repourl} onChange={handleChange} />
      </label>

      <label className={styles.label}>
        URL de la démo (demourl):
        <input className={styles.input} type='url' name='demourl' value={form.demourl} onChange={handleChange} />
      </label>

      <label className={styles.label}>
        Date:
        <input className={styles.input} type='date' name='date' value={form.date} onChange={handleChange} />
      </label>

      <label className={styles.label}>
        <input className={styles.checkbox} type='checkbox' name='fav' checked={form.fav} onChange={handleChange} />
        Favori
      </label>

      <label className={styles.label}>
        Image (upload) :
        <input className={styles.input} type='file' accept='image/*' onChange={handleFileChange} />
      </label>

      {preview && (
        <div className={styles.previewContainer}>
          <strong>Preview:</strong>
          <img src={preview} alt='preview' className={styles.previewImage} />
        </div>
      )}

      {/* 💡 Ajout du sélecteur de compétences */}
      <div style={{ marginBottom: '1rem' }}>
        <SkillSelector selected={selectedSkills} onChange={setSelectedSkills} />
      </div>

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
