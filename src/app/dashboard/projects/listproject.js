'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './ProjectsList.module.css';
import SkillSelector from '../../../components/SkillSelector/SkillSelector';

export default function EditableProjectList() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previews, setPreviews] = useState({});
  const [projectSkills, setProjectSkills] = useState({});

  const fetchProjects = async () => {
    setLoading(true);

    const { data: projectsData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

    if (projectError) {
      alert('Erreur : ' + projectError.message);
      setLoading(false);
      return;
    }

    const { data: links, error: skillsError } = await supabase
      .from('project_skills')
      .select('project_id, skills ( id, name )');

    if (skillsError) {
      alert('Erreur chargement skills : ' + skillsError.message);
      setLoading(false);
      return;
    }

    const skillMap = {};
    links?.forEach((link) => {
      const skill = link.skills;
      if (!skillMap[link.project_id]) skillMap[link.project_id] = [];
      skillMap[link.project_id].push(skill);
    });

    setProjectSkills(skillMap);
    setProjects(projectsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (id, field, value) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSkillChange = (projectId, skills) => {
    setProjectSkills((prev) => ({
      ...prev,
      [projectId]: skills,
    }));
  };

  const handleImageChange = async (id, file) => {
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [id]: previewURL }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();

      if (data.secure_url) {
        handleInputChange(id, 'imglink', data.secure_url);
        setPreviews((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      } else {
        alert("Échec upload image : " + (data.error?.message || JSON.stringify(data)));
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
      alert('Erreur projet : ' + error.message);
      setSaving(false);
      return;
    }

    // 🔄 Mise à jour skills liées
    const currentSkills = projectSkills[project.id] || [];

    // Supprimer tous les liens existants
    await supabase.from('project_skills').delete().eq('project_id', project.id);

    // Réinsérer tous les skills sélectionnés
    for (const skill of currentSkills) {
      await supabase.from('project_skills').insert({
        project_id: project.id,
        skill_id: skill.id,
      });
    }

    setEditingId(null);
    await fetchProjects();
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
                  <img src={previews[project.id]} className={styles.image} alt='Preview' />
                ) : project.imglink ? (
                  <img src={project.imglink} className={styles.image} alt={project.title} />
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
                  value={project.repourl || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'repourl', e.target.value)
                  }
                />
              </label>

              <label>
                Démo URL :
                <input
                  type='text'
                  value={project.demourl || ''}
                  onChange={(e) =>
                    handleInputChange(project.id, 'demourl', e.target.value)
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

              <label>
                Compétences :
                <SkillSelector
                  selected={projectSkills[project.id] || []}
                  onChange={(skills) => handleSkillChange(project.id, skills)}
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
              {project.imglink && (
                <img src={project.imglink} className={styles.image} alt={project.title} />
              )}
              <div>
                <strong>Favori :</strong> {project.fav ? '⭐ Oui' : 'Non'}
              </div>
              <div className={styles.links}>
                {project.repourl && (
                  <a href={project.repourl} target='_blank' rel='noreferrer'>
                    Code
                  </a>
                )}
                {project.demourl && (
                  <a href={project.demourl} target='_blank' rel='noreferrer'>
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
              <div>
                <strong>Skills :</strong>{' '}
                {(projectSkills[project.id] || [])
                  .map((s) => s.name)
                  .join(', ') || <i>Aucune</i>}
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
