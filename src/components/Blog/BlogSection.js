'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './BlogSection.module.css';

export default function BlogSection() {
	const [articles, setArticles] = useState([]);
	const [totalArticles, setTotalArticles] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const DEVTO_USERNAME = 'amel_in_tech';
	const DEVTO_PROFILE_URL = 'https://dev.to/amel_in_tech';

	useEffect(() => {
		const fetchArticles = async () => {
			setLoading(true);
			setError('');

			try {
				const response = await fetch(
					`https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=1000`,
					{
						headers: {
							'Content-Type': 'application/json',
						},
						cache: 'no-store',
					}
				);

				if (!response.ok) {
					throw new Error('Impossible de charger les articles.');
				}

				const data = await response.json();
				const allArticles = Array.isArray(data) ? data : [];

				setTotalArticles(allArticles.length);
				setArticles(allArticles.slice(0, 3));
			} catch (err) {
				setError(err.message || 'Une erreur est survenue.');
			} finally {
				setLoading(false);
			}
		};

		fetchArticles();
	}, []);

	const formatDate = (date) => {
		if (!date) return '';
		return new Date(date).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<section className={styles.blog} id="blog">
			<div className={styles.text}>
				<h2 className={styles.title}>Mes derniers articles</h2>
				<p className={styles.subtitle}>
					J’aime comprendre comment les choses fonctionnent et déconstruire la
					complexité. À travers mes articles, je simplifie des concepts parfois
					complexes pour rendre la tech plus accessible, pour moi comme pour les
					autres.
				</p>

				{!loading && !error && (
					<p className={styles.subtitle}>
						À ce jour, j&apos;ai écrit {totalArticles} article
						{totalArticles > 1 ? 's' : ''}.
					</p>
				)}
			</div>

			{loading ? (
				<p className={styles.state}>Chargement des articles...</p>
			) : error ? (
				<p className={styles.state}>{error}</p>
			) : articles.length === 0 ? (
				<p className={styles.state}>Aucun article trouvé.</p>
			) : (
				<>
					<div className={styles.grid}>
						{articles.map((article) => {
							const image = article.cover_image || article.social_image;
							const tags = Array.isArray(article.tag_list)
								? article.tag_list.slice(0, 3)
								: [];

							return (
								<article key={article.id} className={styles.card}>
									<Link
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.imageLink}
									>
										<div className={styles.imageContainer}>
											{image ? (
												<img
													src={image}
													alt={article.title}
													className={styles.image}
												/>
											) : (
												<div className={styles.imageFallback}>
													<span>Article DEV.to</span>
												</div>
											)}
										</div>
									</Link>

									<div className={styles.content}>
										<Link
											href={article.url}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.cardTitleLink}
										>
											<h3 className={styles.cardTitle}>{article.title}</h3>
										</Link>

										<p className={styles.description}>
											{article.description || 'Découvrir cet article sur DEV.to.'}
										</p>

										<div className={styles.meta}>
											<span>{formatDate(article.published_at)}</span>
											<span>{article.reading_time_minutes} min de lecture</span>
										</div>

										{tags.length > 0 && (
											<div className={styles.tags}>
												{tags.map((tag) => (
													<span key={tag} className={styles.tag}>
														#{tag}
													</span>
												))}
											</div>
										)}

										<div className={styles.actions}>
											<Link
												href={article.url}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.button}
											>
												Lire l&apos;article
											</Link>
										</div>
									</div>
								</article>
							);
						})}
					</div>

					<div className={styles.moreWrapper}>
						<Link
							href={DEVTO_PROFILE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className={styles.moreButton}
						>
							Voir plus
						</Link>
					</div>
				</>
			)}
		</section>
	);
}