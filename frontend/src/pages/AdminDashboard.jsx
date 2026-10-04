import { useEffect, useState } from 'react';
import {
  createStore,
  createUser,
  getStats,
  getStores,
  getUserDetails,
  getUsers,
} from '../api/admin.api';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Field from '../components/Field';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SortControls from '../components/SortControls';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import { getErrorMessage } from '../utils/error';
import { validateUserForm } from '../utils/validation';

const emptyUser = { name: '', email: '', address: '', password: '', role: 'USER' };
const emptyStore = { name: '', email: '', address: '', ownerId: '' };
const emptyUserFilters = { name: '', email: '', address: '', role: '' };
const emptyStoreFilters = { name: '', email: '', address: '' };

const roleLabel = { USER: 'Normal User', OWNER: 'Store Owner', ADMIN: 'Administrator' };
const roleTone = { ADMIN: 'dark', OWNER: 'blue', USER: 'neutral' };

function FilterInput({ value, onChange, placeholder }) {
  return (
    <div className="search-wrap compact-search">
      <span>⌕</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [userFilters, setUserFilters] = useState(emptyUserFilters);
  const [storeFilters, setStoreFilters] = useState(emptyStoreFilters);
  const [sortUsers, setSortUsers] = useState({ sortBy: 'created_at', sortOrder: 'desc' });
  const [sortStores, setSortStores] = useState({ sortBy: 'name', sortOrder: 'asc' });
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [storeForm, setStoreForm] = useState(emptyStore);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadOwners() {
    try {
      const response = await getUsers({
        role: 'OWNER',
        sortBy: 'name',
        sortOrder: 'asc',
        limit: 100,
      });
      setOwners(response.data.data.rows);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function load() {
    try {
      const [s, u, st] = await Promise.all([
        getStats(),
        getUsers({ ...userFilters, ...sortUsers, limit: 100 }),
        getStores({ ...storeFilters, ...sortStores, limit: 100 }),
      ]);
      setStats(s.data.data);
      setUsers(u.data.data.rows);
      setStores(st.data.data.rows);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOwners();
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [userFilters, storeFilters, sortUsers, sortStores]);

  async function submitUser(e) {
    e.preventDefault();
    const validation = validateUserForm(userForm, true);
    if (validation) return setError(validation);

    setSaving(true);
    setError('');
    try {
      await createUser(userForm);
      setModal(null);
      setUserForm(emptyUser);
      await Promise.all([load(), loadOwners()]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function submitStore(e) {
    e.preventDefault();
    const name = storeForm.name.trim();
    if (name.length < 2 || name.length > 120) {
      return setError('Store name must be between 2 and 120 characters.');
    }
    if (!storeForm.address.trim()) return setError('Store address is required.');
    if (storeForm.address.length > 400) return setError('Address cannot exceed 400 characters.');

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

  const updateUserFilter = (key) => (value) => setUserFilters((f) => ({ ...f, [key]: value }));
  const updateStoreFilter = (key) => (value) => setStoreFilters((f) => ({ ...f, [key]: value }));

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
        <StatCard icon="users" label="Total users" value={stats.total_users} hint="All registered accounts" />
        <StatCard icon="store" label="Total stores" value={stats.total_stores} hint="Registered locations" />
        <StatCard icon="star" label="Total ratings" value={stats.total_ratings} hint="Submitted by users" />
      </div>

      {loading ? (
        <LoadingState label="Refreshing platform data" />
      ) : (
        <>
          <section className="section-block">
            <div className="section-title">
              <div>
                <h2>Stores</h2>
                <p>Filter by name, email or address, and sort any column.</p>
              </div>
              <div className="filter-row">
                <FilterInput value={storeFilters.name} onChange={updateStoreFilter('name')} placeholder="Filter by name" />
                <FilterInput value={storeFilters.email} onChange={updateStoreFilter('email')} placeholder="Filter by email" />
                <FilterInput value={storeFilters.address} onChange={updateStoreFilter('address')} placeholder="Filter by address" />
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
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'address', label: 'Address' },
                  {
                    key: 'overall_rating',
                    label: 'Rating',
                    render: (r) => (
                      <span className="table-rating">
                        <span>{Number(r.overall_rating).toFixed(1)}</span>/5
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
                <p>Filter by name, email, address or role, and sort any column.</p>
              </div>
              <div className="filter-row">
                <FilterInput value={userFilters.name} onChange={updateUserFilter('name')} placeholder="Filter by name" />
                <FilterInput value={userFilters.email} onChange={updateUserFilter('email')} placeholder="Filter by email" />
                <FilterInput value={userFilters.address} onChange={updateUserFilter('address')} placeholder="Filter by address" />
                <select
                  className="filter-select"
                  value={userFilters.role}
                  onChange={(e) => updateUserFilter('role')(e.target.value)}
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
                  ]}
                  value={sortUsers}
                  onChange={setSortUsers}
                />
              </div>
            </div>
            <div className="content-card-v2">
              <Table
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'address', label: 'Address' },
                  {
                    key: 'role',
                    label: 'Role',
                    render: (r) => <Badge tone={roleTone[r.role]}>{roleLabel[r.role]}</Badge>,
                  },
                  {
                    key: 'owner_rating',
                    label: 'Owner rating',
                    render: (r) =>
                      r.role === 'OWNER' ? (
                        <span className="table-rating">
                          <span>{Number(r.owner_rating).toFixed(1)}</span>/5
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
              <strong>{roleLabel[selectedUser.role]}</strong>
            </div>
            {selectedUser.role === 'OWNER' && (
              <div>
                <span>Store rating</span>
                <strong>{Number(selectedUser.owner_rating || 0).toFixed(1)}/5</strong>
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
            <Alert message={error} />
            <Field
              label="Full name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
            <Field
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              required
            />
            <Field
              label="Address"
              value={userForm.address}
              onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
            />
            <Field
              label="Temporary password"
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              required
            />
            <label className="field">
              <span>Role</span>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
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
            <Alert message={error} />
            <Field
              label="Store name"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              required
            />
            <Field
              label="Store email"
              type="email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              required
            />
            <Field
              label="Address"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              required
            />
            <label className="field">
              <span>Store owner</span>
              <select
                value={storeForm.ownerId}
                onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}
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