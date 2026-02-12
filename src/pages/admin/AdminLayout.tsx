import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Image as ImageIcon, LogOut, Loader2 } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return (
    <div className="loading-screen">
      <Loader2 className="animate-spin" /> Verify Access...
    </div>
  );

  const isActive = (path: string) => location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-logo">Lovehearts<span>.</span></h2>
        
        <nav className="sidebar-nav">
          <Link to="/admin" className={isActive('/admin')}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/gallery" className={isActive('/admin/gallery')}>
            <ImageIcon size={20} /> Gallery
          </Link>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;