import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface GalleryItem {
  id: number;
  image_url: string;
  category: string;
  title?: string;
}

const PublicGallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track which category is currently being viewed (null = main view)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) console.error('Error fetching gallery:', error);
        else if (data) setGalleryItems(data);
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // --- LOGIC TO GROUP BY CATEGORY ---
  // Picks the most recent image for each category to use as a thumbnail
  const categoryThumbnails = galleryItems.reduce((acc: GalleryItem[], current) => {
    const x = acc.find(item => item.category === current.category);
    if (!x) return acc.concat([current]);
    else return acc;
  }, []);

  // Filter items for the detailed view
  const filteredItems = galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="app-container">
      <nav className="navbar" style={{ position: 'relative' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
            <h2>Lovehearts</h2>
        </Link>
        <ul>
          <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
          <li><Link to="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</Link></li>
        </ul>
      </nav>

      <section className="gallery-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
            {selectedCategory && (
                <motion.button 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedCategory(null)}
                    style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <ArrowLeft size={30} />
                </motion.button>
            )}
            <h2 className="services-title-scroll revealed" style={{ opacity: 1, transform: 'translateY(0)', margin: 0 }}>
                {selectedCategory ? selectedCategory : "Gallery"}
            </h2>
        </div>

        {loading && <div style={{ color: 'white', textAlign: 'center', fontFamily: 'Lato' }}>Loading masterpiece...</div>}

        <div className="gallery-grid">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              // --- MAIN VIEW: 3 CATEGORIES PER ROW ---
              categoryThumbnails.map((item, index) => (
                <motion.div 
                  key={item.category}
                  className="gallery-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedCategory(item.category)}
                >
                  <div className="gallery-img-wrapper">
                    <img src={item.image_url} alt={item.category} />
                  </div>
                  <div className="gallery-text">
                    <h3 style={{ fontSize: '1.5rem', fontFamily: 'Playfair Display', color: '#fff' }}>
                        {item.category}
                    </h3>
                  </div>
                </motion.div>
              ))
            ) : (
              // --- DETAIL VIEW: ALL PHOTOS IN CATEGORY ---
              filteredItems.map((item, index) => (
                <motion.div 
                  key={item.id}
                  className="gallery-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ cursor: 'default' }}
                >
                  <div className="gallery-img-wrapper">
                    <img src={item.image_url} alt={item.title} />
                  </div>
                  {/* NO TEXT BELOW AS REQUESTED */}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {!loading && galleryItems.length === 0 && (
            <div style={{ color: '#666', textAlign: 'center', marginTop: '40px', fontFamily: 'Lato' }}>
                No photos uploaded yet.
            </div>
        )}
      </section>
    </div>
  );
};

export default PublicGallery;