'use client';

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
          onChange={(e) => onChange(project.id, 'description', e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Image :
        {preview ? (
          <img src={preview} className={styles.image} alt="Preview" />
        ) : project.imglink ? (
          <img src={project.imglink} className={styles.image} alt={project.title} />
        ) : (
          <i className={styles.noImage}>Pas d’image</i>
        )}
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={(e) => onImageChange(project.id, e.target.files[0])}
        />
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
