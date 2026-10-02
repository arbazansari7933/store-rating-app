import { useState } from 'react';
import { changePassword } from '../api/auth.api';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Field from '../components/Field';
import { getErrorMessage } from '../utils/error';
import { passwordPattern } from '../utils/validation';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!passwordPattern.test(form.newPassword))
      return setError(
        'New password must be 8-16 characters with one uppercase letter and one special character.'
      );
    setLoading(true);
    try {
      await changePassword(form);
      setMessage('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="content-card narrow">
      <div className="section-head">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Change password</h1>
        </div>
      </div>
      <form onSubmit={submit} className="form">
        <Alert message={error} />
        <Alert message={message} type="success" />
        <Field
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          required
        />
        <Field
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
        />
        <Button loading={loading}>Update password</Button>
      </form>
    </section>
  );
}
