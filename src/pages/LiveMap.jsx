import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function LiveMap() {
    const [presence, setPresence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchPresence = async () => {
        try {
            const res = await api.get('/presence/current');
            setPresence(res.data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresence();
        const interval = setInterval(fetchPresence, 5000);
        return () => clearInterval(interval);
    }, []);

    const isOnline = (detected_at) => {
        if (!detected_at) return false;
        const diff = (new Date() - new Date(detected_at)) / 1000 / 60;
        return diff < 5; // online if detected within last 5 minutes
    };

    const detected = presence.filter(p => p.location !== 'Unknown').length;
    const online = presence.filter(p => isOnline(p.detected_at)).length;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Live Employee Location</h1>
                    <p style={styles.subtitle}>
                        {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
                    </p>
                </div>
                <div style={styles.statsRow}>
                    <div style={{...styles.statCard, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.05)'}}>
                        <span style={{...styles.statNum, color: '#10b981'}}>{online}</span>
                        <span style={styles.statLabel}>Online</span>
                    </div>
                    <div style={styles.statCard}>
                        <span style={styles.statNum}>{detected}</span>
                        <span style={styles.statLabel}>Detected</span>
                    </div>
                    <div style={{...styles.statCard, borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.05)'}}>
                        <span style={styles.statNum}>{presence.length}</span>
                        <span style={styles.statLabel}>Total</span>
                    </div>
                </div>
            </div>

            {/* Cards */}
            {loading ? (
                <p style={{ color: '#64748b' }}>Loading...</p>
            ) : (
                <div style={styles.grid}>
                    {presence.map((p, i) => (
                        <div key={i} style={{
                            ...styles.card,
                            borderColor: isOnline(p.detected_at) ? 'rgba(16,185,129,0.3)' : '#1f2d45'
                        }}>
                            <div style={styles.cardTop}>
                                <div style={{
                                    ...styles.avatar,
                                    backgroundColor: isOnline(p.detected_at) ? 'rgba(16,185,129,0.1)' : 'rgba(0,212,255,0.1)',
                                    borderColor: isOnline(p.detected_at) ? 'rgba(16,185,129,0.3)' : 'rgba(0,212,255,0.2)',
                                    color: isOnline(p.detected_at) ? '#10b981' : '#00d4ff',
                                }}>
                                    {p.employee.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={styles.name}>{p.employee}</h3>
                                    <span style={styles.dept}>{p.department}</span>
                                </div>
                                {/* Online/Offline Badge */}
                                <div style={isOnline(p.detected_at) ? styles.onlineBadge : styles.offlineBadge}>
                                    <span style={isOnline(p.detected_at) ? styles.onlineDot : styles.offlineDot} />
                                    {isOnline(p.detected_at) ? 'Online' : 'Offline'}
                                </div>
                            </div>
                            <div style={p.location !== 'Unknown' ? styles.locationActive : styles.locationUnknown}>
                                <span>{p.location !== 'Unknown' ? '📍' : '❓'}</span>
                                <span>{p.location}</span>
                            </div>
                            <p style={styles.time}>
                                {p.detected_at ? new Date(p.detected_at).toLocaleTimeString() : 'Not detected'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'white' },
    subtitle: { color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' },
    statsRow: { display: 'flex', gap: '1rem' },
    statCard: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '12px', padding: '0.8rem 1.2rem', textAlign: 'center', minWidth: '80px' },
    statNum: { display: 'block', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#00d4ff' },
    statLabel: { fontSize: '0.75rem', color: '#64748b' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
    card: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '16px', padding: '1.5rem', transition: 'border-color 0.3s' },
    cardTop: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' },
    avatar: { width: '44px', height: '44px', borderRadius: '12px', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', flexShrink: 0 },
    name: { fontSize: '1rem', fontWeight: 600, color: 'white' },
    dept: { fontSize: '0.75rem', color: '#64748b' },
    onlineBadge: { display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' },
    offlineBadge: { display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(100,116,139,0.1)', color: '#64748b', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #1f2d45' },
    onlineDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' },
    offlineDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#64748b', display: 'inline-block' },
    locationActive: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(16,185,129,0.2)' },
    locationUnknown: { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(100,116,139,0.1)', color: '#64748b', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #1f2d45' },
    time: { fontSize: '0.75rem', color: '#475569', marginTop: '0.8rem', textAlign: 'right' },
};