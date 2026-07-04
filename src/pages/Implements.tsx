import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Label, Select } from '../components/Input';
import { formatNumber } from '../lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export default function Implements() {
  const { implementComparisons, equipment, addImplement, deleteImplement } = useAppContext();
  const [showForm, setShowForm] = useState(false);

  const calculateAcresPerHour = (width: number, speed: number) => {
    return (width * speed) / 10;
  };

  const calculateTotalTime = (fieldSize: number, acresPerHour: number) => {
    if (acresPerHour <= 0) return 0;
    return fieldSize / acresPerHour;
  };

  const calculateTotalFuel = (totalTime: number, fuelRate: number) => {
    return totalTime * fuelRate;
  };

  const tractors = equipment.filter(e => e.type === 'Tractor');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">IMPLEMENT OPTIMIZATION</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Estimate time and fuel burn for different setups.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Scenario
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Calculate Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addImplement({
                tractorId: fd.get('tractorId') as string,
                implementName: fd.get('implementName') as string,
                widthFt: parseFloat(fd.get('widthFt') as string) || 0,
                fieldSizeAcres: parseFloat(fd.get('fieldSizeAcres') as string) || 0,
                groundSpeedMph: parseFloat(fd.get('groundSpeedMph') as string) || 0,
                ptoUsage: fd.get('ptoUsage') === 'true',
                fuelRateGph: parseFloat(fd.get('fuelRateGph') as string) || 0,
              });
              setShowForm(false);
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="tractorId">Tractor</Label>
                  <Select id="tractorId" name="tractorId" required>
                    <option value="">Select Tractor...</option>
                    {tractors.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="implementName">Implement / Task</Label>
                  <Input id="implementName" name="implementName" placeholder="e.g. 24ft Disk" required />
                </div>
                <div>
                  <Label htmlFor="widthFt">Width (ft)</Label>
                  <Input id="widthFt" name="widthFt" type="number" step="0.1" required />
                </div>
                <div>
                  <Label htmlFor="fieldSizeAcres">Field Size (Acres)</Label>
                  <Input id="fieldSizeAcres" name="fieldSizeAcres" type="number" step="0.1" required />
                </div>
                <div>
                  <Label htmlFor="groundSpeedMph">Ground Speed (mph)</Label>
                  <Input id="groundSpeedMph" name="groundSpeedMph" type="number" step="0.1" required />
                </div>
                <div>
                  <Label htmlFor="fuelRateGph">Est. Fuel Burn (gal/hr)</Label>
                  <Input id="fuelRateGph" name="fuelRateGph" type="number" step="0.1" required />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="ptoUsage" name="ptoUsage" value="true" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <Label htmlFor="ptoUsage" className="mb-0 mt-[1px]">Requires PTO</Label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Save & Calculate</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {implementComparisons.map(imp => {
          const tractor = equipment.find(e => e.id === imp.tractorId);
          const acresPerHour = calculateAcresPerHour(imp.widthFt, imp.groundSpeedMph);
          const totalTime = calculateTotalTime(imp.fieldSizeAcres, acresPerHour);
          const totalFuel = calculateTotalFuel(totalTime, imp.fuelRateGph);
          
          return (
            <div key={imp.id} className="bg-slate-800 text-white rounded-xl shadow-sm flex flex-col p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{imp.implementName}</h3>
                </div>
                <button onClick={() => deleteImplement(imp.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Machine</label>
                  <div className="bg-slate-700 px-4 py-2.5 rounded text-sm text-slate-200">
                    {tractor?.name || 'Unknown Tractor'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Field</label>
                    <div className="text-sm font-mono text-slate-300">{imp.fieldSizeAcres} ac</div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Setup</label>
                    <div className="text-sm font-mono text-slate-300">{imp.widthFt}ft @ {imp.groundSpeedMph}mph</div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-[10px] text-emerald-400 uppercase font-bold mb-2">Estimated Performance</div>
                    <div className="text-4xl font-light mb-2">{formatNumber(acresPerHour)}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-6">Acres Per Hour</div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-700">
                    <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Est. Time</span>
                    <span className="font-mono text-slate-200">{formatNumber(totalTime)} hrs</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-3">
                    <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Est. Fuel</span>
                    <span className="font-mono text-emerald-400">{formatNumber(totalFuel)} gal</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {implementComparisons.length === 0 && !showForm && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300 text-sm">
            No scenarios created. Create one to compare implement efficiency.
          </div>
        )}
      </div>
    </div>
  );
}
