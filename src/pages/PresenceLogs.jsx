import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function PresenceLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');
    const [activeTab, setActiveTab] = useState('table');

    useEffect(() => {
        api.get('/presence/logs').then(res => setLogs(res.data));
    }, []);

    const departments = ['All', ...new Set(logs.map(l => l.employee?.department).filter(Boolean))];
    const locations = ['All', ...new Set(logs.map(l => l.location?.name).filter(Boolean))];

    const filtered = logs.filter(log => {
        const matchSearch = log.employee?.name.toLowerCase().includes(search.toLowerCase());
        const matchDept = filterDept === 'All' || log.employee?.department === filterDept;
        const matchLocation = filterLocation === 'All' || log.location?.name === filterLocation;
        return matchSearch && matchDept && matchLocation;
    });

    // Chart data
    const locationCounts = logs.reduce((acc, log) => {
        const name = log.location?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});
    const locationChartData = Object.entries(locationCounts).map(([name, count]) => ({ name, count }));

    const employeeCounts = logs.reduce((acc, log) => {
        const name = log.employee?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});
    const employeeChartData = Object.entries(employeeCounts).map(([name, value]) => ({ name, value }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#0d1424', border: '1px solid #1f2d45', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                    <p style={{ color: '#00d4ff', fontWeight: 600 }}>{label}</p>
                    <p style={{ color: 'white' }}>{payload[0].value} detections</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Presence Logs</h1>
            <p style={styles.subtitle}>{filtered.length} records found</p>

            {/* Tabs */}
            <div style={styles.tabs}>
                {['table', 'charts'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.activeTab : styles.tab}>
                        {tab === 'table' ? 'Table' : 'Charts'}
                    </button>
                ))}
            </div>

            {activeTab === 'table' && (
                <>
                    {/* Filters */}
                    <div style={styles.filters}>
                        <input
                            placeholder="Search employee..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={styles.select}>
                            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                        </select>
                        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} style={styles.select}>
                            {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
                        </select>
                        {(search || filterDept !== 'All' || filterLocation !== 'All') && (
                            <button onClick={() => { setSearch(''); setFilterDept('All'); setFilterLocation('All'); }} style={styles.clearBtn}>
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Table */}
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {['Employee', 'Department', 'Location', 'Signal', 'Detected At'].map(h => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={5} style={styles.empty}>No records found</td></tr>
                                ) : filtered.map((log, i) => (
                                    <tr key={i} style={styles.tr}>
                                        <td style={styles.td}>{log.employee?.name}</td>
                                        <td style={styles.td}><span style={styles.badge}>{log.employee?.department}</span></td>
                                        <td style={styles.td}>{log.location?.name}</td>
                                        <td style={styles.td}><span style={styles.rssi}>{log.rssi} dBm</span></td>
                                        <td style={styles.td}>{new Date(log.detected_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'charts' && (
                <div style={styles.chartsGrid}>
                    {/* Bar Chart - Detections by Location */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Detections by Location</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={locationChartData}>
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" fill="#00d4ff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart - Detections by Employee */}
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Detections by Employee</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={employeeChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {employeeChartData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'white' },
    subtitle: { color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem', marginBottom: '1.5rem' },
    tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
    tab: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #1f2d45', backgroundColor: '#111827', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' },
    activeTab: { padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #00d4ff', backgroundColor: 'rgba(0,212,255,0.08)', color: '#00d4ff', cursor: 'pointer', fontSize: '0.9rem' },
    filters: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' },
    searchInput: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #1f2d45', backgroundColor: '#111827', color: 'white', fontSize: '0.9rem', outline: 'none', minWidth: '220px' },
    select: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #1f2d45', backgroundColor: '#111827', color: 'white', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' },
    clearBtn: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer' },
    tableWrap: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '16px', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #1f2d45', backgroundColor: '#0d1424' },
    tr: { borderBottom: '1px solid #1a2235' },
    td: { padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#e2e8f0' },
    badge: { backgroundColor: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
    rssi: { backgroundColor: 'rgba(0,212,255,0.08)', color: '#00d4ff', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
    empty: { padding: '3rem', textAlign: 'center', color: '#64748b' },
    chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' },
    chartCard: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '16px', padding: '1.5rem' },
    chartTitle: { fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' },
};