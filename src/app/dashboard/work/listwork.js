'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from '../education/EducationList.module.css'; // ✅ même style
import SkillEditor from '../../../components/SkillSelector/SkillEditor';

export default function WorkList() {
  const [items, setItems] = useState([]);
  const [workSkills, setWorkSkills] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);

    const { data: workData, error: workError } = await supabase
      .from('work')
      .select('*')
      .order('startDate', { ascending: false });

    if (workError) {
      alert('Erreur : ' + workError.message);
      setLoading(false);
      return;
    }

    const { data: links, error: skillsError } = await supabase
      .from('work_skills')
      .select('work_id, skills ( id, name )');

    if (skillsError) {
      alert('Erreur chargement compétences : ' + skillsError.message);
      setLoading(false);
      return;
    }

    const skillMap = {};
    links?.forEach((link) => {
      const skill = link.skills;
      if (!skillMap[link.work_id]) skillMap[link.work_id] = [];
      skillMap[link.work_id].push(skill);
    });

    setWorkSkills(skillMap);
    setItems(workData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSkillChange = (workId, skills) => {
    setWorkSkills((prev) => ({
      ...prev,
      [workId]: skills,
    }));
  };

  const handleSave = async (item) => {
    setSaving(true);

    // 📌 Mise à jour de l'expérience
    const { error } = await supabase.from('work').update(item).eq('id', item.id);
    if (error) {
      alert('Erreur : ' + error.message);
      setSaving(false);
      return;
    }

    await supabase.from('work_skills').delete().eq('work_id', item.id);

    const currentSkills = workSkills[item.id] || [];
    for (const skill of currentSkills) {
      await supabase.from('work_skills').insert({
        work_id: item.id,
        skill_id: skill.id,
      });
    }

    setEditingId(null);
    await fetchItems();
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette expérience ?')) return;
    const { error } = await supabase.from('work').delete().eq('id', id);
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
              <label>Entreprise:
                <input
                  type="text"
                  value={item.enterpriseName || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'enterpriseName', e.target.value)
                  }
                />
              </label>

              <label>Poste:
                <input
                  type="text"
                  value={item.job || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'job', e.target.value)
                  }
                />
              </label>

              <label>Type de lieu:
                <input
                  type="text"
                  value={item.location_type || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'location_type', e.target.value)
                  }
                />
              </label>

              <label>Localisation:
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'location', e.target.value)
                  }
                />
              </label>

              <label>Début:
                <input
                  type="date"
                  value={item.startDate || ''}
                  onChange={(e) =>
                    handleInputChange(item.id, 'startDate', e.target.value)
                  }
                />
              </label>

              <label>Fin:
                <input
                  type="date"
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

              <label>
                Poste actuel:
                <input
                  type="checkbox"
                  checked={item.active || false}
                  onChange={(e) =>
                    handleInputChange(item.id, 'active', e.target.checked)
                  }
                />
              </label>

              {/* 📌 SkillEditor pour édition */}
              <label>Compétences :
                <SkillEditor
                  selected={workSkills[item.id] || []}
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
              <h3>{item.enterpriseName || <i>(Sans entreprise)</i>}</h3>
              <p>{item.job} – {item.location_type} ({item.location})</p>
              <p><strong>Période:</strong> {item.startDate} → {item.endDate}</p>
              <p>{item.summary || <i>Pas de résumé</i>}</p>
              <div><strong>Poste actuel:</strong> {item.active ? '✅' : '❌'}</div>

              {/* 📌 Affichage des compétences */}
              <div>
                <strong>Compétences :</strong>
                {workSkills[item.id]?.length
                  ? workSkills[item.id].map((s) => s.name).join(', ')
                  : <i>Aucune</i>}
              </div>

              <div className={styles.buttons}>
                <button onClick={() => setEditingId(item.id)}>✏️ Modifier</button>
                <button onClick={() => handleDelete(item.id)}>🗑️ Supprimer</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
