import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const links = [
        { to: '/', label: 'Live Map' },
        { to: '/floorplan', label: 'Floor Plan' },
        { to: '/logs', label: 'Presence Logs' },
        { to: '/settings', label: 'Settings' },
    ];

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>
                <span style={styles.logoIcon}>◈</span>
                <span style={styles.logoText}>BEACON<span style={styles.logoAccent}>TRACKER</span></span>
            </div>
            <div style={styles.links}>
                {links.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        style={{
                            ...styles.link,
                            ...(location.pathname === link.to ? styles.activeLink : {})
                        }}
                    >
                        {link.label}
                        {location.pathname === link.to && <span style={styles.activeDot} />}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 2.5rem', backgroundColor: '#0d1424', borderBottom: '1px solid #1f2d45', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' },
    logo: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
    logoIcon: { fontSize: '1.5rem', color: '#00d4ff' },
    logoText: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.1em', color: 'white' },
    logoAccent: { color: '#00d4ff' },
    links: { display: 'flex', gap: '0.5rem' },
    link: { color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 1rem', borderRadius: '8px', transition: 'all 0.2s', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
    activeLink: { color: '#00d4ff', backgroundColor: 'rgba(0, 212, 255, 0.08)' },
    activeDot: { width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#00d4ff', display: 'block' },
};