import React from 'react';

export const ProgressBar = ({ percentage = 0, showLabel = true, height = '8px' }) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  
  const getColor = () => {
    if (clamped >= 100) return 'var(--accent-emerald)';
    if (clamped > 50) return 'var(--accent-primary)';
    return '#3b82f6';
  };

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>
          <span>Course Progress</span>
          <span style={{ color: getColor() }}>{clamped}% Completed</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height,
        backgroundColor: 'var(--bg-muted)',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${clamped}%`,
          height: '100%',
          backgroundColor: getColor(),
          borderRadius: '9999px',
          transition: 'width 0.4s ease-in-out'
        }} />
      </div>
    </div>
  );
};
