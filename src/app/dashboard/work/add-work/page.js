'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from '../../AddProject.module.css';
import SkillEditor from '@/components/SkillSelector/SkillEditor';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

export default function AddWork({ onAdded, onBack }) {
  const [form, setForm] = useState({
    enterpriseName: '',
    job: '',
    location_type: '',
    location: '',
    startDate: '',
    endDate: '',
    summary: '',
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
        .from('work')
        .insert([{
          enterpriseName: form.enterpriseName,
          job: form.job,
          location_type: form.location_type,
          location: form.location,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          summary: form.summary,
          active: form.active,
        }])
        .select()
        .single();

      if (error) throw error;

      if (selectedSkills.length) {
        const links = selectedSkills.map(skill => ({
          work_id: data.id,
          skill_id: skill.id,
        }));
        const { error: skillError } = await supabase
          .from('work_skills')
          .insert(links);
        if (skillError) throw skillError;
      }

      if (onAdded) onAdded();
    } catch (error) {
      setErrorMsg(error.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <ReturnButton routeName={'/dashboard/work'} />
      
      <h2 className={styles.title}>Ajouter une expérience</h2>

      <label className={styles.label}>
        Entreprise :
        <input
          className={styles.input}
          type="text"
          name="enterpriseName"
          value={form.enterpriseName}
          onChange={handleChange}
          required
        />
      </label>

      <label className={styles.label}>
        Poste :
        <input
          className={styles.input}
          type="text"
          name="job"
          value={form.job}
          onChange={handleChange}
        />
      </label>

      <label className={styles.label}>
        Type de lieu :
        <input
          className={styles.input}
          type="text"
          name="location_type"
          value={form.location_type}
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
        Poste actuel
      </label>

      <label className={styles.label}>
        Compétences utilisées :
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
