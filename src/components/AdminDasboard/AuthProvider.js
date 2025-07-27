'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
		})

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => {
			listener.subscription.unsubscribe()
		}
	}, [])

	const signInWithOAuth = async (provider) => {
		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: window.location.origin + '/dashboard', // redirige vers /dashboard après login
			},
		})
	}

	const signOut = async () => {
		await supabase.auth.signOut()
		setUser(null)
	}

	return (
		<AuthContext.Provider value={{ user, signInWithOAuth, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
