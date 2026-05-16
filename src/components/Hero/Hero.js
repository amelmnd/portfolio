'use client'
import React from 'react'
import styles from './Hero.module.css'
import SocialIcons from '../SocialIcons/SocialIcons'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import portrait from '../../assets/portrait.png'
import Image from 'next/image'

export default function Hero({ width = 12, height = 22 }) {
	return (
		<section className={styles.hero} id="hero">
			<div className={styles.heroContainer}>
				<div className={styles.heroContainer}>
					<div className={styles.textContent}>
						<div className={styles.heroTitle}>
							<h1 className={styles.title}>
								Futur ingénieur logiciel
							</h1><div className={styles.iconsContainer}>
								<Link href="https://www.google.com/maps/place/Nice/@43.7032499,7.2115268,13z/data=!3m1!4b1!4m6!3m5!1s0x12cdd0106a852d31:0x40819a5fd979a70!8m2!3d43.7101728!4d7.2619532!16zL20vMGNwNnc?entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank"
									rel="nofollow noreferrer noopener" className={styles.link}>
									<Icon icon={"map:map-pin"} width={width} height={height} className={styles.icon} />
									Nice, France
								</Link>
							</div>
						</div>
						<div className={styles.heroSoftSkill}>
							<span className={styles.pill}>Formation continue</span>
							<span className={styles.pill}>Curieuse</span>
							<span className={styles.pill}>Persévérante</span>
						</div>
						<p className={styles.heroDescript}>
							Salut ! Moi, c&apos;est Amel, étudiante à 42 Nice et développeuse web en pleine montée en compétences. J&apos;explore le monde de la tech, je me forme, je teste, j&apos;expérimente pour trouver mon « chez-moi » numérique et le prochain défi qui me fera vibrer autant que progresser.

						</p>
						<SocialIcons width={25} height={25} /></div>
					<Image
						className={styles.heroImg}
						src={portrait}
						alt="Portrait"
						width="304"
						height="304"
						priority
					/>
				</div>
			</div>
		</section>
	)
}
