'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ContentManager({ tableName, fields }) {
	const [items, setItems] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const fetchItems = async () => {
		setIsLoading(true)
		const { data, error } = await supabase.from(tableName).select('*')
		if (!error) setItems(data)
		setIsLoading(false)
	}

	const handleUpdate = async (id, updatedItem) => {
		const { error } = await supabase.from(tableName).update(updatedItem).eq('id', id)
		if (!error) fetchItems()
	}

	const handleDelete = async (id) => {
		const { error } = await supabase.from(tableName).delete().eq('id', id)
		if (!error) fetchItems()
	}

	useEffect(() => {
		fetchItems()
	}, [tableName])

	const handleChange = (id, field, value) => {
		setItems(items.map(item =>
			item.id === id ? { ...item, [field]: value } : item
		))
	}

	if (isLoading) return <p>Chargement...</p>

	return (
		<div style={{ marginBottom: '40px' }}>
			<h2>{tableName.toUpperCase()}</h2>
		</div>
	)
}
