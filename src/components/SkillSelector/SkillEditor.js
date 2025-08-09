'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './SkillSelector.module.css';

export default function SkillEditor({ selected = [], onChange }) {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(selected);
  const [newSkillName, setNewSkillName] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSelectedSkills(selected);
  }, [selected]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');
      if (error) {
        alert('Erreur chargement compétences : ' + error.message);
        return;
      }
      setAllSkills(data || []);
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const search = newSkillName.trim().toLowerCase();
    if (search.length === 0) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(search) &&
        !selectedSkills.find((s) => s.id === skill.id)
    );
    setFilteredSuggestions(filtered);
  }, [newSkillName, allSkills, selectedSkills]);

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

  const addSkill = async () => {
    const trimmedName = newSkillName.trim();
    if (!trimmedName) return;

    const existing = allSkills.find(
      (skill) => skill.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      toggleSkill(existing);
      setNewSkillName('');
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('skills')
      .insert({ name: trimmedName })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert('Erreur lors de l’ajout : ' + error.message);
      return;
    }

    setAllSkills((prev) => [...prev, data]);
    toggleSkill(data);
    setNewSkillName('');
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (skill) => {
    toggleSkill(skill);
    setNewSkillName('');
    setShowSuggestions(false);
  };

  return (
    <div className={styles.skillEditor}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ajouter une compétence"
          className={styles.input}
          value={newSkillName}
          onChange={(e) => {
            setNewSkillName(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        <button
          type="button"
          onClick={addSkill}
          disabled={loading || !newSkillName.trim()}
          className={styles.addNewItem}
        >
          Ajouter
        </button>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className={styles.dropdown}>
            {filteredSuggestions.map((skill) => (
              <div
                key={skill.id}
                className={styles.dropdownItem}
                onClick={() => handleSelectSuggestion(skill)}
              >
                {skill.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.tagsContainer}>
        {allSkills.map((skill) => (
          <button
            type="button"
            key={skill.id}
            onClick={() => toggleSkill(skill)}
            className={`${styles.skillButton} ${
              selectedSkills.find((s) => s.id === skill.id)
                ? styles.selected
                : ''
            }`}
          >
            {skill.name}
          </button>
        ))}
      </div>
    </div>
  );
}
