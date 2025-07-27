'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from '../Dashboard.module.css';
import { useRouter } from 'next/navigation';

export default function EducationDashboard() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState('');
	const [educations, setEducations] = useState([]);
	const [loading, setLoading] = useState(true);

	const [formData, setFormData] = useState({
		institution: '',
		certificationUrl: '',
		area: '',
		studytype: '',
		startDate: '',
		endDate: '',
		summary: '',
		skills: '',
		active: false,
		location: '',
	});
	const [editId, setEditId] = useState(null);

	useEffect(() => {
		fetchEducations();
	}, []);

	const fetchEducations = async () => {
		const { data, error } = await supabase.from('education').select('*');
		if (error) console.error('Erreur:', error);
		else setEducations(data);
		setLoading(false);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	function isValidUrl(url) {
		if (!url) return true;
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isValidUrl(formData.certificationUrl)) {
			setErrorMessage('URL de certification invalide');
			return;
		}

		setErrorMessage('');

		const payload = { ...formData };
		if (payload.skills) {
			payload.skills = payload.skills.split(',').map((s) => s.trim()).filter(Boolean);
		}

		let result;
		if (editId) {
			result = await supabase.from('education').update(payload).eq('id', editId);
		} else {
			result = await supabase.from('education').insert([payload]);
		}

		if (result.error) {
			alert('Erreur lors de la sauvegarde : ' + result.error.message);
		} else {
			resetForm();
			fetchEducations();
		}
	};

	const handleDelete = async (id) => {
		const { error } = await supabase.from('education').delete().eq('id', id);
		if (error) alert('Erreur lors de la suppression');
		else fetchEducations();
	};

	const handleEdit = (item) => {
		setEditId(item.id);
		setFormData({
			...item,
			skills: item.skills ? item.skills.join(', ') : '',
		});
	};

	const resetForm = () => {
		setFormData({
			institution: '',
			certificationUrl: '',
			area: '',
			studytype: '',
			startDate: '',
			endDate: '',
			summary: '',
			skills: '',
			active: false,
			location: '',
		});
		setEditId(null);
		setErrorMessage('');
	};

	return (
		<div className={styles.container}>
			<button
				onClick={() => router.push('/dashboard')}
				style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
			>
				← Retour
			</button>
			<h1 className={styles.title}>Gestion des Formations</h1>

			<form onSubmit={handleSubmit} className={styles.form}>
				<input name="institution" value={formData.institution} onChange={handleChange} placeholder="Établissement" />
				<input name="certificationUrl" value={formData.certificationUrl} onChange={handleChange} placeholder="URL de certification" />
				<input name="area" value={formData.area} onChange={handleChange} placeholder="Spécialisation" />
				<input name="studytype" value={formData.studytype} onChange={handleChange} placeholder="Type d'étude" />
				<input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
				<input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
				<textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Résumé" />
				<input name="skills" value={formData.skills} onChange={handleChange} placeholder="Compétences (séparées par des virgules)" />
				<input name="location" value={formData.location} onChange={handleChange} placeholder="Lieu" />
				<label><input type="checkbox" name="active" checked={formData.active} onChange={handleChange} /> Actif</label>

				{errorMessage && <p className={styles.error}>{errorMessage}</p>}

				<div className={styles.buttons}>
					<button type="submit">{editId ? 'Mettre à jour' : 'Ajouter'}</button>
					{editId && <button type="button" onClick={resetForm} className={styles.cancel}>Annuler</button>}
				</div>
			</form>

			<div className={styles.projectList}>
				{loading ? (
					<p>Chargement...</p>
				) : (
					<div>
						<h2>Liste des formations</h2>
						<ul>
							{educations.map((edu) => (
								<li key={edu.id}>
									<strong>{edu.institution}</strong> - {edu.area} ({edu.startDate} → {edu.endDate})
									<button onClick={() => handleEdit(edu)}>Modifier</button>
									<button onClick={() => handleDelete(edu.id)}>Supprimer</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}