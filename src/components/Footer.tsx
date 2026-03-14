import React from 'react';
import { motion } from 'framer-motion';

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
          Developed by{' '}
          <motion.a 
            href="https://plgdinn.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#ffffff', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              display: 'inline-block'
            }}
            whileHover={{ 
              color: '#ffd700', 
              textShadow: '0px 0px 10px rgba(255, 215, 0, 0.8)' 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            PluggedIn
          </motion.a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;