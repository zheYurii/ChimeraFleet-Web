import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createCar } from '../services/carService';
import type { NewCar } from '../models/Car';

export default function CreateCarPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewCar>({
    brand: '', model: '', doorsNumber: 5, trunkCapacity: 0,
    engineCapacity: 0, fuelType: 1, productionDate: '',
    averageFuelConsumption: 0, bodyType: 1
  });

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
    try {
      await createCar(formData);
      navigate('/cars');
    } catch (err: any) {
      alert(`Błąd zapisu: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="teto-text">Rejestracja Nowego Pojazdu</h1>
      <form onSubmit={handleSubmit} className="chimera-form">
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
        
        <button type="submit" className="chimera-btn btn-primary">Zainicjuj Pojazd</button>
      </form>
    </div>
  );
}