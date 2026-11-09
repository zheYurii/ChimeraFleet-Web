import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const isFavorite = useCarUiStore((state) => state.favoriteCarIds.includes(car.id));
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  return (
    <div className={`chimera-card ${isFavorite ? 'favorite-glow' : ''}`}>
      <div className="chimera-card-header">
        <h2 className="teto-text">{car.brand}</h2>
        <span className="chimera-model">{car.model}</span>
      </div>
      
      <div className="chimera-card-actions">
        <button
          type="button"
          className={`chimera-btn ${isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}`}
          onClick={() => toggleFavorite(car.id)}
        >
          {isFavorite ? '★ Ulubiony' : '☆ Ulubione'}
        </button>

        <Link to={`/cars/${car.id}`} className="chimera-btn btn-outline miku-border">Szczegóły</Link>
        <Link to={`/cars/${car.id}/edit`} className="chimera-btn btn-outline miku-border">Edytuj</Link>
        <button onClick={() => onDelete(car.id)} className="chimera-btn btn-danger teto-border">Usuń</button>
      </div>
    </div>
  );
}