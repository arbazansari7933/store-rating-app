export default function RatingStars({ value = 0, interactive = false, onChange, size = 'md' }) {
  return (
    <div className={`stars stars-${size}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            className={star <= value ? 'active' : ''}
            onClick={() => onChange(star)}
            aria-label={`${star} stars`}
          >
            {star <= value ? '★' : '☆'}
          </button>
        ) : (
          <span key={star} className={star <= Math.round(value) ? 'active' : ''}>
            ★
          </span>
        )
      )}
    </div>
  );
}
