import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isVisible?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isVisible = true }) => {
  return (
    <nav className={`navbar ${!isVisible ? 'navbar-hidden' : 'navbar-visible'}`}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img 
          src="/images/lovehearts-logo.png" 
          alt="Lovehearts Logo" 
          onLoad={() => console.log("Navbar Logo Loaded")}
          onError={(e) => console.error("Navbar Logo Load Failed. Check if the filename in public/images/ is exactly 'love hearts (w) logo.png' (lowercase png)")}
          style={{ 
            height: '70px', 
            width: 'auto', 
            display: 'block',
            opacity: 1,
            visibility: 'visible',
            border: 'none'
          }} 
        />
      </Link>
      <ul>
        <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
        <li><Link to="/gallery" style={{ color: '#fff', textDecoration: 'none' }}>Gallery</Link></li>
        <li><Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;