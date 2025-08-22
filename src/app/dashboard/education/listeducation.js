'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './EducationList.module.css';
import SkillEditor from '../../../components/SkillSelector/SkillEditor';

export default function EducationList() {
  const [items, setItems] = useState([]);
  const [educationSkills, setEducationSkills] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);

    // 📌 Récupère les formations
    const { data: eduData, error: eduError } = await supabase
      .from('education')
      .select('*')
      .order('startDate', { ascending: false });

    if (eduError) {
      alert('Erreur : ' + eduError.message);
      setLoading(false);
      return;
    }

    const { data: skillLinks, error: skillError } = await supabase
      .from('education_skills')
      .select('education_id, skills ( id, name )');

    if (skillError) {
      alert('Erreur chargement compétences : ' + skillError.message);
      setLoading(false);
      return;
    }

    const skillMap = {};
    skillLinks?.forEach((link) => {
      const skill = link.skills;
      if (!skillMap[link.education_id]) skillMap[link.education_id] = [];
      skillMap[link.education_id].push(skill);
    });

    setEducationSkills(skillMap);
    setItems(eduData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (id, field, value) => {
    setItems((items) =>
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSkillChange = (eduId, skills) => {
    setEducationSkills((prev) => ({
      ...prev,
      [eduId]: skills,
    }));
  };

  const handleSave = async (item) => {
    setSaving(true);

    // 📌 Met à jour l'éducation
    const { error } = await supabase
      .from('education')
      .update(item)
      .eq('id', item.id);

    if (error) {
      alert('Erreur : ' + error.message);
      setSaving(false);
      return;
    }

    await supabase.from('education_skills').delete().eq('education_id', item.id);

    const currentSkills = educationSkills[item.id] || [];
    for (const skill of currentSkills) {
      await supabase.from('education_skills').insert({
        education_id: item.id,
        skill_id: skill.id,
      });
    }

    setEditingId(null);
    await fetchItems();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette entrée ?')) return;
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) alert('Erreur : ' + error.message);
    else fetchItems();
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.id} className={styles.card}>
          {editingId === item.id ? (
            <>
              <label>Institution:
                <input
                  type='text'
                  value={item.institution || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'institution', e.target.value)
                  }
                />
              </label>

              <label>Diplôme:
                <input
                  type='text'
                  value={item.studytype || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'studytype', e.target.value)
                  }
                />
              </label>

              <label>Spécialité:
                <input
                  type='text'
                  value={item.area || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'area', e.target.value)
                  }
                />
              </label>

              <label>Localisation:
                <input
                  type='text'
                  value={item.location || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'location', e.target.value)
                  }
                />
              </label>

              <label>Début:
                <input
                  type='date'
                  value={item.startDate || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'startDate', e.target.value)
                  }
                />
              </label>

              <label>Fin:
                <input
                  type='date'
                  value={item.endDate || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'endDate', e.target.value)
                  }
                />
              </label>

              <label>Résumé:
                <textarea
                  value={item.summary || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'summary', e.target.value)
                  }
                />
              </label>

              <label>Certificat URL:
                <input
                  type='url'
                  value={item.certificationUrl || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'certificationUrl', e.target.value)
                  }
                />
              </label>

              <label>
                Active:
                <input
                  type='checkbox'
                  checked={item.active || false}
                  onChange={(e) =>
                    handleInputChange(item.id, 'active', e.target.checked)
                  }
                />
              </label>

              {/* 📌 Ajout SkillEditor */}
              <label>Compétences :
                <SkillEditor
                  selected={educationSkills[item.id] || []}
                  onChange={(skills) => handleSkillChange(item.id, skills)}
                />
              </label>

              <div className={styles.buttons}>
                <button onClick={() => handleSave(item)} disabled={saving}>
                  💾 Enregistrer
                </button>
                <button onClick={() => setEditingId(null)}>❌ Annuler</button>
              </div>
            </>
          ) : (
            <>
              <h3>{item.institution || <i>(Institution inconnue)</i>}</h3>
              <p>{item.studytype} - {item.area}</p>
              <p><strong>Dates:</strong> {item.startDate} → {item.endDate}</p>
              <p><strong>Lieu:</strong> {item.location}</p>
              <p>{item.summary || <i>Aucun résumé</i>}</p>
              {item.certificationUrl && (
                <a href={item.certificationUrl} target="_blank" rel="noreferrer">
                  📜 Certificat
                </a>
              )}
              <div>
                <strong>Active:</strong> {item.active ? '✅' : '❌'}
              </div>

              {/* 📌 Affichage des compétences */}
              <div>
                <strong>Compétences :</strong>
                {educationSkills[item.id]?.length
                  ? educationSkills[item.id].map((s) => s.name).join(', ')
                  : <i>Aucune</i>}
              </div>

              <div className={styles.buttons}>
                <button onClick={() => setEditingId(item.id)}>
                  ✏️ Modifier
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  🗑️ Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
