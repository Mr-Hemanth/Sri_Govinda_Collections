import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Admin check
      if (email === process.env.REACT_APP_ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      alert("Invalid credentials. " + err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0', maxWidth: '400px', margin: '0 auto' }}>
      <h1 className="text-accent" style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Login</h1>
      <form onSubmit={handleLogin} className="flex-col gap-6" style={{ marginTop: '1rem' }}>
        <div className="flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="input-field" required />
        </div>
        <div className="flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="input-field" required />
        </div>
        <Button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>Login to Account</Button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)' }}>
        Don't have an account? <Link to="/signup" className="text-accent" style={{ fontWeight: '500' }}>Sign up here</Link>
      </p>
    </div>
  );
}
