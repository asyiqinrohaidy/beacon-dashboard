import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Fingerprinting() {
    const [fingerprints, setFingerprints] = useState([]);
    const [spotName, setSpotName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [training, setTraining] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [predicting, setPredicting] = useState(false);
    const [liveRssi, setLiveRssi] = useState({ gateway_1_rssi: '', gateway_2_rssi: '' });

    const fetchFingerprints = async () => {
        const res = await api.get('/fingerprint');
        setFingerprints(res.data);
    };

    useEffect(() => {
        fetchFingerprints();
    }, []);

    const savefingerprint = async () => {
        if (!spotName || !locationName || !liveRssi.gateway_1_rssi || !liveRssi.gateway_2_rssi) {
            alert('Please fill in all fields!');
            return;
        }
        setTraining(true);
        await api.post('/fingerprint/train', {
            spot_name: spotName,
            location_name: locationName,
            gateway_1_rssi: parseInt(liveRssi.gateway_1_rssi),
            gateway_2_rssi: parseInt(liveRssi.gateway_2_rssi),
        });
        setSpotName('');
        setLocationName('');
        setLiveRssi({ gateway_1_rssi: '', gateway_2_rssi: '' });
        await fetchFingerprints();
        setTraining(false);
    };

    const predict = async () => {
        if (!liveRssi.gateway_1_rssi || !liveRssi.gateway_2_rssi) {
            alert('Please enter RSSI values!');
            return;
        }
        setPredicting(true);
        try {
            const res = await api.post('/fingerprint/predict', {
                gateway_1_rssi: parseInt(liveRssi.gateway_1_rssi),
                gateway_2_rssi: parseInt(liveRssi.gateway_2_rssi),
            });
            setPrediction(res.data);
        } catch (err) {
            alert('No fingerprint data available. Please train first!');
        }
        setPredicting(false);
    };

    const reset = async () => {
        if (confirm('Are you sure you want to reset all fingerprint data?')) {
            await api.delete('/fingerprint/reset');
            setFingerprints([]);
            setPrediction(null);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Fingerprinting</h1>
            <p style={styles.subtitle}>Train the system by recording RSSI values at specific spots</p>

            <div style={styles.grid}>
                {/* Training Section */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Training Mode</h2>
                    <p style={styles.cardDesc}>Stand at a specific spot and record RSSI values from both gateways</p>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Spot Name</label>
                        <input
                            placeholder="e.g. Near Window, Center of Room"
                            value={spotName}
                            onChange={e => setSpotName(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Location Name</label>
                        <input
                            placeholder="e.g. Workshop First Floor"
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.rssiRow}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Gateway 1 RSSI (Workshop)</label>
                            <input
                                placeholder="-75"
                                value={liveRssi.gateway_1_rssi}
                                onChange={e => setLiveRssi({...liveRssi, gateway_1_rssi: e.target.value})}
                                style={styles.input}
                                type="number"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Gateway 2 RSSI (Meeting Room)</label>
                            <input
                                placeholder="-85"
                                value={liveRssi.gateway_2_rssi}
                                onChange={e => setLiveRssi({...liveRssi, gateway_2_rssi: e.target.value})}
                                style={styles.input}
                                type="number"
                            />
                        </div>
                    </div>

                    <div style={styles.buttonRow}>
                        <button onClick={savefingerprint} style={styles.primaryBtn} disabled={training}>
                            {training ? 'Saving...' : 'Save Fingerprint'}
                        </button>
                        <button onClick={predict} style={styles.secondaryBtn} disabled={predicting}>
                            {predicting ? 'Predicting...' : 'Predict Location'}
                        </button>
                    </div>

                    {/* Prediction Result */}
                    {prediction && (
                        <div style={styles.predictionCard}>
                            <p style={styles.predictionLabel}>Predicted Location</p>
                            <p style={styles.predictionValue}>📍 {prediction.predicted_location}</p>
                            <p style={styles.predictionSub}>Nearest spot: {prediction.nearest_spot}</p>
                            <div style={styles.neighbors}>
                                <p style={styles.neighborTitle}>K=3 Nearest Neighbors:</p>
                                {prediction.neighbors.map((n, i) => (
                                    <div key={i} style={styles.neighborItem}>
                                        <span style={styles.neighborSpot}>{n.spot_name}</span>
                                        <span style={styles.neighborLocation}>{n.location_name}</span>
                                        <span style={styles.neighborDist}>dist: {n.distance.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Fingerprint Data Table */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Fingerprint Map ({fingerprints.length} spots)</h2>
                        {fingerprints.length > 0 && (
                            <button onClick={reset} style={styles.resetBtn}>Reset All</button>
                        )}
                    </div>

                    {fingerprints.length === 0 ? (
                        <p style={styles.empty}>No fingerprint data yet. Start training!</p>
                    ) : (
                        <div style={styles.tableWrap}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        {['Spot', 'Location', 'GW1 RSSI', 'GW2 RSSI'].map(h => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fingerprints.map((fp, i) => (
                                        <tr key={i} style={styles.tr}>
                                            <td style={styles.td}>{fp.spot_name}</td>
                                            <td style={styles.td}><span style={styles.badge}>{fp.location_name}</span></td>
                                            <td style={styles.td}><span style={styles.rssi}>{fp.gateway_1_rssi} dBm</span></td>
                                            <td style={styles.td}><span style={styles.rssi2}>{fp.gateway_2_rssi} dBm</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'white' },
    subtitle: { color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: '2rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
    card: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '16px', padding: '1.5rem' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#00d4ff', marginBottom: '0.5rem' },
    cardDesc: { color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem' },
    input: { width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #1f2d45', backgroundColor: '#0d1424', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
    rssiRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    buttonRow: { display: 'flex', gap: '0.75rem', marginTop: '1.5rem' },
    primaryBtn: { flex: 1, padding: '0.7rem', backgroundColor: '#00d4ff', color: '#0a0f1e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' },
    secondaryBtn: { flex: 1, padding: '0.7rem', backgroundColor: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' },
    resetBtn: { padding: '0.4rem 0.8rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' },
    predictionCard: { marginTop: '1.5rem', backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '1rem' },
    predictionLabel: { color: '#64748b', fontSize: '0.8rem', marginBottom: '0.3rem' },
    predictionValue: { color: '#10b981', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Syne, sans-serif' },
    predictionSub: { color: '#64748b', fontSize: '0.8rem', marginTop: '0.3rem' },
    neighbors: { marginTop: '1rem', borderTop: '1px solid rgba(16,185,129,0.2)', paddingTop: '0.75rem' },
    neighborTitle: { color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem' },
    neighborItem: { display: 'flex', gap: '1rem', padding: '0.3rem 0', fontSize: '0.8rem' },
    neighborSpot: { color: 'white', flex: 1 },
    neighborLocation: { color: '#a78bfa', flex: 1 },
    neighborDist: { color: '#00d4ff' },
    empty: { color: '#475569', fontStyle: 'italic', textAlign: 'center', padding: '2rem' },
    tableWrap: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #1f2d45', backgroundColor: '#0d1424' },
    tr: { borderBottom: '1px solid #1a2235' },
    td: { padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#e2e8f0' },
    badge: { backgroundColor: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' },
    rssi: { backgroundColor: 'rgba(0,212,255,0.08)', color: '#00d4ff', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' },
    rssi2: { backgroundColor: 'rgba(124,58,237,0.08)', color: '#a78bfa', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' },
};