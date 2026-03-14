import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isVisible?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isVisible = true }) => {
  return (
    <nav className={`navbar ${!isVisible ? 'navbar-hidden' : 'navbar-visible'}`}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="public/images/lovehearts-logo.png" 
          alt="Lovehearts Logo" 
          style={{ height: '70px', width: 'auto' }} 
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