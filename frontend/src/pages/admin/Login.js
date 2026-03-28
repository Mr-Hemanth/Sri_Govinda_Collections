import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import Button from '../../components/ui/Button';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && user.email === process.env.REACT_APP_ADMIN_EMAIL) {
                navigate('/admin');
            }
        });
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        if (email !== process.env.REACT_APP_ADMIN_EMAIL) {
            setError('Access Denied: Only administrators can log in here.');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-col items-center justify-center section-padding" style={{ minHeight: '80vh', background: 'var(--color-ivory)' }}>
            <div className="card glass animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '3rem', borderRadius: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '70px', height: '70px', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-primary)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <ShieldCheck size={36} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-black)' }}>Admin Portal</h1>
                    <p style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Sri Govinda Collections Management</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2" style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '1rem', borderRadius: '12px', color: '#dc2626', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex-col gap-5">
                    <div className="flex-col gap-2">
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>Admin Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input 
                                required 
                                type="email" 
                                className="input-field" 
                                style={{ paddingLeft: '3rem' }} 
                                placeholder="admin@srigovinda.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-col gap-2">
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>Security Phrase</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input 
                                required 
                                type="password" 
                                className="input-field" 
                                style={{ paddingLeft: '3rem' }} 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading} 
                        style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', borderRadius: '50px', fontSize: '1rem' }}
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Authorized access only. All activities are monitored.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
