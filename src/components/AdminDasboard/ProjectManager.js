'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ContentManager({ tableName, fields }) {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)

	// Charger les données
	const fetchItems = async () => {
		setLoading(true)
		const { data, error } = await supabase.from(tableName).select('*')
		if (error) {
			console.error('Erreur de chargement :', error.message)
		} else {
			setItems(data)
		}
		setLoading(false)
	}

	// Supprimer une ligne
	const handleDelete = async (id) => {
		const { error } = await supabase.from(tableName).delete().eq('id', id)
		if (error) {
			console.error('Erreur suppression :', error.message)
		} else {
			setItems(items.filter(item => item.id !== id))
		}
	}

	// Mettre à jour une ligne
	const handleUpdate = async (id, updatedData) => {
		const { error } = await supabase.from(tableName).update(updatedData).eq('id', id)
		if (error) {
			console.error('Erreur update :', error.message)
		} else {
			fetchItems()
		}
	}

	useEffect(() => {
		fetchItems()
	}, [tableName])

	const handleFieldChange = (id, field, value) => {
		setItems(prev =>
			prev.map(item =>
				item.id === id ? { ...item, [field]: value } : item
			)
		)
	}

	if (loading) return <p>Chargement...</p>
	if (!items.length) return <p>Aucune donnée trouvée dans "{tableName}".</p>

	return (
		<div style={{ marginBottom: '40px' }}>
			<h2 style={{ textTransform: 'capitalize' }}>{tableName}</h2>

			{items.map(item => (
				<div
					key={item.id}
					style={{
						marginBottom: 20,
						padding: 10,
						border: '1px solid #ddd',
						borderRadius: 8,
					}}
				>
					{fields.map(field => (
						<div key={field} style={{ marginBottom: 10 }}>
							<label style={{ marginRight: 10 }}>{field}:</label>
							<input
								type="text"
								value={item[field] || ''}
								onChange={(e) => handleFieldChange(item.id, field, e.target.value)}
								style={{ width: '300px' }}
							/>
						</div>
					))}
					<button onClick={() => handleUpdate(item.id, item)} style={{ marginRight: 10 }}>
						💾 Enregistrer
					</button>
					<button onClick={() => handleDelete(item.id)}>🗑️ Supprimer</button>
				</div>
			))}
		</div>
	)
}
