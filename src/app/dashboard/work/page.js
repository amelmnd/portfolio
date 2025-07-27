'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from '../Dashboard.module.css';
import { useRouter } from 'next/navigation';

export default function WorkDashboard() {
	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState('');
	const [workList, setWorkList] = useState([]);
	const [loading, setLoading] = useState(true);

	const [formData, setFormData] = useState({
		enterpriseName: '',
		job: '',
		location_type: '',
		location: '',
		startDate: '',
		endDate: '',
		summary: '',
		highlights: '',
		mission: '',
		skills: '',
		active: false,
	});
	const [editId, setEditId] = useState(null);

	useEffect(() => {
		fetchWork();
	}, []);

	const fetchWork = async () => {
		const { data, error } = await supabase.from('work').select('*');
		if (error) console.error('Erreur:', error);
		else setWorkList(data);
		setLoading(false);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	// Pour convertir string JSON en tableau ou objet
	const parseJson = (str) => {
		try {
			return JSON.parse(str);
		} catch {
			return [];
		}
	};

	// Pour convertir array ou objet en string JSON
	const toJsonString = (value) => {
		if (typeof value === 'string') return value;
		return JSON.stringify(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			...formData,
			highlights: formData.highlights
				? parseJson(formData.highlights)
				: null,
			mission: formData.mission
				? parseJson(formData.mission)
				: null,
			skills: formData.skills
				? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
				: null,
			startDate: formData.startDate || null,
			endDate: formData.endDate || null,
		};

		let result;
		if (editId) {
			result = await supabase.from('work').update(payload).eq('id', editId);
		} else {
			result = await supabase.from('work').insert([payload]);
		}

		if (result.error) {
			console.error('Erreur Supabase:', result.error);
			alert('Erreur lors de la sauvegarde : ' + result.error.message);
		} else {
			resetForm();
			fetchWork();
		}
	};

	const handleDelete = async (id) => {
		const { error } = await supabase.from('work').delete().eq('id', id);
		if (error) alert('Erreur lors de la suppression');
		else fetchWork();
	};

	const handleEdit = (item) => {
		setEditId(item.id);
		setFormData({
			enterpriseName: item.enterpriseName || '',
			job: item.job || '',
			location_type: item.location_type || '',
			location: item.location || '',
			startDate: item.startDate ? item.startDate.slice(0, 10) : '',
			endDate: item.endDate ? item.endDate.slice(0, 10) : '',
			summary: item.summary || '',
			highlights: item.highlights ? JSON.stringify(item.highlights) : '',
			mission: item.mission ? JSON.stringify(item.mission) : '',
			skills: item.skills ? item.skills.join(', ') : '',
			active: item.active || false,
		});
	};

	const resetForm = () => {
		setFormData({
			enterpriseName: '',
			job: '',
			location_type: '',
			location: '',
			startDate: '',
			endDate: '',
			summary: '',
			highlights: '',
			mission: '',
			skills: '',
			active: false,
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
			<h1 className={styles.title}>Gestion des expériences professionnelles</h1>

			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					type="text"
					name="enterpriseName"
					value={formData.enterpriseName}
					onChange={handleChange}
					placeholder="Nom de l'entreprise"
				/>

				<input
					type="text"
					name="job"
					value={formData.job}
					onChange={handleChange}
					placeholder="Poste occupé"
				/>

				<input
					type="text"
					name="location_type"
					value={formData.location_type}
					onChange={handleChange}
					placeholder="Type de localisation"
				/>

				<input
					type="text"
					name="location"
					value={formData.location}
					onChange={handleChange}
					placeholder="Localisation"
				/>

				<input
					type="date"
					name="startDate"
					value={formData.startDate}
					onChange={handleChange}
					placeholder="Date de début"
				/>

				<input
					type="date"
					name="endDate"
					value={formData.endDate}
					onChange={handleChange}
					placeholder="Date de fin"
				/>

				<textarea
					name="summary"
					value={formData.summary}
					onChange={handleChange}
					placeholder="Résumé"
				/>

				<textarea
					name="highlights"
					value={formData.highlights}
					onChange={handleChange}
					placeholder='Points forts (JSON format)'
					rows={3}
				/>

				<textarea
					name="mission"
					value={formData.mission}
					onChange={handleChange}
					placeholder='Missions (JSON format)'
					rows={3}
				/>

				<input
					type="text"
					name="skills"
					value={formData.skills}
					onChange={handleChange}
					placeholder="Compétences (séparées par des virgules)"
				/>

				<label>
					Actif :
					<input
						type="checkbox"
						name="active"
						checked={formData.active}
						onChange={handleChange}
					/>
				</label>

				{errorMessage && <p className={styles.error}>{errorMessage}</p>}

				<div className={styles.buttons}>
					<button type="submit">{editId ? 'Mettre à jour' : 'Ajouter'}</button>
					{editId && (
						<button type="button" onClick={resetForm} className={styles.cancel}>
							Annuler
						</button>
					)}
				</div>
			</form>

			<div className={styles.list}>
				{loading ? (
					<p>Chargement...</p>
				) : (
					<>
						<h2>Liste des expériences</h2>
						<ul>
							{workList.map((work) => (
								<li key={work.id} style={{ border: '1px solid #ddd', margin: '1rem 0', padding: '1rem' }}>
									<h3>{work.enterpriseName || '(sans entreprise)'}</h3>
									<p><strong>Poste:</strong> {work.job || '(non renseigné)'}</p>
									<p><strong>Type localisation:</strong> {work.location_type || '(non renseigné)'}</p>
									<p><strong>Localisation:</strong> {work.location || '(non renseignée)'}</p>
									<p><strong>Période:</strong> {work.startDate ? new Date(work.startDate).toLocaleDateString() : '(non renseignée)'} - {work.endDate ? new Date(work.endDate).toLocaleDateString() : '(non renseignée)'}</p>
									<p><strong>Résumé:</strong> {work.summary || '(vide)'}</p>
									<p><strong>Points forts:</strong> {work.highlights ? JSON.stringify(work.highlights) : '(aucun)'}</p>
									<p><strong>Missions:</strong> {work.mission ? JSON.stringify(work.mission) : '(aucune)'}</p>
									<p><strong>Compétences:</strong> {work.skills && work.skills.length > 0 ? work.skills.join(', ') : '(aucune)'}</p>
									<p><strong>Actif:</strong> {work.active ? 'Oui' : 'Non'}</p>

									<div style={{ marginTop: '0.5rem' }}>
										<button onClick={() => handleEdit(work)}>Modifier</button>{' '}
										<button onClick={() => handleDelete(work.id)}>Supprimer</button>
									</div>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</div>
	);
}
