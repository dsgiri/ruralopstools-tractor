import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Wrench, Droplet, Clock, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { equipment, maintenance, fuel } = useAppContext();

  // Simple stats
  const totalEquipment = equipment.length;
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + (m.totalCost !== undefined ? m.totalCost : m.partsCost + m.laborCost), 0);
  const totalFuelCost = fuel.reduce((sum, f) => sum + (f.totalCost !== undefined ? f.totalCost : f.fuelCost), 0);
  
  // Needs service logic (hours-based)
  // Flag equipment in "Needs Attention" when within a threshold (e.g. 10 hours) of its next service interval
  const needsService = equipment.map(e => {
    const interval = e.serviceIntervalHours || 100; // default 100 hours if not set
    const lastService = maintenance.filter(m => m.equipmentId === e.id).sort((a,b) => b.hours - a.hours)[0];
    
    // If never serviced, we assume service is due if current hours >= interval
    let hoursSinceLast = e.currentHours; 
    let nextServiceHour = interval;

    if (lastService) {
      hoursSinceLast = e.currentHours - lastService.hours;
      nextServiceHour = lastService.hours + interval;
    }

    const hoursUntilService = nextServiceHour - e.currentHours;
    
    return {
      ...e,
      hoursSinceLast,
      nextServiceHour,
      hoursUntilService,
      isDue: hoursUntilService <= 10
    };
  }).filter(e => e.isDue);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Summary Headline Row */}
      <section className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col justify-center">
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-950">Track tractor maintenance, fuel, and implement performance.</h2>
        <p className="text-emerald-800 opacity-80 mt-1">Simple tools for rural equipment logs, diesel use, and field efficiency.</p>
      </section>

      {/* Key Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Active Equipment</span>
          <div className="text-3xl font-light text-slate-800 mt-1">{totalEquipment} <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Units</span></div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5" /> Fuel Cost (YTD)</span>
          <div className="text-3xl font-light text-slate-800 mt-1">{formatCurrency(totalFuelCost).split('.')[0]}<span className="text-lg text-slate-500">.{formatCurrency(totalFuelCost).split('.')[1]}</span></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Maint. Spend</span>
          <div className="text-3xl font-light text-slate-800 mt-1">{formatCurrency(totalMaintenanceCost).split('.')[0]}<span className="text-lg text-slate-500">.{formatCurrency(totalMaintenanceCost).split('.')[1]}</span></div>
        </div>

        <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm ${needsService.length > 0 ? 'border-l-4 border-l-amber-500' : ''}`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${needsService.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
            <AlertTriangle className="w-3.5 h-3.5" /> Service Reminders
          </span>
          <div className="text-3xl font-light text-slate-800 mt-1">{needsService.length} <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">Overdue</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <Link to="/maintenance" className="text-xs text-emerald-700 font-semibold hover:underline">View All</Link>
          </CardHeader>
          <CardContent className="p-0 flex flex-col min-h-[300px]">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Machine</th>
                    <th className="px-5 py-3 font-semibold text-right">Service Due</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {needsService.map(e => (
                    <tr key={e.id}>
                      <td className="px-5 py-3 font-semibold text-amber-700">{e.name}</td>
                      <td className="px-5 py-3 text-right font-mono text-amber-700">
                        {e.hoursUntilService <= 0 ? 'OVERDUE' : `In ${e.hoursUntilService.toFixed(1)} hrs`}
                      </td>
                    </tr>
                  ))}
                  {needsService.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-5 py-8 text-center text-slate-500">
                        All equipment is up to date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 text-[11px] text-slate-400 italic text-center border-t border-slate-100 mt-auto">
              Logging equipment service helps maintain resale value and insurance compliance.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <Link to="/maintenance" className="text-xs text-emerald-700 font-semibold hover:underline">View All</Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Activity</th>
                    <th className="px-5 py-3 font-semibold">Details</th>
                    <th className="px-5 py-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {/* Mix fuel and maintenance logs */}
                  {[...maintenance.map(m => ({ ...m, _type: 'maint' })), ...fuel.map(f => ({ ...f, _type: 'fuel' }))]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 7)
                    .map((item, i) => (
                      <tr key={i}>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${item._type === 'maint' ? 'text-amber-600' : 'text-blue-600'}`}>
                            {item._type === 'maint' ? <Wrench className="w-3.5 h-3.5" /> : <Droplet className="w-3.5 h-3.5" />}
                            {item._type === 'maint' ? 'Service' : 'Fuel'}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-700">
                          {equipment.find(e => e.id === item.equipmentId)?.name || 'Unknown'}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-slate-500">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  {maintenance.length === 0 && fuel.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-slate-500">
                        No recent activity.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
