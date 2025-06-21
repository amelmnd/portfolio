'use client'

import { useState } from 'react'
import SocialIcons from '../SocialIcons/SocialIcons'

import styles from './Contact.module.css'
import Link from 'next/link'

export default function Contact() {
	const [email, setEmail] = useState('')

	return (
		<section id="contact" className={styles.contact}>
			<h2>Contact</h2>
			<p>Discutons et echangeons de nos passions et construisons ensemble quelque chose de génial !
			</p>

			<SocialIcons width={25} height={25} />
		</section>
	)
}
