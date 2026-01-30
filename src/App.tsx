import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page with all animations */}
        <Route path="/" element={<Home />} />
        
        {/* You can add more routes here later, e.g. */}
        {/* <Route path="/gallery" element={<Gallery />} /> */}
      </Routes>
    </Router>
  );
};

export default App;