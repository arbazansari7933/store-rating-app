import Icon from './Icon';
export default function Alert({ message, type = 'error' }) {
  if (!message) return null;
  return (
    <div className={`alert ${type === 'success' ? 'success' : ''}`}>
      <Icon name={type === 'success' ? 'check' : 'alert'} size={15} />
      <span>{message}</span>
    </div>
  );
}
