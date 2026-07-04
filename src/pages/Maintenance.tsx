import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Label, Select, Textarea } from '../components/Input';
import { formatCurrency } from '../lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export default function Maintenance() {
  const { maintenance, equipment, addMaintenance, deleteMaintenance } = useAppContext();
  const [showForm, setShowForm] = useState(false);

  // Sort descending by date
  const sortedMaintenance = [...maintenance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">MAINTENANCE LOG</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Track service, parts, and labor costs.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Service
        </Button>
      </div>

      {showForm && (
        <Card className="bg-slate-50 border-orange-100">
          <CardHeader>
            <CardTitle>Log New Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              addMaintenance({
                equipmentId: fd.get('equipmentId') as string,
                date: fd.get('date') as string,
                serviceType: fd.get('serviceType') as string,
                hours: parseFloat(fd.get('hours') as string) || 0,
                partsCost: parseFloat(fd.get('partsCost') as string) || 0,
                laborCost: parseFloat(fd.get('laborCost') as string) || 0,
                notes: fd.get('notes') as string,
              });
              setShowForm(false);
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Input id="serviceType" name="serviceType" placeholder="e.g. Oil Change, Filter, Repair" required />
                </div>
                <div>
                  <Label htmlFor="hours">Hour Meter at Service</Label>
                  <Input id="hours" name="hours" type="number" step="0.1" required />
                </div>
                <div>
                  <Label htmlFor="partsCost">Parts Cost ($)</Label>
                  <Input id="partsCost" name="partsCost" type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="laborCost">Labor Cost ($)</Label>
                  <Input id="laborCost" name="laborCost" type="number" step="0.01" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes / Details</Label>
                <Textarea id="notes" name="notes" />
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
                  <th className="px-6 py-3 font-semibold">Service</th>
                  <th className="px-6 py-3 font-semibold">Hours</th>
                  <th className="px-6 py-3 font-semibold text-right">Total Cost</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {sortedMaintenance.map(m => {
                  const eq = equipment.find(e => e.id === m.equipmentId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{eq?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-slate-600">{m.serviceType}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{m.hours}</td>
                      <td className="px-6 py-4 font-mono text-right font-medium">{formatCurrency(m.partsCost + m.laborCost)}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteMaintenance(m.id)} className="text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {maintenance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                      No maintenance records found.
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
