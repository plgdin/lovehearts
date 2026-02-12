import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/client/Home';
import PublicGallery from './pages/client/PublicGallery'; 
import Contact from './pages/client/Contact'; // Import Contact page

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import ManageGallery from './pages/admin/ManageGallery';
import Dashboard from './pages/admin/Dashboard';

import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<PublicGallery />} />
        <Route path="/contact" element={<Contact />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Dashboard />} />
           <Route path="gallery" element={<ManageGallery />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default App;