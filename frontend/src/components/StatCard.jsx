import Icon from './Icon';
export default function StatCard({ label, value, hint, icon }) {
  return (
    <article className="stat-card-v2">
      <div className="stat-icon">
        <Icon name={icon} size={19} />
      </div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
    </article>
  );
}
