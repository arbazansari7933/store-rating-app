import { useEffect, useState } from 'react';
import { getStores, rateStore } from '../api/store.api';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import PageHeader from '../components/PageHeader';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import { getErrorMessage } from '../utils/error';
export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  async function load() {
    setLoading(true);
    try {
      const { data } = await getStores({ search, limit: 100, sortBy: 'name', sortOrder: 'asc' });
      setStores(data.data.rows);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search]);
  async function submit() {
    if (!rating) return setError('Choose a rating from 1 to 5.');
    setSaving(true);
    setError('');
    try {
      await rateStore(selected.id, rating);
      setSelected(null);
      setRating(0);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Stores"
        title="Find a store worth rating."
        description="Explore registered stores and share a rating based on your experience."
      />
      <div className="toolbar-card">
        <div className="search-wrap">
          <Icon name="search" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by store name or address"
          />
        </div>
        <span className="result-count">{stores.length} stores</span>
      </div>
      <Alert message={error} />
      {loading ? (
        <LoadingState label="Loading stores" />
      ) : stores.length ? (
        <div className="store-grid-v2">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRate={() => {
                setSelected(store);
                setRating(store.user_rating || 0);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="store"
          title="No stores found"
          description="Try a different store name or address."
        />
      )}
      {selected && (
        <Modal
          title={selected.user_rating ? 'Update your rating' : 'Rate this store'}
          description={selected.name}
          onClose={() => setSelected(null)}
        >
          <div className="rating-modal-v2">
            <div className="rating-choice">
              <RatingStars value={rating} interactive onChange={setRating} size="lg" />
              <strong>{rating ? `${rating} out of 5` : 'Select a rating'}</strong>
            </div>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button onClick={submit} loading={saving}>
                {selected.user_rating ? 'Update rating' : 'Submit rating'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
function StoreCard({ store, onRate }) {
  return (
    <article className="store-card-v2">
      <div className="store-top">
        <div className="store-icon">
          <Icon name="store" size={19} />
        </div>
        <div className="store-heading">
          <h3>{store.name}</h3>
          <p>{store.address}</p>
        </div>
      </div>
      <div className="rating-summary">
        <div>
          <div className="rating-number">{Number(store.overall_rating).toFixed(1)}</div>
          <RatingStars value={Number(store.overall_rating)} />
        </div>
        <span>
          {store.rating_count} {store.rating_count === 1 ? 'rating' : 'ratings'}
        </span>
      </div>
      <div className="store-divider" />
      <div className="store-footer">
        <span>
          {store.user_rating ? (
            <>
              <small>Your rating</small>
              <strong>{store.user_rating}/5</strong>
            </>
          ) : (
            <small>You haven't rated this store yet</small>
          )}
        </span>
        <Button variant={store.user_rating ? 'secondary' : 'primary'} onClick={onRate}>
          {store.user_rating ? 'Update rating' : 'Rate store'}
          <Icon name="arrow" size={15} />
        </Button>
      </div>
    </article>
  );
}
