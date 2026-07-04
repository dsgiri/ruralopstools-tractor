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
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  date: string;
  serviceType: string;
  hours: number;
  partsCost: number;
  laborCost: number;
  notes: string;
}

export interface FuelRecord {
  id: string;
  equipmentId: string;
  date: string;
  fuelAmount: number;
  fuelCost: number;
  hours: number;
  task: string;
  notes: string;
}

export interface ImplementComparison {
  id: string;
  tractorId: string;
  implementName: string;
  widthFt: number;
  fieldSizeAcres: number;
  groundSpeedMph: number;
  ptoUsage: boolean;
  fuelRateGph: number;
}
