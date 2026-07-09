import { Equipment, MaintenanceRecord, FuelRecord } from '../types';

export interface CostPerHourResult {
  estimated: number;
  actual: number | null; // null if not enough data
  isEstimated: boolean;
  breakdown: {
    fuel: number;
    repair: number;
    depreciation: number;
    tih: number;
  };
}

export function calculateCostPerHour(
  equipment: Equipment,
  maintenance: MaintenanceRecord[],
  fuel: FuelRecord[]
): CostPerHourResult {
  const hp = equipment.horsepower || 100; // default 100 if unknown
  const defaultFuelPrice = 3.50; // $3.50/gal default if no fuel logs
  const purchasePrice = equipment.purchasePrice || 0;
  const salvageValue = purchasePrice * ((equipment.salvageValuePercent || 20) / 100);
  const expectedLife = equipment.expectedLifeHours || 12000;
  const annualHours = 400; // typical ASABE assumption if we don't have usage history

  // 1. Estimated Costs (ASABE Standard)
  // Fuel: HP * 0.044 * price/gal
  const estFuelPerHour = hp * 0.044 * defaultFuelPrice;
  // Repair: (List price * repair factor / 100 hours) - ~0.84% per 100 hrs for 2WD
  const estRepairPerHour = purchasePrice > 0 ? (purchasePrice * 0.0084) : 0;
  
  // 2. Structural Costs (Depreciation & TIH)
  const depreciationPerHour = purchasePrice > 0 ? (purchasePrice - salvageValue) / expectedLife : 0;
  // TIH (Taxes, Insurance, Housing): 1% of average value per year / annual hours
  const averageValue = (purchasePrice + salvageValue) / 2;
  const tihPerHour = (averageValue * 0.01) / annualHours;

  const totalEstimated = estFuelPerHour + estRepairPerHour + depreciationPerHour + tihPerHour;

  // 3. Actual Costs (from logs)
  const eqMaintenance = maintenance.filter(m => m.equipmentId === equipment.id);
  const eqFuel = fuel.filter(f => f.equipmentId === equipment.id);

  let actualFuelPerHour: number | null = null;
  let actualRepairPerHour: number | null = null;
  let totalActual: number | null = null;

  // Need a baseline to calculate actual costs over hours.
  // We'll look at the range of hours logged. If they just started, it's hard to get a real rate.
  // Let's sum total costs and divide by total hours *during the logged period*.
  
  if (eqFuel.length > 0) {
    // If they have fuel logs, calculate average fuel price they paid to update the estimate,
    // or if they have hours tracking, calculate real fuel/hr.
    const totalFuelCost = eqFuel.reduce((sum, f) => sum + f.totalCost, 0);
    // Ideally we'd find the delta of hours between first and last fill-up, but for simplicity:
    // sum(cost) / (currentHours - hours_at_start_of_logs)
    // If we can't determine the hour delta reliably, we might fall back to average cost per gallon * est GPH
    // Let's find min and max hours in fuel logs.
    const hours = eqFuel.map(f => f.hours).filter(h => h > 0);
    if (hours.length > 1) {
      const minHour = Math.min(...hours);
      const maxHour = Math.max(...hours, equipment.currentHours);
      const hoursDiff = maxHour - minHour;
      if (hoursDiff > 0) {
        // Exclude the cost of the very first fill up in the delta if we are matching it to the hours diff, 
        // or just use total / delta for a rough actual.
        actualFuelPerHour = totalFuelCost / hoursDiff;
      }
    }
    
    // If we couldn't calculate actual based on hour diffs, use actual avg price/gal * estimated consumption
    if (actualFuelPerHour === null) {
      const totalGallons = eqFuel.reduce((sum, f) => sum + f.gallons, 0);
      if (totalGallons > 0) {
        const avgPrice = totalFuelCost / totalGallons;
        actualFuelPerHour = hp * 0.044 * avgPrice;
      }
    }
  }

  if (eqMaintenance.length > 0) {
    const totalMaintCost = eqMaintenance.reduce((sum, m) => sum + m.totalCost, 0);
    const hours = eqMaintenance.map(m => m.hours).filter(h => h > 0);
    
    // If they have maintenance logs over a span of hours
    if (hours.length > 0) {
        // Assume the maintenance costs cover from hour 0 to current hours for simplicity,
        // or from a specific baseline. To be safe, total maint / current hours is a rough lifetime repair cost.
        if (equipment.currentHours > 0) {
            actualRepairPerHour = totalMaintCost / equipment.currentHours;
        }
    }
  }

  const hasEnoughData = (eqFuel.length > 0 || eqMaintenance.length > 0);
  
  const fuelVal = actualFuelPerHour !== null ? actualFuelPerHour : estFuelPerHour;
  const repairVal = actualRepairPerHour !== null ? actualRepairPerHour : estRepairPerHour;

  if (hasEnoughData) {
    totalActual = fuelVal + repairVal + depreciationPerHour + tihPerHour;
  }

  return {
    estimated: totalEstimated,
    actual: totalActual,
    isEstimated: !hasEnoughData,
    breakdown: {
      fuel: fuelVal,
      repair: repairVal,
      depreciation: depreciationPerHour,
      tih: tihPerHour
    }
  };
}
