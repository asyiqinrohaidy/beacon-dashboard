import { useState } from 'react';
import api from '../api/axios';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onLogin(res.data.user);
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>◈</span>
                    <span style={styles.logoText}>BEACON<span style={styles.logoAccent}>TRACKER</span></span>
                </div>
                <h2 style={styles.title}>Welcome back</h2>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="admin@beacontracker.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={styles.input}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={styles.input}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                <button onClick={handleLogin} style={styles.button} disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0f1e' },
    card: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '400px' },
    logo: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', justifyContent: 'center' },
    logoIcon: { fontSize: '1.5rem', color: '#00d4ff' },
    logoText: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.1em', color: 'white' },
    logoAccent: { color: '#00d4ff' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' },
    error: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' },
    formGroup: { marginBottom: '1.2rem' },
    label: { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' },
    input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #1f2d45', backgroundColor: '#0d1424', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
    button: { width: '100%', padding: '0.85rem', backgroundColor: '#00d4ff', color: '#0a0f1e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem' },
};