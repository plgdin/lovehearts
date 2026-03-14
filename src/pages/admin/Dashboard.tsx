import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Heart, Star, ExternalLink, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [imageCount, setImageCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total count of images from Supabase
      const { count } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact', head: true });

      setImageCount(count || 0);
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back to your portfolio overview.</p>
      </div>

      {/* --- STATS ROW --- */}
      <div className="stats-grid">
        
        {/* Total Photos Card */}
        <div className="stat-card">
          <div className="stat-icon pink">
            <ImageIcon size={28} />
          </div>
          <div className="stat-info">
            <h3>{loading ? '-' : imageCount}</h3>
            <p>Total Photos</p>
          </div>
        </div>

        {/* Categories Card (Static for now) */}
        <div className="stat-card">
          <div className="stat-icon purple">
            <Star size={28} />
          </div>
          <div className="stat-info">
            <h3>4</h3>
            <p>Active Categories</p>
          </div>
        </div>

        {/* Site Health Card */}
        <div className="stat-card">
          <div className="stat-icon red">
            <Heart size={28} />
          </div>
          <div className="stat-info">
            <h3>Live</h3>
            <p>System Status</p>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTIONS --- */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          
          <Link to="/admin/gallery" className="quick-action-card">
            <Plus size={24} className="action-icon" />
            <span>Upload New Photo</span>
          </Link>

          <a href="/" target="_blank" rel="noopener noreferrer" className="quick-action-card">
            <ExternalLink size={24} className="action-icon" />
            <span>View Live Website</span>
          </a>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;