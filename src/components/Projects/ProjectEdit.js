'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './ProjectEdit.module.css';
import SkillSelector from '../SkillSelector/SkillSelector';
import SkillEditor from '../SkillSelector/SkillEditor';

export default function ProjectEdit({
  project,
  skills,
  onChange,
  onSkillChange,
  onImageChange,
  onSave,
  onCancel,
  saving,
  preview,
}) {
  const [educations, setEducations] = useState([]);
  const maxChars = 200; // Limite de caractères
  const [charCount, setCharCount] = useState(project.description?.length || 0);

  // ✅ Nouveau state local pour le preview
  const [localPreview, setLocalPreview] = useState(preview || project.imglink || '');

  useEffect(() => {
    const fetchEducation = async () => {
      const { data, error } = await supabase.from('education').select('id, institution');
      if (error) {
        console.error('Erreur récupération éducation :', error.message);
      } else {
        setEducations(data);
      }
    };
    fetchEducation();
  }, []);
  
  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    if (value.length <= maxChars) {
      onChange(project.id, 'description', value);
      setCharCount(value.length);
    } else {
      // Optionnel : alerte quand la limite est dépassée
      alert(`Limite de ${maxChars} caractères atteinte !`);
    }
  };

  // ✅ Nouveau handler pour le fichier
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result);
      onImageChange(project.id, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.card}>
      <label className={styles.label}>
        Titre :
        <input
          type="text"
          className={styles.input}
          value={project.title || ''}
          onChange={(e) => onChange(project.id, 'title', e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Description :
        <textarea
          className={styles.textarea}
          value={project.description || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 200) {
              onChange(project.id, 'description', value);
            }
          }}
          maxLength={200}
        />
        <div
          className={`${styles.charCounter} ${
            (project.description?.length || 0) >= 200 ? styles.charLimitReached : ''
          }`}
        >
          {(project.description?.length || 0)}/200 caractères
        </div>
      </label>

      <label className={styles.label}>
        Éducation :
        <select
          className={styles.input}
          value={project.education_id || ''}
          onChange={(e) => onChange(project.id, 'education_id', e.target.value)}
        >
          <option value="">-- Sélectionner --</option>
          <option> Projet perso</option>
          {educations.map((edu) => (
            <option key={edu.id} value={edu.id}>
              {edu.institution}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Repo URL :
        <input
          type="text"
          className={styles.input}
          value={project.repourl || ''}
          onChange={(e) => onChange(project.id, 'repourl', e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Démo URL :
        <input
          type="text"
          className={styles.input}
          value={project.demourl || ''}
          onChange={(e) => onChange(project.id, 'demourl', e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Date :
        <input
          type="date"
          className={styles.input}
          value={project.date || ''}
          onChange={(e) => onChange(project.id, 'date', e.target.value)}
        />
      </label>

      <label className={styles.labelCheckbox}>
        Favori :
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={project.fav || false}
          onChange={(e) => onChange(project.id, 'fav', e.target.checked)}
        />
      </label>

      <label className={styles.label}>
        Compétences :
        <SkillEditor selected={skills} onChange={onSkillChange} />
      </label>

      <label className={styles.label}>
        Image :
        {localPreview ? (
          <img src={localPreview} className={styles.image} alt={project.title} />
        ) : (
          <i className={styles.noImage}>Pas d’image</i>
        )}
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleImageChange}
        />
      </label>

      <div className={styles.buttons}>
        <button
          onClick={onSave}
          disabled={saving}
          className={styles.saveBtn}
          type="button"
        >
          💾 Enregistrer
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className={styles.cancelBtn}
          type="button"
        >
          ❌ Annuler
        </button>
      </div>
    </div>
  );
}
