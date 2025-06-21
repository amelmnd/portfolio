'use client'
import Link from 'next/link'
import styles from './SocialIcons.module.css'
import { Icon } from '@iconify/react'
import CodingameIcon from '../../assets/codingameIcon.png';
import Image from 'next/image';

export default function SocialIcons({ width = 32, height = 32 }) {
	const socialLinks = [

		{
			title: 'Email',
			icon: 'wpf:message',
			href: 'mailto:amelmnd.dev@gmail.com',
			isCustom: false,

		},
		{
			title: 'LinkedIn',
			icon: 'simple-icons:linkedin',
			href: 'https://www.linkedin.com/in/amel-mennad/',
			isCustom: false,

		},
		{
			title: 'GitHub',
			icon: 'simple-icons:github',
			href: 'https://github.com/amelmnd',
		},
		{
			title: 'CodePen',
			icon: 'simple-icons:codepen',
			href: 'https://codepen.io/amel_dev',
			isCustom: false,

		},
		{
			title: 'Freecodecamp',
			icon: 'cib:freecodecamp',
			href: 'https://www.freecodecamp.org/amel_dev',
			isCustom: false,

		},
		{
			title: 'Codingame',
			icon: CodingameIcon,
			href: 'https://www.codingame.com/profile/3eb108f7afc5d60d15c961e2bef3ed4c7207735',
			isCustom: true,
		},
		{
			title: 'Hackerrank',
			icon: 'cib:hackerrank',
			href: 'https://www.hackerrank.com/profile/amel_dev',
			isCustom: false,

		},
	]
	return (
		<div className={styles.iconsContainer}>
			{socialLinks.map(({ title, icon, href, isCustom  }) => (
				<Link
					key={title}
					href={href}
					target="_blank"
					rel="nofollow noreferrer noopener"
					className={`${styles.iconLink} ${styles[title]}`}

				>
					{isCustom ? (
						<Image src={CodingameIcon} alt="Codingame" width={32} height={32} />
					) : (
						<Icon icon={icon} width={width} height={height} className={styles.skillIcon} />
					)}
				</Link>
			))}
		</div>
	)
}
