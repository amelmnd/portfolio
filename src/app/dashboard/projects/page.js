'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from '../Dashboard.module.css';
import { useRouter } from 'next/navigation';

export default function ProjectsDashboard() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imgLink: '',
    repoURL: '',
    demoURL: '',
    date: '',
    skills: '',
  });
  const [editId, setEditId] = useState(null);

  // Pour gérer le fichier image localement et son preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) console.error('Erreur:', error);
    else setProjects(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  function isValidUrl(url) {
    if (!url) return true; // Champ vide autorisé
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formDataCloud = new FormData();
    formDataCloud.append('file', imageFile);
    formDataCloud.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);


    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataCloud,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Erreur upload Cloudinary:', error);
      alert('Erreur lors de l\'upload de l\'image');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !isValidUrl(formData.repoURL) ||
      !isValidUrl(formData.demoURL)
    ) {
      setErrorMessage('Veuillez saisir des URL valides pour les champs dépôt et démo.');
      return;
    }

    setErrorMessage('');

    let uploadedImageUrl = formData.imgLink;

    // Upload si nouveau fichier sélectionné
    if (imageFile) {
      const url = await uploadImageToCloudinary();
      if (!url) return; // erreur upload => stop
      uploadedImageUrl = url;
    }

    const payload = {};
    for (const key in formData) {
      if (key === 'imgLink') {
        payload[key] = uploadedImageUrl;
      } else if (formData[key]?.trim()) {
        if (key === 'skills') {
          payload[key] = formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          payload[key] = formData[key].trim();
        }
      }
    }

    let result;
    if (editId) {
      result = await supabase.from('projects').update(payload).eq('id', editId);
    } else {
      result = await supabase.from('projects').insert([payload]);
    }

    if (result.error) {
      console.error('Erreur Supabase:', result.error);
      alert('Erreur lors de la sauvegarde : ' + result.error.message);
    } else {
      resetForm();
      fetchProjects();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) alert('Erreur lors de la suppression');
    else fetchProjects();
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      imgLink: project.imgLink || '',
      repoURL: project.repoURL || '',
      demoURL: project.demoURL || '',
      date: project.date || '',
      skills: project.skills ? project.skills.join(', ') : '',
    });
    setImagePreview(project.imgLink || null);
    setImageFile(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imgLink: '',
      repoURL: '',
      demoURL: '',
      date: '',
      skills: '',
    });
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
    setErrorMessage('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestion des projets</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titre du projet"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description détaillée du projet"
        />

        <label htmlFor="imgLink">Image du projet</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div style={{ margin: '1rem 0' }}>
            <p>Aperçu de l'image :</p>
            <img src={imagePreview} alt="Aperçu" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </div>
        )}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <input
          type="text"
          name="repoURL"
          value={formData.repoURL}
          onChange={handleChange}
          placeholder="URL du dépôt GitHub (ex : https://github.com/username/repo)"
        />

        <input
          type="text"
          name="demoURL"
          value={formData.demoURL}
          onChange={handleChange}
          placeholder="URL de la démo en ligne (ex : https://monprojet.demo)"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="Date du projet"
        />

        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Compétences (séparées par des virgules)"
        />

        <div className={styles.buttons}>
          <button type='submit'>
            {editId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editId && <button type='button' onClick={resetForm} className={styles.cancel}>Annuler</button>}
        </div>
      </form>

      <div className={styles.projectList}>
        {loading ? (
          <p>Chargement...</p>
        ) : (
            <div>
              <button
                onClick={() => router.push('/dashboard')}
                style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                ← Retour
              </button>
            <h2>Liste des projets</h2>
            <ul>
              {projects.map((project) => (
                <div key={project.id} style={{ border: '1px solid #ddd', margin: '1rem 0', padding: '1rem' }}>
                  <h3>{project.title || '(sans titre)'}</h3>
                  <p><strong>Description:</strong> {project.description || '(vide)'}</p>
                  {project.imgLink && (
                    <img src={project.imgLink} alt={project.title} style={{ maxWidth: '200px' }} />
                  )}
                  <p><strong>Repo:</strong> <a href={project.repoURL} target="_blank" rel="noreferrer">{project.repoURL}</a></p>
                  <p><strong>Demo:</strong> <a href={project.demoURL} target="_blank" rel="noreferrer">{project.demoURL}</a></p>
                  <p><strong>Date:</strong> {project.date ? new Date(project.date).toLocaleDateString() : '(non renseignée)'}</p>
                  <p><strong>Skills:</strong> {project.skills && project.skills.length > 0 ? project.skills.join(', ') : '(aucune)'}</p>

                  <div style={{ marginTop: '0.5rem' }}>
                    <button onClick={() => handleEdit(project)}>Modifier</button>{' '}
                    <button onClick={() => handleDelete(project.id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
