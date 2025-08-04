'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './SkillSelector.module.css';

export default function SkillSelector({ selected = [], onChange }) {
  const [allSkills, setAllSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(selected);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    setFiltered(
      allSkills.filter(
        (s) =>
          s.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedSkills.find((sel) => sel.id === s.id)
      )
    );
  }, [inputValue, allSkills, selectedSkills]);

  const fetchSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*').order('name');
    if (!error) setAllSkills(data || []);
  };

  const handleSelect = (skill) => {
    const updated = [...selectedSkills, skill];
    setSelectedSkills(updated);
    setInputValue('');
    onChange?.(updated);
  };

  const handleRemove = (skillId) => {
    const updated = selectedSkills.filter((s) => s.id !== skillId);
    setSelectedSkills(updated);
    onChange?.(updated);
  };

  const handleAddNew = async () => {
    if (!inputValue.trim()) return;
    const name = inputValue.trim();

    const { data, error } = await supabase
      .from('skills')
      .insert({ name })
      .select()
      .single();

    if (!error && data) {
      setAllSkills([...allSkills, data]);
      handleSelect(data);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Compétences</label>

      <div className={styles.tagsContainer}>
        {selectedSkills.map((skill) => (
          <span key={skill.id} className={styles.tag}>
            {skill.name}
            <button
              onClick={() => handleRemove(skill.id)}
              className={styles.removeButton}
              title="Supprimer"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        placeholder="Ajouter une compétence..."
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.input}
      />

      {inputValue && (
        <div className={styles.dropdown}>
          {filtered.length > 0 ? (
            filtered.map((skill) => (
              <div
                key={skill.id}
                className={styles.dropdownItem}
                onClick={() => handleSelect(skill)}
              >
                {skill.name}
              </div>
            ))
          ) : (
            <div className={styles.addNewItem} onClick={handleAddNew}>
              ➕ Ajouter “{inputValue}”
            </div>
          )}
        </div>
      )}
    </div>
  );
}
