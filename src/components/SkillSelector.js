'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
    <div className="w-full max-w-xl">
      <label className="font-semibold text-sm">Compétences</label>
      <div className="flex flex-wrap gap-2 my-2">
        {selectedSkills.map((skill) => (
          <span
            key={skill.id}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {skill.name}
            <button
              onClick={() => handleRemove(skill.id)}
              className="text-xs text-red-600 hover:text-red-800"
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
        className="border w-full px-3 py-2 rounded"
      />

      {inputValue && (
        <div className="border mt-1 rounded shadow bg-white max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((skill) => (
              <div
                key={skill.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(skill)}
              >
                {skill.name}
              </div>
            ))
          ) : (
            <div
              className="px-3 py-2 cursor-pointer text-blue-600 hover:underline"
              onClick={handleAddNew}
            >
              ➕ Ajouter “{inputValue}”
            </div>
          )}
        </div>
      )}
    </div>
  );
}
