import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Settings() {
    const [locations, setLocations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newLocation, setNewLocation] = useState({ name: '', description: '' });
    const [newEmployee, setNewEmployee] = useState({ name: '', employee_id: '', mac_address: '', department: '' });

    useEffect(() => {
        api.get('/locations').then(res => setLocations(res.data));
        api.get('/employees').then(res => setEmployees(res.data));
    }, []);

    const addLocation = async () => {
        const res = await api.post('/locations', newLocation);
        setLocations([...locations, res.data]);
        setNewLocation({ name: '', description: '' });
    };

    const addEmployee = async () => {
        const res = await api.post('/employees', newEmployee);
        setEmployees([...employees, res.data]);
        setNewEmployee({ name: '', employee_id: '', mac_address: '', department: '' });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Settings</h1>

            {/* Locations */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>📍 Locations</h2>
                <div style={styles.form}>
                    <input placeholder="Name" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} style={styles.input} />
                    <input placeholder="Description" value={newLocation.description} onChange={e => setNewLocation({...newLocation, description: e.target.value})} style={styles.input} />
                    <button onClick={addLocation} style={styles.button}>Add Location</button>
                </div>
                <div style={styles.list}>
                    {locations.map((l, i) => (
                        <div key={i} style={styles.listItem}>
                            <span style={styles.listName}>{l.name}</span>
                            <span style={styles.listDesc}>{l.description}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Employees */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>👤 Employees</h2>
                <div style={styles.form}>
                    <input placeholder="Name" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} style={styles.input} />
                    <input placeholder="Employee ID" value={newEmployee.employee_id} onChange={e => setNewEmployee({...newEmployee, employee_id: e.target.value})} style={styles.input} />
                    <input placeholder="MAC Address" value={newEmployee.mac_address} onChange={e => setNewEmployee({...newEmployee, mac_address: e.target.value})} style={styles.input} />
                    <input placeholder="Department" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})} style={styles.input} />
                    <button onClick={addEmployee} style={styles.button}>Add Employee</button>
                </div>
                <div style={styles.list}>
                    {employees.map((e, i) => (
                        <div key={i} style={styles.listItem}>
                            <span style={styles.listName}>{e.name}</span>
                            <span style={styles.badge}>{e.department}</span>
                            <span style={styles.mac}>{e.mac_address}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' },
    title: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '2rem' },
    section: { backgroundColor: '#111827', border: '1px solid #1f2d45', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' },
    sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#00d4ff', marginBottom: '1.2rem' },
    form: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
    input: { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #1f2d45', backgroundColor: '#0d1424', color: 'white', fontSize: '0.9rem', outline: 'none' },
    button: { padding: '0.6rem 1.2rem', backgroundColor: '#00d4ff', color: '#0a0f1e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' },
    list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    listItem: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', backgroundColor: '#0d1424', borderRadius: '8px', border: '1px solid #1a2235' },
    listName: { color: 'white', fontWeight: 500, fontSize: '0.9rem' },
    listDesc: { color: '#64748b', fontSize: '0.85rem' },
    badge: { backgroundColor: 'rgba(124,58,237,0.15)', color: '#a78bfa', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' },
    mac: { color: '#00d4ff', fontSize: '0.8rem', fontFamily: 'monospace', marginLeft: 'auto' },
};