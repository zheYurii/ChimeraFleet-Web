import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import axios from 'axios';
import { getCarById } from '../services/carService';
import { FuelTypeMap, BodyTypeMap } from '../models/Car';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchDetails() {
      try {
        setIsLoading(true);
        const data = await getCarById(id as string, controller.signal);
        setCar(data);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
    return () => controller.abort();
  }, [id]);

  if (isLoading) return <div className="chimera-loader miku-glow">Odczyt telemetrii...</div>;
  if (error || !car) return <div className="chimera-error teto-glow">Błąd odczytu: {error}</div>;

  const isFavorite = favoriteCarIds.includes(car.id);

  return (
    <div>
      <h1 className="miku-text">{car.brand} {car.model} {isFavorite && '★'}</h1>
      <div className="chimera-details-grid">
        <div className="chimera-detail-item"><strong>ID Pojazdu:</strong> {car.id}</div>
        <div className="chimera-detail-item"><strong>Data produkcji:</strong> {car.productionDate}</div>
        <div className="chimera-detail-item"><strong>Liczba drzwi:</strong> {car.doorsNumber}</div>
        <div className="chimera-detail-item"><strong>Poj. bagażnika:</strong> {car.trunkCapacity} L</div>
        <div className="chimera-detail-item"><strong>Poj. silnika:</strong> {car.engineCapacity} cm³</div>
        <div className="chimera-detail-item"><strong>Średnie spalanie:</strong> {car.averageFuelConsumption} L/100km</div>
        <div className="chimera-detail-item"><strong>Typ paliwa:</strong> {FuelTypeMap[car.fuelType] || 'Nieznany'}</div>
        <div className="chimera-detail-item"><strong>Typ nadwozia:</strong> {BodyTypeMap[car.bodyType] || 'Nieznany'}</div>
      </div>
      
      <div className="chimera-actions">
        <button 
          onClick={() => toggleFavorite(car.id)} 
          className={`chimera-btn ${isFavorite ? 'favorite-button active-favorite' : 'favorite-button'}`}
        >
          {isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        </button>

        <Link to="/cars" className="chimera-btn btn-outline">Wróć do floty</Link>
        <Link to={`/cars/${car.id}/edit`} className="chimera-btn btn-primary">Edytuj konfigurację</Link>
      </div>
    </div>
  );
}