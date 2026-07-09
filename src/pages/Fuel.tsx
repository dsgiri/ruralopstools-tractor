import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Label, Select, Textarea } from '../components/Input';
import { formatCurrency, formatNumber } from '../lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function Fuel() {
  const { fuel, equipment, addFuel, deleteFuel } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [gallons, setGallons] = useState(0);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(gallons * price);
  }, [gallons, price]);

  const sortedFuel = [...fuel].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">DIESEL LOG</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Track fuel consumption and calculate burn rates.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Fuel
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-50 border-blue-100">
          <CardHeader>
            <CardTitle>Log Diesel Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addFuel({
                equipmentId: fd.get('equipmentId') as string,
                date: fd.get('date') as string,
                gallons: parseFloat(fd.get('gallons') as string) || 0,
                pricePerGallon: parseFloat(fd.get('pricePerGallon') as string) || 0,
                totalCost: parseFloat(fd.get('totalCost') as string) || 0,
                hours: parseFloat(fd.get('hours') as string) || 0,
                task: fd.get('task') as string,
                notes: fd.get('notes') as string,
              });
              trackEvent('fuel_logged');
              setShowForm(false);
              setGallons(0);
              setPrice(0);
              setTotal(0);
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label htmlFor="equipmentId">Equipment</Label>
                  <Select id="equipmentId" name="equipmentId" required>
                    <option value="">Select Equipment...</option>
                    {equipment.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gallons">Gallons Filled</Label>
                  <Input id="gallons" name="gallons" type="number" step="0.1" required value={gallons || ''} onChange={e => setGallons(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label htmlFor="pricePerGallon">Price / Gallon ($)</Label>
                  <Input id="pricePerGallon" name="pricePerGallon" type="number" step="0.01" required value={price || ''} onChange={e => setPrice(parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label htmlFor="totalCost">Total Cost ($)</Label>
                  <Input id="totalCost" name="totalCost" type="number" step="0.01" value={total || ''} onChange={e => setTotal(parseFloat(e.target.value) || 0)} required />
                </div>
                <div>
                  <Label htmlFor="hours">Hour Meter</Label>
                  <Input id="hours" name="hours" type="number" step="0.1" required />
                </div>
                <div>
                  <Label htmlFor="task">Task / Field</Label>
                  <Input id="task" name="task" placeholder="e.g. Discing North 40" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Save Record</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Equipment</th>
                  <th className="px-6 py-3 font-semibold">Gallons</th>
                  <th className="px-6 py-3 font-semibold">Price/Gal</th>
                  <th className="px-6 py-3 font-semibold">Total Cost</th>
                  <th className="px-6 py-3 font-semibold">Task</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {sortedFuel.map((f, index) => {
                  const eq = equipment.find(e => e.id === f.equipmentId);
                  return (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">{new Date(f.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{eq?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 font-mono text-slate-700">{f.gallons || f.fuelAmount}</td>
                      <td className="px-6 py-4 font-mono text-slate-700">{formatCurrency(f.pricePerGallon || 0)}</td>
                      <td className="px-6 py-4 font-mono text-slate-700">{formatCurrency(f.totalCost || f.fuelCost)}</td>
                      <td className="px-6 py-4 text-slate-500">{f.task || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteFuel(f.id)} className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {fuel.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                      No fuel records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
