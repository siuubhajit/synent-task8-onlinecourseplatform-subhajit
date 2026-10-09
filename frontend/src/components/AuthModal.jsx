import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
          if (onSuccess) onSuccess();
        } else {
          setError(res.message);
        }
      } else if (mode === 'register') {
        const res = await register(name, email, password);
        if (res.success) {
          onClose();
          if (onSuccess) onSuccess();
        } else {
          setError(res.message);
        }
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword(email);
        setMsg(res.message || 'Password reset link sent to your email.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('Admin@123Password');
      setName('Platform Administrator');
    } else {
      setEmail('student@example.com');
      setPassword('Student@123Password');
      setName('Rahul Sharma');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
      backdropFilter: 'blur(4px)'
    }}>
      <div 
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '28px',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            fontSize: '18px',
            color: 'var(--text-muted)'
          }}
        >
          ✕
        </button>

        {/* Header Tabs */}
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <button
            onClick={() => { setMode('login'); setError(''); setMsg(''); }}
            style={{
              padding: '10px 4px',
              fontSize: '15px',
              fontWeight: mode === 'login' ? '700' : '500',
              color: mode === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: mode === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); setMsg(''); }}
            style={{
              padding: '10px 4px',
              fontSize: '15px',
              fontWeight: mode === 'register' ? '700' : '500',
              color: mode === 'register' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: mode === 'register' ? '2px solid var(--accent-primary)' : '2px solid transparent'
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-danger)',
            color: 'var(--accent-danger)',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {msg && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600' }}>Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('forgot')}
                    style={{ fontSize: '12px', color: 'var(--accent-primary)' }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Demo 1-Click Fillers */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Quick Demo Auto-Fill (1-Click Evaluation):</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleDemoFill('student')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px' }}
            >
              👤 Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px' }}
            >
              ⚡ Demo Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
