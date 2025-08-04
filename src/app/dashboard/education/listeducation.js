'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from '../projects/ProjectsList.module.css';

export default function EducationList() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('startDate', { ascending: false });
    if (error) {
      alert('Erreur : ' + error.message);
      setLoading(false);
      return;
    }
    setItems(data || []);
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

  const handleSave = async (item) => {
    setSaving(true);
    const { error } = await supabase
      .from('education')
      .update(item)
      .eq('id', item.id);
    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      setEditingId(null);
      fetchItems();
    }
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
