import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Label, Select, Textarea } from '../components/Input';
import { Plus, Tractor, Trash2 } from 'lucide-react';
import { EquipmentType } from '../types';
import { calculateCostPerHour } from '../lib/calculations';
import { trackEvent } from '../lib/analytics';

export default function Equipment() {
  const { equipment, maintenance, fuel, addEquipment, deleteEquipment } = useAppContext();
  const [showForm, setShowForm] = useState(false);

  // Track viewing cost per hour
  useEffect(() => {
    if (equipment.length > 0) {
      trackEvent('cost_per_hour_viewed');
      
      const hasActuals = equipment.some(eq => !calculateCostPerHour(eq, maintenance, fuel).isEstimated);
      if (hasActuals) {
        trackEvent('estimate_to_actual_transition');
      }
    }
  }, [equipment, maintenance, fuel]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">EQUIPMENT</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Manage your tractors, trucks, and implements.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-50 border-emerald-100">
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addEquipment({
                name: fd.get('name') as string,
                type: fd.get('type') as EquipmentType,
                make: fd.get('make') as string,
                model: fd.get('model') as string,
                year: parseInt(fd.get('year') as string) || new Date().getFullYear(),
                serialNumber: fd.get('serialNumber') as string,
                currentHours: parseFloat(fd.get('currentHours') as string) || 0,
                notes: fd.get('notes') as string,
                purchasePrice: parseFloat(fd.get('purchasePrice') as string) || 0,
                purchaseDate: fd.get('purchaseDate') as string,
                horsepower: fd.get('horsepower') ? parseFloat(fd.get('horsepower') as string) : undefined,
                expectedLifeHours: parseFloat(fd.get('expectedLifeHours') as string) || 12000,
                salvageValuePercent: parseFloat(fd.get('salvageValuePercent') as string) || 20,
                serviceIntervalHours: fd.get('serviceIntervalHours') ? parseFloat(fd.get('serviceIntervalHours') as string) : undefined,
              });
              trackEvent('equipment_added', { type: fd.get('type') as string });
              setShowForm(false);
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Machine Name (e.g. Big Green)</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select id="type" name="type" required>
                    <option value="Tractor">Tractor</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Truck">Truck</option>
                    <option value="Implement">Implement</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" name="make" />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="number" />
                </div>
                <div>
                  <Label htmlFor="serialNumber">Serial Number / VIN</Label>
                  <Input id="serialNumber" name="serialNumber" />
                </div>
                <div>
                  <Label htmlFor="currentHours">Current Hours / Miles</Label>
                  <Input id="currentHours" name="currentHours" type="number" step="0.1" required />
                </div>
                <div>
                  <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                  <Input id="purchasePrice" name="purchasePrice" type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input id="purchaseDate" name="purchaseDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="horsepower">Horsepower (PTO)</Label>
                  <Input id="horsepower" name="horsepower" type="number" step="0.1" placeholder="For fuel estimate" />
                </div>
                <div>
                  <Label htmlFor="expectedLifeHours">Expected Life (Hours)</Label>
                  <Input id="expectedLifeHours" name="expectedLifeHours" type="number" step="1" defaultValue="12000" />
                </div>
                <div>
                  <Label htmlFor="salvageValuePercent">Salvage Value %</Label>
                  <Input id="salvageValuePercent" name="salvageValuePercent" type="number" step="1" defaultValue="20" placeholder="e.g. 20" />
                </div>
                <div>
                  <Label htmlFor="serviceIntervalHours">Service Interval (Hours)</Label>
                  <Input id="serviceIntervalHours" name="serviceIntervalHours" type="number" step="1" placeholder="e.g. 100" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Save Equipment</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map(eq => {
          const costData = calculateCostPerHour(eq, maintenance, fuel);
          return (
          <Card key={eq.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">{eq.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{eq.year} {eq.make} {eq.model}</p>
                </div>
                <button 
                  onClick={() => deleteEquipment(eq.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-lg mb-4">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">
                    ${(costData.isEstimated ? costData.estimated : costData.actual!)?.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cost Per Hour</span>
                  <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${costData.isEstimated ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {costData.isEstimated ? 'Estimated' : 'Based on logged data'}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hours</span>
                    <span className="font-mono text-slate-700">{eq.currentHours}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="font-medium text-slate-700">{eq.type}</span>
                  </div>
                  {eq.serialNumber && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SN</span>
                      <span className="font-mono text-xs text-slate-500">{eq.serialNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
        {equipment.length === 0 && !showForm && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300 text-sm">
            No equipment added yet. Click "Add Equipment" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
