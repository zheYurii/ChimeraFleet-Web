import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCarById, updateCar } from '../services/carService';
import type { NewCar } from '../models/Car';
import axios from 'axios';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewCar | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchCar() {
      try {
        const data = await getCarById(id as string, controller.signal);
        const { id: _, ...carData } = data as any; 
        setFormData(carData);
      } catch (err: any) {
        if (axios.isCancel(err)){
            return;
        }
        if (err.name !== 'AbortError') alert(`Błąd: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCar();
    return () => controller.abort();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const isNumberField = type === 'number' || name === 'fuelType' || name === 'bodyType';

    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: isNumberField ? Number(value) : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;
    try {
      await updateCar(id, formData);
      navigate(`/cars/${id}`);
    } catch (err: any) {
      alert(`Błąd aktualizacji: ${err.message}`);
    }
  };

  if (isLoading || !formData) return <div className="chimera-loader miku-glow">Ładowanie parametrów...</div>;

  return (
    <div>
      <h1 className="teto-text">Modyfikacja Parametrów (ID: {id})</h1>
      <form onSubmit={handleSubmit} className="chimera-form" style={{ borderTopColor: 'var(--miku-cyan)' }}>
        <div className="chimera-form-group">
          <label>Marka</label>
          <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Model</label>
          <input required type="text" name="model" value={formData.model} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Data produkcji</label>
          <input required type="date" name="productionDate" value={formData.productionDate} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Liczba drzwi</label>
          <input required type="number" name="doorsNumber" value={formData.doorsNumber} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Pojemność bagażnika (L)</label>
          <input required type="number" name="trunkCapacity" value={formData.trunkCapacity} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Pojemność silnika (cm³)</label>
          <input required type="number" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Średnie spalanie (L/100km)</label>
          <input required type="number" step="0.1" name="averageFuelConsumption" value={formData.averageFuelConsumption} onChange={handleChange} className="chimera-input" />
        </div>
        <div className="chimera-form-group">
          <label>Rodzaj paliwa</label>
          <select 
            name="fuelType" 
            value={formData.fuelType} 
            onChange={handleChange} 
            className="chimera-input"
          >
            <option value={1}>Benzyna</option>
            <option value={2}>Diesel</option>
            <option value={3}>Gaz</option>
            <option value={4}>Elektryczne</option>
          </select>
        </div>

        <div className="chimera-form-group">
          <label>Typ nadwozia</label>
          <select 
            name="bodyType" 
            value={formData.bodyType} 
            onChange={handleChange} 
            className="chimera-input"
          >
            <option value={1}>Hatchback</option>
            <option value={2}>Sedan</option>
            <option value={3}>Kombi</option>
            <option value={4}>SUV</option>
          </select>
        </div>
        
        <div className="chimera-actions">
          <button type="submit" className="chimera-btn btn-primary">Aktualizuj</button>
          <button type="button" onClick={() => navigate(`/cars/${id}`)} className="chimera-btn btn-outline">Anuluj</button>
        </div>
      </form>
    </div>
  );
}