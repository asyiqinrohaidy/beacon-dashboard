import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiveMap from './pages/LiveMap';
import PresenceLogs from './pages/PresenceLogs';
import Settings from './pages/Settings';
import FloorPlan from './pages/FloorPlan';
import Fingerprinting from './pages/Fingerprinting';
import Login from './pages/Login';

export default function App() {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <BrowserRouter>
            <Navbar onLogout={handleLogout} user={user} />
            <Routes>
                <Route path="/" element={<LiveMap />} />
                <Route path="/floorplan" element={<FloorPlan />} />
                <Route path="/logs" element={<PresenceLogs />} />
                <Route path="/fingerprinting" element={<Fingerprinting />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}