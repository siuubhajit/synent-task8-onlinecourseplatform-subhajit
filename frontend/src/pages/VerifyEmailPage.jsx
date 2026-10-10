import React, { useState } from 'react';
import { api } from '../services/api';

export const VerifyEmailPage = ({ onNavigate }) => {
  const [token, setToken] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      const res = await api.verifyEmail(token);
      if (res.success) {
        setMsg('Email verified successfully! You now have full platform access.');
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
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Verify Your Email</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          Enter the 6-digit verification code sent to your registered email address.
        </p>

        {msg && <div className="badge badge-green" style={{ padding: '8px 12px', marginBottom: '16px', display: 'block' }}>{msg}</div>}
        {error && <div className="badge badge-amber" style={{ padding: '8px 12px', marginBottom: '16px', display: 'block' }}>{error}</div>}

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '4px' }}
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <button onClick={() => onNavigate('dashboard')} style={{ marginTop: '20px', fontSize: '13px', color: 'var(--accent-primary)' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};
