'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './ProjectsList.module.css';

export default function EditableProjectList() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previews, setPreviews] = useState({}); // pour les preview images

const fetchProjects = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('date', { ascending: false }); // <-- tri décroissant sur la date
  if (error) {
    alert('Erreur : ' + error.message);
    setLoading(false);
    return;
  }
  setProjects(data || []);
  setLoading(false);
};


  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (id, field, value) => {
    setProjects((projects) =>
      projects.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleImageChange = async (id, file) => {
    if (!file) return;

    // Preview locale immédiate
    const previewURL = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [id]: previewURL }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        handleInputChange(id, 'imgLink', data.secure_url);
        setPreviews((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      } else {
        alert(
          "Échec de l'upload image : " +
            (data.error?.message || JSON.stringify(data))
        );
      }
    } catch (err) {
      alert('Erreur Cloudinary : ' + err.message);
    }
  };

  const handleSave = async (project) => {
    setSaving(true);
    const { error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id);

    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      setEditingId(null);
      fetchProjects(); // recharge la liste
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) alert('Erreur : ' + error.message);
    else fetchProjects();
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <div key={project.id} className={styles.card}>
          {editingId === project.id ? (
            <>
              <label>
                Titre :
                <input
                  type='text'
                  value={project.title || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'title', e.target.value)
                  }
                />
              </label>

              <label>
                Description :
                <textarea
                  value={project.description || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'description', e.target.value)
                  }
                />
              </label>

              <label>
                Image :
                {previews[project.id] ? (
                  <img
                    src={previews[project.id]}
                    className={styles.image}
                    alt='Preview'
                  />
                ) : project.imgLink ? (
                  <img
                    src={project.imgLink}
                    className={styles.image}
                    alt={project.title}
                  />
                ) : (
                  <i>Pas d’image</i>
                )}
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) =>
                    handleImageChange(project.id, e.target.files[0])
                  }
                />
              </label>

              <label>
                Repo URL :
                <input
                  type='text'
                  value={project.repoURL || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'repoURL', e.target.value)
                  }
                />
              </label>

              <label>
                Démo URL :
                <input
                  type='text'
                  value={project.demoURL || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'demoURL', e.target.value)
                  }
                />
              </label>

              <label>
                Date :
                <input
                  type='date'
                  value={project.date || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'date', e.target.value)
                  }
                />
              </label>

              <label>
                Favori :
                <input
                  type='checkbox'
                  checked={project.fav || false}
                  onChange={(e) =>
                    handleInputChange(project.id, 'fav', e.target.checked)
                  }
                />
              </label>

              <div className={styles.buttons}>
                <button onClick={() => handleSave(project)} disabled={saving}>
                  💾 Enregistrer
                </button>
                <button onClick={() => setEditingId(null)}>❌ Annuler</button>
              </div>
            </>
          ) : (
            <>
              <h3>{project.title || <i>(Sans titre)</i>}</h3>
              <p>{project.description || <i>Pas de description</i>}</p>
              {project.imgLink && (
                <img
                  src={project.imgLink}
                  className={styles.image}
                  alt={project.title}
                />
              )}
              <div>
                <strong>Favori :</strong> {project.fav ? '⭐ Oui' : 'Non'}
              </div>
              <div className={styles.links}>
                {project.repoURL && (
                  <a href={project.repoURL} target='_blank' rel='noreferrer'>
                    Code
                  </a>
                )}
                {project.demoURL && (
                  <a href={project.demoURL} target='_blank' rel='noreferrer'>
                    Démo
                  </a>
                )}
              </div>
              <div>
                <strong>Date :</strong>{' '}
                {project.date
                  ? new Date(project.date).toLocaleDateString()
                  : '(non renseignée)'}
              </div>
              <div className={styles.buttons}>
                <button onClick={() => setEditingId(project.id)}>
                  ✏️ Modifier
                </button>
                <button onClick={() => handleDelete(project.id)}>
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
