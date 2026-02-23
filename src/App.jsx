import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LiveMap from './pages/LiveMap';
import PresenceLogs from './pages/PresenceLogs';
import Settings from './pages/Settings';
import FloorPlan from './pages/FloorPlan';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<LiveMap />} />
                <Route path="/floorplan" element={<FloorPlan />} />
                <Route path="/logs" element={<PresenceLogs />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}