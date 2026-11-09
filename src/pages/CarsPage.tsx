import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import CarCard from '../components/CarCard';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCars() {
      try {
        setIsLoading(true);
        const data = await getCars(controller.signal);
        setCars(data);
        setError(null);
      } catch (err: any) {
        if (axios.isCancel(err)) return;
        setError(err.message || 'Wystąpił błąd podczas ładowania floty.');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }
    fetchCars();
    return () => controller.abort();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć ten samochód?');
    if (!confirmed) return;

    try {
      await deleteCar(id);
      removeFavorite(id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (err: any) {
      alert(`Błąd podczas usuwania: ${err.message}`);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleCars = cars.filter((car) => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(normalizedSearch) || 
      car.model.toLowerCase().includes(normalizedSearch);
    
    const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);
    
    return matchesSearch && matchesFavorite;
  });

  if (isLoading) return <div className="chimera-container"><div className="chimera-loader miku-glow">Inicjalizacja terminala ChimeraFleet...</div></div>;
  if (error) return <div className="chimera-container"><div className="chimera-error teto-glow">Błąd krytyczny: {error}</div></div>;

  return (
    <div className="chimera-container">
      <header className="chimera-header">
        <h1 className="miku-text">Rejestr Pojazdów</h1>
        <Link to="/cars/new" className="chimera-btn btn-primary miku-border">+ Nowy Pojazd</Link>
      </header>

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="chimera-input search-input"
        />
        <label className="favorite-filter miku-text">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="chimera-checkbox"
          />
          Tylko ulubione jednostki
        </label>
      </div>

      {visibleCars.length === 0 ? (
        <div className="chimera-empty">Brak pojazdów spełniających kryteria.</div>
      ) : (
        <div className="chimera-grid">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}