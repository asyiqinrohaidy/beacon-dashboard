import { useState, useEffect } from 'react';
import api from '../api/axios';

const ROOM_LAYOUT = [
    { id: 1, name: 'Workshop First Floor', x: 0, y: 0, w: 3, h: 1, color: '#00d4ff' },
    { id: 2, name: 'Meeting Room Second Floor', x: 3, y: 0, w: 3, h: 1, color: '#7c3aed' },
];

const CELL_W = 160;
const CELL_H = 140;
const GAP = 8;

export default function FloorPlan() {
    const [presence, setPresence] = useState([]);

    const fetchPresence = async () => {
        const res = await api.get('/presence/current');
        setPresence(res.data);
    };

    useEffect(() => {
        fetchPresence();
        const interval = setInterval(fetchPresence, 5000);
        return () => clearInterval(interval);
    }, []);

    const getEmployeesInRoom = (roomName) =>
        presence.filter(p => p.location === roomName);

    const isOnline = (detected_at) => {
        if (!detected_at) return false;
        return (new Date() - new Date(detected_at)) / 1000 / 60 < 5;
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Floor Plan</h1>
            <p style={styles.subtitle}>Live view of employee locations · Auto-refreshes every 5 seconds</p>

            <div style={styles.mapWrapper}>
                <div style={{
                    position: 'relative',
                    width: 6 * (CELL_W + GAP),
                    height: 2 * (CELL_H + GAP),
                }}>
                    {ROOM_LAYOUT.map(room => {
                        const employees = getEmployeesInRoom(room.name);
                        return (
                            <div
                                key={room.id}
                                style={{
                                    position: 'absolute',
                                    left: room.x * (CELL_W + GAP),
                                    top: room.y * (CELL_H + GAP),
                                    width: room.w * (CELL_W + GAP) - GAP,
                                    height: room.h * (CELL_H + GAP) - GAP,
                                    backgroundColor: '#111827',
                                    border: `1px solid ${employees.length > 0 ? room.color : '#1f2d45'}`,
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    boxShadow: employees.length > 0 ? `0 0 20px ${room.color}22` : 'none',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {/* Room name */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: room.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {room.name}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: '#475569' }}>
                                        {employees.length} present
                                    </span>
                                </div>

                                {/* Employee avatars */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    {employees.map((emp, i) => (
                                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '10px',
                                                backgroundColor: isOnline(emp.detected_at) ? `${room.color}22` : 'rgba(100,116,139,0.1)',
                                                border: `1px solid ${isOnline(emp.detected_at) ? room.color : '#1f2d45'}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: isOnline(emp.detected_at) ? room.color : '#64748b',
                                                fontFamily: 'Syne, sans-serif',
                                                position: 'relative',
                                            }}>
                                                {emp.employee.charAt(0)}
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-3px',
                                                    right: '-3px',
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isOnline(emp.detected_at) ? '#10b981' : '#64748b',
                                                    border: '1px solid #0a0f1e',
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '0.6rem', color: '#64748b', textAlign: 'center', maxWidth: '40px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {emp.employee.split(' ')[0]}
                                            </span>
                                        </div>
                                    ))}

                                    {employees.length === 0 && (
                                        <span style={{ fontSize: '0.75rem', color: '#1f2d45', fontStyle: 'italic' }}>Empty</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div style={styles.legend}>
                <div style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: '#10b981' }} />
                    <span>Online (detected within 5 min)</span>
                </div>
                <div style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: '#64748b' }} />
                    <span>Offline</span>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'white' },
    subtitle: { color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: '2rem' },
    mapWrapper: { backgroundColor: '#0d1424', border: '1px solid #1f2d45', borderRadius: '16px', padding: '1.5rem', overflowX: 'auto', marginBottom: '1.5rem' },
    legend: { display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.85rem' },
    legendItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    legendDot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' },
};