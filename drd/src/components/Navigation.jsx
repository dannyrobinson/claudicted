import React from 'react';

const Navigation = ({ onNavigate, currentPath }) => {
  const links = [
    { name: 'D-Rob', path: 'home' },
    { name: 'The Work', path: 'work' },
    { name: 'CV', path: 'cv' }
  ];

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'rgba(242, 240, 237, 0.8)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', gap: '3rem' }}>
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => onNavigate(link.path)}
            className="nav-link"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: currentPath === link.path ? 'var(--accent)' : 'var(--text)',
              borderBottom: currentPath === link.path ? '2px solid var(--accent)' : '2px solid transparent',
              paddingBottom: '0.25rem'
            }}
          >
            {link.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
