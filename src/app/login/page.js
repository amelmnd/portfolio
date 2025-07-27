'use client'

import { useAuth } from '../../components/AdminDasboard/AuthProvider'

export default function Login() {
	const { signInWithOAuth } = useAuth()

	return (
		<div style={{ padding: 20, textAlign: 'center' }}>
			<h1>Connexion</h1>
			<button onClick={() => signInWithOAuth('github')} style={{ margin: 10 }}>
				Se connecter avec GitHub
			</button>
		</div>
	)
}
