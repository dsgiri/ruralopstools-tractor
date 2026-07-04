import React, { createContext, useContext, useEffect, useState } from 'react';
import { Equipment, MaintenanceRecord, FuelRecord, ImplementComparison } from '../types';

interface AppState {
  equipment: Equipment[];
  maintenance: MaintenanceRecord[];
  fuel: FuelRecord[];
  implementComparisons: ImplementComparison[];
}

interface AppContextType extends AppState {
  addEquipment: (e: Omit<Equipment, 'id'>) => void;
  updateEquipment: (e: Equipment) => void;
  deleteEquipment: (id: string) => void;
  
  addMaintenance: (m: Omit<MaintenanceRecord, 'id'>) => void;
  deleteMaintenance: (id: string) => void;

  addFuel: (f: Omit<FuelRecord, 'id'>) => void;
  deleteFuel: (id: string) => void;
  
  addImplement: (i: Omit<ImplementComparison, 'id'>) => void;
  deleteImplement: (id: string) => void;
  importData: (data: string) => boolean;
  clearData: () => void;
}

const defaultState: AppState = {
  equipment: [],
  maintenance: [],
  fuel: [],
  implementComparisons: [],
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('tractor_app_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse or access saved data', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tractor_app_data', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  }, [state]);

  const addEquipment = (e: Omit<Equipment, 'id'>) => {
    setState(s => ({ ...s, equipment: [...s.equipment, { ...e, id: crypto.randomUUID() }] }));
  };

  const updateEquipment = (e: Equipment) => {
    setState(s => ({ ...s, equipment: s.equipment.map(eq => eq.id === e.id ? e : eq) }));
  };

  const deleteEquipment = (id: string) => {
    setState(s => ({ ...s, equipment: s.equipment.filter(eq => eq.id !== id) }));
  };

  const addMaintenance = (m: Omit<MaintenanceRecord, 'id'>) => {
    setState(s => {
      // Also update equipment hours if this maintenance has higher hours
      const eq = s.equipment.find(e => e.id === m.equipmentId);
      let newEqList = s.equipment;
      if (eq && m.hours > eq.currentHours) {
        newEqList = s.equipment.map(e => e.id === eq.id ? { ...e, currentHours: m.hours } : e);
      }
      return { 
        ...s, 
        equipment: newEqList,
        maintenance: [...s.maintenance, { ...m, id: crypto.randomUUID() }] 
      };
    });
  };

  const deleteMaintenance = (id: string) => {
    setState(s => ({ ...s, maintenance: s.maintenance.filter(m => m.id !== id) }));
  };

  const addFuel = (f: Omit<FuelRecord, 'id'>) => {
    setState(s => {
      const eq = s.equipment.find(e => e.id === f.equipmentId);
      let newEqList = s.equipment;
      if (eq && f.hours > eq.currentHours) {
        newEqList = s.equipment.map(e => e.id === eq.id ? { ...e, currentHours: f.hours } : e);
      }
      return { 
        ...s, 
        equipment: newEqList,
        fuel: [...s.fuel, { ...f, id: crypto.randomUUID() }] 
      };
    });
  };

  const deleteFuel = (id: string) => {
    setState(s => ({ ...s, fuel: s.fuel.filter(f => f.id !== id) }));
  };

  const addImplement = (i: Omit<ImplementComparison, 'id'>) => {
    setState(s => ({ ...s, implementComparisons: [...s.implementComparisons, { ...i, id: crypto.randomUUID() }] }));
  };

  const deleteImplement = (id: string) => {
    setState(s => ({ ...s, implementComparisons: s.implementComparisons.filter(i => i.id !== id) }));
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        setState({
          equipment: Array.isArray(parsed.equipment) ? parsed.equipment : [],
          maintenance: Array.isArray(parsed.maintenance) ? parsed.maintenance : [],
          fuel: Array.isArray(parsed.fuel) ? parsed.fuel : [],
          implementComparisons: Array.isArray(parsed.implementComparisons) ? parsed.implementComparisons : []
        });
        return true;
      }
    } catch (e) {
      console.error('Failed to import data', e);
    }
    return false;
  };

  const clearData = () => {
    setState(defaultState);
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addEquipment, updateEquipment, deleteEquipment,
      addMaintenance, deleteMaintenance,
      addFuel, deleteFuel,
      addImplement, deleteImplement,
      importData, clearData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
