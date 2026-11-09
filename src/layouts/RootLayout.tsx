import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
  const favoriteCount = useCarUiStore((state) => state.favoriteCarIds.length);

  return (
    <div className="chimera-container" style={{ padding: 0 }}>
      <nav className="chimera-nav-container">
        <div className="chimera-nav">
          <NavLink to="/" className="chimera-nav-link" end>Strona główna</NavLink>
          <NavLink to="/cars" className="chimera-nav-link" end>Samochody</NavLink>
          <NavLink to="/cars/new" className="chimera-nav-link">Dodaj samochód</NavLink>
          
          <span className="favorite-counter teto-text teto-glow">
            Ulubione jednostki: {favoriteCount}
          </span>
        </div>
      </nav>
      <main className="chimera-content" style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}