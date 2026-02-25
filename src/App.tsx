import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import Footer

// Public Pages
import Home from './pages/client/Home';
import PublicGallery from './pages/client/PublicGallery'; 
import Contact from './pages/client/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import ManageGallery from './pages/admin/ManageGallery';
import Dashboard from './pages/admin/Dashboard';

import './App.css';

const AppContent = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setHasStarted(false);
    }
  }, [location.pathname]);

  const isNavbarVisible = location.pathname !== '/' || hasStarted;

  return (
    <>
      <Navbar isVisible={isNavbarVisible} /> 
      <Routes>
        <Route path="/" element={<Home setGlobalStarted={setHasStarted} />} />
        <Route path="/gallery" element={<PublicGallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Dashboard />} />
           <Route path="gallery" element={<ManageGallery />} />
        </Route>
      </Routes>
      {/* Footer only shows once the intro is cleared on Home, or immediately on other pages */}
      {isNavbarVisible && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;