import React from 'react';

export const NotificationToast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const getBorderColor = () => {
    if (type === 'success') return 'var(--accent-emerald)';
    if (type === 'error') return 'var(--accent-danger)';
    return 'var(--accent-primary)';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      backgroundColor: 'var(--bg-surface)',
      border: `2px solid ${getBorderColor()}`,
      borderRadius: '8px',
      padding: '12px 20px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '380px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <span style={{ fontSize: '18px' }}>
        {type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{message}</p>
      <button onClick={onClose} style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '14px' }}>✕</button>
    </div>
  );
};
