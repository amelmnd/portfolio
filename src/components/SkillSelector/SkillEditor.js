'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './SkillSelector.module.css';

export default function SkillEditor({ selected = [], onChange }) {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(selected);

  useEffect(() => {
    setSelectedSkills(selected);
  }, [selected]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from('skills').select('*').order('name');
      if (error) {
        alert('Erreur chargement compétences : ' + error.message);
        return;
      }
      setAllSkills(data || []);
    };
    fetchSkills();
  }, []);

  const toggleSkill = (skill) => {
    let updated;
    if (selectedSkills.find((s) => s.id === skill.id)) {
      updated = selectedSkills.filter((s) => s.id !== skill.id);
    } else {
      updated = [...selectedSkills, skill];
    }
    setSelectedSkills(updated);
    onChange && onChange(updated);
  };

  return (
    <div className={styles.skillEditor}>
      {allSkills.map((skill) => (
        <button
          type="button"
          key={skill.id}
          onClick={() => toggleSkill(skill)}
          className={selectedSkills.find((s) => s.id === skill.id) ? styles.selected : ''}
        >
          {skill.name}
        </button>
      ))}
    </div>
  );
}
