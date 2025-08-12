'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from '../../AddProject.module.css'; // ✅ même CSS que AddProject
import SkillEditor from '@/components/SkillSelector/SkillEditor';
import SkillSelector from '@/components/SkillSelector/SkillSelector';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

export default function AddEducation({ onAdded, onBack }) {
  const [form, setForm] = useState({
    institution: '',
    studytype: '',
    area: '',
    location: '',
    certificationUrl: '',
    summary: '',
    startDate: '',
    endDate: '',
    active: false,
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase
        .from('education')
        .insert([
          {
            institution: form.institution,
            studytype: form.studytype,
            area: form.area,
            location: form.location,
            certificationUrl: form.certificationUrl,
            summary: form.summary,
            startDate: form.startDate || null,
            endDate: form.endDate || null,
            active: form.active,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (selectedSkills.length) {
        for (const skill of selectedSkills) {
          await supabase.from('education_skills').insert({
            education_id: data.id,
            skill_id: skill.id,
          });
        }
      }

      if (onAdded) onAdded();
    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <ReturnButton routeName={'/dashboard/education'} />
      <h2 className={styles.title}>Ajouter une formation</h2>

      <label className={styles.label}>
        Institution :
        <input
          className={styles.input}
          type="text"
          name="institution"
          value={form.institution}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Diplôme :
        <input
          className={styles.input}
          type="text"
          name="studytype"
          value={form.studytype}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Spécialité :
        <input
          className={styles.input}
          type="text"
          name="area"
          value={form.area}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Localisation :
        <input
          className={styles.input}
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        URL du certificat :
        <input
          className={styles.input}
          type="url"
          name="certificationUrl"
          value={form.certificationUrl}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Résumé :
        <textarea
          className={styles.textarea}
          name="summary"
          value={form.summary}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Début :
        <input
          className={styles.input}
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Fin :
        <input
          className={styles.input}
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />
      </label>

      <label className={styles.labelCheckbox}>
        <input
          className={styles.checkbox}
          type="checkbox"
          name="active"
          checked={form.active}
          onChange={handleChange}
        />
        Formation en cours
      </label>

      <label className={styles.label}>
        Compétences acquises :
        <SkillEditor selected={selectedSkills} onChange={setSelectedSkills} />
      </label>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <div className={styles.buttons}>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Enregistrement...' : 'Ajouter'}
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className={styles.cancelBtn}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
