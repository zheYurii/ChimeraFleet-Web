import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import axios from 'axios';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCars() {
      try {
        setIsLoading(true);
        const data = await getCars(controller.signal);
        setCars(data);
        setError(null);
      } catch (err: any) {
        if (axios.isCancel(err)){
            return;
        }
        if (err.name !== 'AbortError') {
          setError(err.message || 'Wystąpił błąd podczas ładowania floty.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchCars();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) return;

    try {
      await deleteCar(id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err: any) {
      alert(`Błąd podczas usuwania: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="chimera-container">
        <div className="chimera-loader miku-glow">Inicjalizacja terminala ChimeraFleet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chimera-container">
        <div className="chimera-error teto-glow">Błąd krytyczny: {error}</div>
      </div>
    );
  }

  return (
    <div className="chimera-container">
      <header className="chimera-header">
        <h1 className="miku-text">Rejestr Pojazdów</h1>
        <Link to="/cars/new" className="chimera-btn btn-primary miku-border">
          + Nowy Pojazd
        </Link>
      </header>

      {cars.length === 0 ? (
        <div className="chimera-empty">Brak pojazdów we flocie ChimeraFleet.</div>
      ) : (
        <div className="chimera-grid">
          {cars.map((car) => (
            <div key={car.id} className="chimera-card">
              <div className="chimera-card-header">
                <h2 className="teto-text">{car.brand}</h2>
                <span className="chimera-model">{car.model}</span>
              </div>
              <div className="chimera-card-actions">
                <Link to={`/cars/${car.id}`} className="chimera-btn btn-outline miku-border">
                  Szczegóły
                </Link>
                <Link to={`/cars/${car.id}/edit`} className="chimera-btn btn-outline miku-border">
                  Edytuj
                </Link>
                <button 
                  onClick={() => handleDelete(car.id)} 
                  className="chimera-btn btn-danger teto-border"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}