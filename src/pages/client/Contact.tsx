import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
    show: false, 
    message: "", 
    type: 'success' 
  });

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const currentForm = e.currentTarget;
    const formData = new FormData(currentForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formsubmit.co/ajax/plgdinn@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success === "true") {
        showNotification("Thank you! Your message has been sent.", 'success');
        currentForm.reset(); 
      } else {
        showNotification("Failed to send message. Please try again.", 'error');
      }
    } catch (error) {
      console.error("Submission error:", error);
      showNotification("Network error. Please check your connection.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Global Navbar handles navigation */}

      <section className="contact-section" style={{ padding: '80px 20px', color: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <h1 className="services-title-scroll revealed" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', opacity: 1, transform: 'none' }}>
              Contact Us
            </h1>
            <p style={{ fontFamily: 'Lato', fontWeight: 300, color: '#ccc', fontSize: '1.2rem', marginTop: '-20px' }}>
              Let's create something beautiful together.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="service-info">
                <h3 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, serif' }}>Get in Touch</h3>
                <p>We are based in Thiruvananthapuram, Kerala, ready to travel to your destination.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '1.1rem' }}>loveheartstvm@gmail.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Phone</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '1.1rem' }}>+91 90614 74443</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,71,87,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ff4757' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Response Time</p>
                    <p style={{ fontFamily: 'Lato', fontSize: '1.1rem' }}>Within 24 business hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '20px', border: '1px solid #1a1a1a' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_subject" value="New Inquiry from Lovehearts Website!" />
                <input type="hidden" name="_template" value="table" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Full Name</label>
                  <input name="name" required type="text" placeholder="Name" disabled={loading} style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Email</label>
                    <input name="email" required type="email" placeholder="email@example.com" disabled={loading} style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Phone</label>
                    <input name="phone" required type="tel" placeholder="Phone Number" disabled={loading} style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Inquiry Type</label>
                  <select name="inquiryType" required disabled={loading} style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none' }} defaultValue="">
                    <option value="" disabled>Select a service</option>
                    <option value="Wedding Planning">Wedding Planning</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Haldi Ceremony">Haldi Ceremony</option>
                    <option value="Other Events">Other Events</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px' }}>Message</label>
                  <textarea name="message" required rows={4} placeholder="Tell us about your event..." disabled={loading} style={{ background: '#000', border: '1px solid #333', padding: '15px', borderRadius: '8px', color: '#fff', outline: 'none', resize: 'none' }} />
                </div>

                <button 
                  disabled={loading} 
                  type="submit" 
                  className="start-btn" 
                  style={{ 
                    width: '100%', 
                    fontSize: '1rem', 
                    marginTop: '10px', 
                    opacity: loading ? 0.7 : 1, 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" style={{ marginRight: '10px' }} /> Sending...</>
                  ) : (
                    <><Send size={18} style={{ marginRight: '10px' }} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {toast.show && (
          <motion.div 
            className={`custom-toast ${toast.type}`}
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
               position: 'fixed',
               bottom: '30px',
               left: '50%',
               zIndex: 9999,
               display: 'flex',
               alignItems: 'center',
               gap: '12px',
               padding: '14px 28px',
               borderRadius: '50px',
               color: '#fff',
               boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
               pointerEvents: 'none',
               background: toast.type === 'success' ? '#2ed573' : '#ff4757'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.95rem' }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;