import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert("Thank you! Your message has been sent to Lovehearts.");
    }, 1500);
  };

  return (
    <div className="app-container">
      {/* Navbar Integration */}
      <nav className="navbar" style={{ position: 'relative' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2>Lovehearts</h2>
        </Link>
        <ul>
          <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
          <li><Link to="/gallery" style={{ color: '#fff', textDecoration: 'none' }}>Gallery</Link></li>
        </ul>
      </nav>

      <section className="contact-section" style={{ padding: '80px 50px', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <h1 className="services-title-scroll revealed" style={{ fontSize: '4rem', opacity: 1, transform: 'none' }}>
              Contact Us
            </h1>
            <p style={{ fontFamily: 'Lato', fontWeight: 300, color: '#ccc', fontSize: '1.2rem', marginTop: '-60px' }}>
              Let's create something beautiful together.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px' }}>
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div className="service-info">
                <h3 style={{ fontSize: '2.2rem' }}>Get in Touch</h3>
                <p>We are based in Thiruvananthapuram, Kerala, ready to travel to your destination.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '1.1rem' }}>hello@lovehearts.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Phone</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '1.1rem' }}>+91 98765 43210</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Location</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '1.1rem' }}>Thiruvananthapuram, Kerala</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Your Name</label>
                  <input 
                    required 
                    type="text" 
                    style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Email Address</label>
                  <input 
                    required 
                    type="email" 
                    style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Message</label>
                  <textarea 
                    required 
                    rows={5} 
                    style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }} 
                  />
                </div>

                <button 
                  disabled={loading} 
                  type="submit" 
                  className="start-btn" 
                  style={{ width: '100%', fontSize: '1rem', marginTop: '10px' }}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} style={{ marginRight: '10px' }} /> Send Message</>}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;