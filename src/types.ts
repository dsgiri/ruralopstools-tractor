export type EquipmentType = 'Tractor' | 'Harvester' | 'Truck' | 'Implement' | 'Other';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  make: string;
  model: string;
  year: number;
  serialNumber: string;
  currentHours: number;
  notes: string;
  photoUrl?: string;
  
  // New fields for cost calculations
  purchasePrice: number;
  purchaseDate?: string;
  horsepower?: number;
  expectedLifeHours: number;
  salvageValuePercent: number; // e.g., 20 for 20%
  serviceIntervalHours?: number; // e.g., 100
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  serviceType: string;
  hours: number;
  partsCost: number;
  laborCost: number;
  totalCost: number; // Usually partsCost + laborCost, but allow override
  notes: string;
}

export interface FuelRecord {
  id: string;
  equipmentId: string;
  date: string;
  gallons: number; // fuelAmount
  pricePerGallon: number;
  totalCost: number; // gallons * pricePerGallon
  hours: number;
  task: string;
  notes: string;
}

export interface ImplementComparison {
  id: string;
  name: string; // Used to be implementName
  purchasePrice: number;
  expectedLifeHours: number;
  salvageValuePercent: number;
  widthFt: number;
  fieldSizeAcres?: number;
  groundSpeedMph?: number;
  ptoUsage?: boolean;
  fuelRateGph?: number;
}
