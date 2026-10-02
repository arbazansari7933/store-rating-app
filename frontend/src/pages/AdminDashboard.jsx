import { useEffect, useState } from 'react';
import {
  createStore,
  createUser,
  getStats,
  getStores,
  getUsers,
  getUserDetails,
} from '../api/admin.api';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Field from '../components/Field';
import Modal from '../components/Modal';
import SortControls from '../components/SortControls';
import Table from '../components/Table';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import LoadingState from '../components/LoadingState';
import Badge from '../components/Badge';
import { getErrorMessage } from '../utils/error';
import { validateUserForm } from '../utils/validation';

const emptyUser = {
  name: '',
  email: '',
  address: '',
  password: '',
  role: 'USER',
};

const emptyStore = {
  name: '',
  email: '',
  address: '',
  ownerId: '',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_stores: 0,
    total_ratings: 0,
  });

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [userQuery, setUserQuery] = useState('');
  const [storeQuery, setStoreQuery] = useState('');
  const [userRole, setUserRole] = useState('');

  const [sortUsers, setSortUsers] = useState({
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [sortStores, setSortStores] = useState({
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [userForm, setUserForm] = useState(emptyUser);
  const [storeForm, setStoreForm] = useState(emptyStore);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const [statsResponse, usersResponse, storesResponse] =
        await Promise.all([
          getStats(),
          getUsers({
            search: userQuery,
            role: userRole,
            ...sortUsers,
            limit: 100,
          }),
          getStores({
            search: storeQuery,
            ...sortStores,
            limit: 100,
          }),
        ]);

      setStats(statsResponse.data.data);
      setUsers(usersResponse.data.data.rows);
      setStores(storesResponse.data.data.rows);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(load, 180);

    return () => clearTimeout(timer);
  }, [userQuery, userRole, storeQuery, sortUsers, sortStores]);

  async function submitUser(event) {
    event.preventDefault();

    const validation = validateUserForm(userForm, true);

    if (validation) {
      setError(validation);
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createUser(userForm);
      setModal(null);
      setUserForm(emptyUser);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function submitStore(event) {
    event.preventDefault();

    if (storeForm.name.trim().length < 20) {
      setError('Store name must be at least 20 characters.');
      return;
    }

    if (!storeForm.address.trim()) {
      setError('Store address is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createStore(storeForm);
      setModal(null);
      setStoreForm(emptyStore);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const owners = users.filter((user) => user.role === 'OWNER');

  async function openUserDetails(user) {
    setError('');
    setSelectedUser(null);
    setModal('user-details');

    try {
      const response = await getUserDetails(user.id);
      setSelectedUser(response.data.data);
    } catch (err) {
      setModal(null);
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="dashboard">
      <PageHeader
        eyebrow="Administration"
        title="Platform overview."
        description="Keep users, stores and rating activity organized from one workspace."
        actions={
          <>
            <Button
              variant="secondary"
              icon="users"
              onClick={() => {
                setError('');
                setModal('user');
              }}
            >
              Add user
            </Button>

            <Button
              icon="plus"
              onClick={() => {
                setError('');
                setModal('store');
              }}
            >
              Add store
            </Button>
          </>
        }
      />

      <Alert message={error} />

      <div className="stat-grid-v2">
        <StatCard
          icon="users"
          label="Total users"
          value={stats.total_users}
          hint="All registered accounts"
        />

        <StatCard
          icon="store"
          label="Total stores"
          value={stats.total_stores}
          hint="Registered locations"
        />

        <StatCard
          icon="star"
          label="Total ratings"
          value={stats.total_ratings}
          hint="Submitted by users"
        />
      </div>

      {loading ? (
        <LoadingState label="Refreshing platform data" />
      ) : (
        <>
          <section className="section-block">
            <div className="section-title">
              <div>
                <h2>Stores</h2>
                <p>Search and sort every registered store.</p>
              </div>

              <div className="filter-row">
                <div className="search-wrap compact-search">
                  <span>⌕</span>

                  <input
                    value={storeQuery}
                    onChange={(event) => setStoreQuery(event.target.value)}
                    placeholder="Search stores"
                  />
                </div>

                <SortControls
                  fields={[
                    { value: 'name', label: 'Name' },
                    { value: 'email', label: 'Email' },
                    { value: 'address', label: 'Address' },
                    { value: 'overall_rating', label: 'Rating' },
                  ]}
                  value={sortStores}
                  onChange={setSortStores}
                />
              </div>
            </div>

            <div className="content-card-v2">
              <Table
                columns={[
                  {
                    key: 'name',
                    label: 'Store',
                    render: (row) => (
                      <div className="table-primary">
                        <strong>{row.name}</strong>
                        <span>{row.email}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'address',
                    label: 'Address',
                  },
                  {
                    key: 'overall_rating',
                    label: 'Rating',
                    render: (row) => (
                      <span className="table-rating">
                        <span>{Number(row.overall_rating).toFixed(1)}</span>/5
                      </span>
                    ),
                  },
                ]}
                rows={stores}
                empty="No stores match the current filters."
              />
            </div>
          </section>

          <section className="section-block">
            <div className="section-title">
              <div>
                <h2>Users</h2>
                <p>Accounts across all platform roles.</p>
              </div>

              <div className="filter-row">
                <div className="search-wrap compact-search">
                  <span>⌕</span>

                  <input
                    value={userQuery}
                    onChange={(event) => setUserQuery(event.target.value)}
                    placeholder="Search users"
                  />
                </div>

                <select
                  className="filter-select"
                  value={userRole}
                  onChange={(event) => setUserRole(event.target.value)}
                >
                  <option value="">All roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">Normal User</option>
                  <option value="OWNER">Store Owner</option>
                </select>

                <SortControls
                  fields={[
                    { value: 'name', label: 'Name' },
                    { value: 'email', label: 'Email' },
                    { value: 'address', label: 'Address' },
                    { value: 'role', label: 'Role' },
                    { value: 'owner_rating', label: 'Owner rating' },
                  ]}
                  value={sortUsers}
                  onChange={setSortUsers}
                />
              </div>
            </div>

            <div className="content-card-v2">
              <Table
                columns={[
                  {
                    key: 'name',
                    label: 'User',
                    render: (row) => (
                      <div className="table-primary">
                        <strong>{row.name}</strong>
                        <span>{row.email}</span>
                      </div>
                    ),
                  },
                  {
                    key: 'address',
                    label: 'Address',
                  },
                  {
                    key: 'role',
                    label: 'Role',
                    render: (row) => (
                      <Badge
                        tone={
                          row.role === 'ADMIN'
                            ? 'dark'
                            : row.role === 'OWNER'
                              ? 'blue'
                              : 'neutral'
                        }
                      >
                        {row.role === 'USER'
                          ? 'Normal User'
                          : row.role === 'OWNER'
                            ? 'Store Owner'
                            : 'Administrator'}
                      </Badge>
                    ),
                  },
                  {
                    key: 'owner_rating',
                    label: 'Owner rating',
                    render: (row) =>
                      row.role === 'OWNER' ? (
                        <span className="table-rating">
                          <span>{Number(row.owner_rating).toFixed(1)}</span>/5
                        </span>
                      ) : (
                        '—'
                      ),
                  },
                ]}
                rows={users}
                empty="No users match the current filters."
                onRowClick={openUserDetails}
              />
            </div>
          </section>
        </>
      )}

      {modal === 'user-details' && selectedUser && (
        <Modal
          title="User details"
          description="Account information and store-owner rating."
          onClose={() => {
            setModal(null);
            setSelectedUser(null);
          }}
        >
          <div className="detail-list">
            <div>
              <span>Name</span>
              <strong>{selectedUser.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{selectedUser.email}</strong>
            </div>

            <div>
              <span>Address</span>
              <strong>{selectedUser.address || '—'}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>
                {selectedUser.role === 'USER'
                  ? 'Normal User'
                  : selectedUser.role === 'OWNER'
                    ? 'Store Owner'
                    : 'Administrator'}
              </strong>
            </div>

            {selectedUser.role === 'OWNER' && (
              <div>
                <span>Store rating</span>
                <strong>
                  {Number(selectedUser.owner_rating || 0).toFixed(1)}/5
                </strong>
              </div>
            )}
          </div>
        </Modal>
      )}

      {modal === 'user' && (
        <Modal
          title="Add platform user"
          description="Create an administrator, normal user or store owner account."
          onClose={() => setModal(null)}
        >
          <form className="form" onSubmit={submitUser}>
            <Field
              label="Full name"
              value={userForm.name}
              onChange={(event) =>
                setUserForm({
                  ...userForm,
                  name: event.target.value,
                })
              }
              required
            />

            <Field
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(event) =>
                setUserForm({
                  ...userForm,
                  email: event.target.value,
                })
              }
              required
            />

            <Field
              label="Address"
              value={userForm.address}
              onChange={(event) =>
                setUserForm({
                  ...userForm,
                  address: event.target.value,
                })
              }
            />

            <Field
              label="Temporary password"
              type="password"
              value={userForm.password}
              onChange={(event) =>
                setUserForm({
                  ...userForm,
                  password: event.target.value,
                })
              }
              required
            />

            <label className="field">
              <span>Role</span>

              <select
                value={userForm.role}
                onChange={(event) =>
                  setUserForm({
                    ...userForm,
                    role: event.target.value,
                  })
                }
              >
                <option value="USER">Normal User</option>
                <option value="OWNER">Store Owner</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </label>

            <Button loading={saving} className="full-button">
              Create user
            </Button>
          </form>
        </Modal>
      )}

      {modal === 'store' && (
        <Modal
          title="Add store"
          description="Register a store and optionally assign its owner."
          onClose={() => setModal(null)}
        >
          <form className="form" onSubmit={submitStore}>
            <Field
              label="Store name"
              value={storeForm.name}
              onChange={(event) =>
                setStoreForm({
                  ...storeForm,
                  name: event.target.value,
                })
              }
              required
            />

            <Field
              label="Store email"
              type="email"
              value={storeForm.email}
              onChange={(event) =>
                setStoreForm({
                  ...storeForm,
                  email: event.target.value,
                })
              }
              required
            />

            <Field
              label="Address"
              value={storeForm.address}
              onChange={(event) =>
                setStoreForm({
                  ...storeForm,
                  address: event.target.value,
                })
              }
              required
            />

            <label className="field">
              <span>Store owner</span>

              <select
                value={storeForm.ownerId}
                onChange={(event) =>
                  setStoreForm({
                    ...storeForm,
                    ownerId: event.target.value,
                  })
                }
              >
                <option value="">No owner assigned</option>

                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </label>

            <Button loading={saving} className="full-button">
              Create store
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}