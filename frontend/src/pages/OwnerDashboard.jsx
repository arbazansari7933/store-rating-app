import { useEffect, useState } from 'react';
import { getOwnerDashboard } from '../api/store.api';
import Alert from '../components/Alert';
import RatingStars from '../components/RatingStars';
import Table from '../components/Table';
import SortControls from '../components/SortControls';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { getErrorMessage } from '../utils/error';

export default function OwnerDashboard() {
  const [data, setData] = useState({
    stores: [],
    ratings: [],
  });

  const [sort, setSort] = useState({
    sortBy: 'updated_at',
    sortOrder: 'desc',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const response = await getOwnerDashboard(sort);

        if (active) {
          setData(response.data.data);
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [sort]);

  const average = data.stores.length
    ? data.stores.reduce((sum, store) => sum + Number(store.average_rating || 0), 0) /
      data.stores.length
    : 0;

  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Store owner"
        title="Your store performance."
        description="A focused view of ratings and customer activity across your store."
      />

      <Alert message={error} />

      {loading ? (
        <LoadingState label="Loading dashboard" />
      ) : (
        <>
          <div className="stat-grid-v2">
            <StatCard
              icon="store"
              label="Your stores"
              value={data.stores.length}
              hint="Active stores"
            />

            <StatCard
              icon="star"
              label="Average rating"
              value={average.toFixed(1)}
              hint="Across your stores"
            />

            <StatCard
              icon="users"
              label="Customer ratings"
              value={data.ratings.length}
              hint="Submitted ratings"
            />
          </div>

          <section className="section-block">
            <div className="section-title">
              <div>
                <h2>Store performance</h2>
                <p>Average rating and rating volume by store.</p>
              </div>
            </div>

            <div className="owner-store-grid">
              {data.stores.length ? (
                data.stores.map((store) => (
                  <article className="performance-card" key={store.id}>
                    <div className="store-top">
                      <div className="store-icon">
                        <Badge tone="blue">Store</Badge>
                      </div>

                      <div className="store-heading">
                        <h3>{store.name}</h3>
                        <p>{store.address}</p>
                      </div>
                    </div>

                    <div className="performance-value">
                      <strong>{Number(store.average_rating).toFixed(1)}</strong>

                      <RatingStars value={Number(store.average_rating)} size="lg" />
                    </div>

                    <span className="subtle">{store.rating_count} submitted ratings</span>
                  </article>
                ))
              ) : (
                <EmptyState
                  icon="store"
                  title="No stores assigned"
                  description="An administrator can assign a store to your account."
                />
              )}
            </div>
          </section>

          <section className="section-block">
            <div className="section-title">
              <div>
                <h2>Recent rating activity</h2>
                <p>Customers who have rated your store.</p>
              </div>

              <SortControls
                fields={[
                  { value: 'store_name', label: 'Store' },
                  { value: 'user_name', label: 'Customer' },
                  { value: 'email', label: 'Email' },
                  { value: 'rating', label: 'Rating' },
                  { value: 'updated_at', label: 'Updated' },
                ]}
                value={sort}
                onChange={setSort}
              />
            </div>

            <div className="content-card-v2">
              <Table
                columns={[
                  {
                    key: 'store_name',
                    label: 'Store',
                  },
                  {
                    key: 'user_name',
                    label: 'Customer',
                  },
                  {
                    key: 'email',
                    label: 'Email',
                  },
                  {
                    key: 'rating',
                    label: 'Rating',
                    render: (row) => (
                      <span className="table-rating">
                        <span>{row.rating}</span>/5
                      </span>
                    ),
                  },
                  {
                    key: 'updated_at',
                    label: 'Updated',
                    render: (row) => new Date(row.updated_at).toLocaleDateString(),
                  },
                ]}
                rows={data.ratings}
                empty="No ratings have been submitted yet."
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
