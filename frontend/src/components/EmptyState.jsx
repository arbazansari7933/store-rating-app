import Icon from './Icon';
export default function EmptyState({
  icon = 'search',
  title = 'Nothing here yet',
  description = '',
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={21} />
      </div>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}
