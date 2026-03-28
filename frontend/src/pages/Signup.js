import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Button from '../components/ui/Button';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate('/home');
    } catch (err) {
      alert("Signup failed. " + err.message);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0', maxWidth: '400px', margin: '0 auto' }}>
      <h1 className="text-accent" style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Sign Up</h1>
      <form onSubmit={handleSignup} className="flex-col gap-6" style={{ marginTop: '1rem' }}>
        <div className="flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="input-field" required />
        </div>
        <div className="flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="input-field" required />
        </div>
        <div className="flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="input-field" required minLength="6" />
        </div>
        <Button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>Create Account</Button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-gray-dark)' }}>
        Already have an account? <Link to="/login" className="text-accent" style={{ fontWeight: '500' }}>Login here</Link>
      </p>
    </div>
  );
}
