import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="chimera-error teto-glow" style={{ flexDirection: 'column', gap: '1rem' }}>
      <h2>Błąd 404 - Sektor nie istnieje</h2>
      <p>Podany adres w systemie ChimeraFleet jest nieprawidłowy.</p>
      <Link to="/" className="chimera-btn btn-outline miku-border">Wróć do bazy (Strona główna)</Link>
    </div>
  );
}