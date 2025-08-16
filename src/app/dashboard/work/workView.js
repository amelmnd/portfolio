import styles from './WorkList.module.css';

export default function WorkView({ item, skills, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <h3>{item.enterpriseName || <i>(Sans entreprise)</i>}</h3>
      <p>{item.job} – {item.location_type} ({item.location})</p>
      <p><strong>Période:</strong> {item.startDate} → {item.endDate}</p>
      <p>{item.summary || <i>Pas de résumé</i>}</p>
      <div>
        <strong>Active:</strong> {item.active ? '✅' : '❌'}
      </div>
      <div>
        <strong>Compétences:</strong>
        {skills.length ? skills.map((s) => s.name).join(', ') : <i>Aucune</i>}
      </div>
      <div className={styles.buttons}>
        <button onClick={onEdit}>✏️ Modifier</button>
        <button onClick={onDelete}>🗑️ Supprimer</button>
      </div>
    </div>
  );
}
