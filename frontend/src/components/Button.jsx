import Icon from './Icon';
export default function Button({
  children,
  loading,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) {
  return (
    <button
      className={`button button-${variant} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="button-spinner" />
          Please wait
        </>
      ) : (
        <>
          {icon && <Icon name={icon} size={16} />} {children}
        </>
      )}
    </button>
  );
}
