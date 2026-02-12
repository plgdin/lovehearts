import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !user) throw new Error('Invalid login credentials');
      navigate('/admin/gallery');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-icon">
          <Lock size={40} />
        </div>
        <h2>Admin Access</h2>
        <p className="subtitle">Lovehearts Wedding Planning</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? <Loader2 className="animate-spin" /> : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;