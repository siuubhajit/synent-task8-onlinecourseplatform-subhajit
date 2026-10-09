import React from 'react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-color)',
      padding: '50px 0 30px 0',
      marginTop: '60px'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '22px' }}>⚡</span>
              <span style={{ fontSize: '20px', fontWeight: '800' }}>LearnPulse</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Empowering learners worldwide with production-ready software engineering, cloud architecture, and modern product design courses.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li><a href="#catalog" onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}>All Courses</a></li>
              <li><a href="#webdev" onClick={(e) => { e.preventDefault(); onNavigate('catalog', { category: 'Web Development' }); }}>Web Development</a></li>
              <li><a href="#datascience" onClick={(e) => { e.preventDefault(); onNavigate('catalog', { category: 'Data Science' }); }}>Data Science & AI</a></li>
              <li><a href="#uiux" onClick={(e) => { e.preventDefault(); onNavigate('catalog', { category: 'UI/UX Design' }); }}>UI/UX Design</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>Platform Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li>✓ Verified Video Playback</li>
              <li>✓ Lesson Progress Tracking (%)</li>
              <li>✓ Razorpay Test Mode Checkout</li>
              <li>✓ Dark & Light Theme Systems</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>Security & Support</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Secure JWT authentication with bcrypt password hashing and cryptographic signature validation.
            </p>
            <span className="badge badge-green">Razorpay Test Mode Active</span>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <p>© {new Date().getFullYear()} LearnPulse Platform. Full-stack educational learning system.</p>
          <p>Built with React, Express, MongoDB, and Razorpay.</p>
        </div>
      </div>
    </footer>
  );
};
