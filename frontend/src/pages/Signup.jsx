import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Field from '../components/Field';
import { signup } from '../api/auth.api';
import { validateUserForm } from '../utils/validation';
import { getErrorMessage } from '../utils/error';
import { useState } from 'react';

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError('');
    }
  }

  async function submit(event) {
    event.preventDefault();

    const validation = validateUserForm(form);

    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(form);
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout auth-simple">
      <div className="auth-panel">
        <Brand />

        <div className="auth-copy">
          <p className="eyebrow">Create account</p>

          <h1>Join the platform.</h1>

          <p>Create a normal user account to discover stores and share ratings.</p>
        </div>

        <form className="form" onSubmit={submit}>
          <Alert message={error} />

          <Field
            label="Full name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Minimum 20 characters"
            required
          />

          <Field
            label="Email address"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="you@example.com"
            required
          />

          <Field
            label="Address"
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder="Your address"
            required
          />

          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="8–16 chars, uppercase + special"
            required
          />

          <Button loading={loading} className="full-button">
            Create account
          </Button>

          <p className="form-note">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
