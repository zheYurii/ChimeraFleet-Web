export interface Car {
    id: string;
    brand: string;
    model: string;
    doorsNumber: number;
    trunkCapacity: number;
    engineCapacity: number;
    fuelType: number;
    productionDate: string;
    averageFuelConsumption: number;
    bodyType: number;
}

export type NewCar = Omit<Car, 'id'>;

export const FuelTypeMap: Record<number, string> = {
  1: 'Benzyna',
  2: 'Diesel',
  3: 'Gaz',
  4: 'Elektryczne'
};

export const BodyTypeMap: Record<number, string> = {
  1: 'Hatchback',
  2: 'Sedan',
  3: 'Kombi',
  4: 'SUV'
};

export const toInputDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

export const toShowDate = (dateStr: string) => {
  if (!dateStr) return '';
  const dateOnly = dateStr.split('T')[0];
  const parts = dateOnly.split('-');
  
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};