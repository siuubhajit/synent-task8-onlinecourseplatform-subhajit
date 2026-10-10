import React, { useState } from 'react';
import { api } from '../services/api';

export const ResetPasswordPage = ({ onNavigate }) => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      const res = await api.resetPassword({ token, newPassword });
      if (res.success) {
        setMsg('Password reset successfully! You can now log in.');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '440px' }}>
      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
          Enter your reset token and new password.
        </p>

        {msg && <div className="badge badge-green" style={{ padding: '8px 12px', marginBottom: '16px', display: 'block' }}>{msg}</div>}
        {error && <div className="badge badge-amber" style={{ padding: '8px 12px', marginBottom: '16px', display: 'block' }}>{error}</div>}

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Reset Token</label>
            <input
              type="text"
              className="form-input"
              placeholder="Paste token from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>

        <button onClick={() => onNavigate('home')} style={{ marginTop: '20px', fontSize: '13px', color: 'var(--accent-primary)', display: 'block', textAlign: 'center', width: '100%' }}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};
