import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '40px 20px',
      textAlign: 'center',
      background: '#000',
      borderTop: '1px solid #1a1a1a',
      color: '#666',
      fontFamily: 'Lato, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
          © {new Date().getFullYear()} Lovehearts Wedding & Event Planners. All Rights Reserved.
        </p>
        <p style={{ fontSize: '0.75rem', marginTop: '10px', opacity: 0.8 }}>
          Developed by PLGDIN
        </p>
      </div>
    </footer>
  );
};

export default Footer;