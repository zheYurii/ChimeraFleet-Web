import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <div className="chimera-container" style={{ padding: 0 }}>
      <nav className="chimera-nav-container">
        <div className="chimera-nav">
          <NavLink to="/" className="chimera-nav-link" end>Strona główna</NavLink>
          <NavLink to="/cars" className="chimera-nav-link" end>Samochody</NavLink>
          <NavLink to="/cars/new" className="chimera-nav-link">Dodaj samochód</NavLink>
        </div>
      </nav>
      <main className="chimera-content" style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}