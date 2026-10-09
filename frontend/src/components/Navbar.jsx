import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, onNavigate, currentRoute }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-color)',
      backdropFilter: 'blur(10px)',
      transition: 'background-color 0.2s, border-color 0.2s'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '20px',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            ⚡
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>Learn</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-primary)', letterSpacing: '-0.5px' }}>Pulse</span>
          </div>
        </div>

        {/* Navigation links (Desktop) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <button 
            onClick={() => onNavigate('catalog')}
            style={{ 
              fontWeight: currentRoute === 'catalog' ? '700' : '500',
              color: currentRoute === 'catalog' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '15px'
            }}
          >
            Explore Courses
          </button>

          {isAuthenticated && (
            <button 
              onClick={() => onNavigate('dashboard')}
              style={{ 
                fontWeight: currentRoute === 'dashboard' ? '700' : '500',
                color: currentRoute === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              My Learning
              <span className="badge badge-blue">Student</span>
            </button>
          )}

          {isAdmin && (
            <button 
              onClick={() => onNavigate('admin')}
              style={{ 
                fontWeight: currentRoute === 'admin' ? '700' : '500',
                color: currentRoute === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Admin Portal
              <span className="badge badge-purple">Admin</span>
            </button>
          )}
        </nav>

        {/* Actions & Theme Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: 'var(--text-primary)',
              transition: 'transform 0.2s'
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User profile dropdown or Login button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '13px'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '210px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 100
                }}>
                  <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{user.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); onNavigate('dashboard'); }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)' }}
                    className="hover-item"
                  >
                    📖 My Courses
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => { setDropdownOpen(false); onNavigate('admin'); }}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)' }}
                    >
                      ⚙️ Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); onNavigate('home'); }}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', color: 'var(--accent-danger)' }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-outline btn-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn btn-primary btn-sm"
              >
                Get Started
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
