import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Card, CardHeader, CardContent } from '../components/Card';
import { Button } from '../components/Button';

export default function Settings() {
  const { equipment, maintenance, fuel, implementComparisons, importData, clearData } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleExport = () => {
    try {
      const data = {
        equipment,
        maintenance,
        fuel,
        implementComparisons
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tractor-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Data exported successfully.' });
    } catch (e) {
      console.error(e);
      setStatusMessage({ type: 'error', text: 'Failed to export data.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importData(content);
        if (success) {
          setStatusMessage({ type: 'success', text: 'Data imported successfully.' });
        } else {
          setStatusMessage({ type: 'error', text: 'Invalid backup file format.' });
        }
      }
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      setStatusMessage({ type: 'error', text: 'Failed to read file.' });
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all data? This cannot be undone unless you have a backup.')) {
      clearData();
      setStatusMessage({ type: 'success', text: 'All data has been cleared.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings & Data</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your local storage data and backups.</p>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-md flex items-center gap-3 ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p className="text-sm font-medium">{statusMessage.text}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">Data Backup</h3>
              <p className="text-xs text-slate-500 mt-0.5">Download your data to a JSON file to keep it safe or move it to another device.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-sm text-slate-600">
              This will export all equipment, maintenance logs, fuel logs, and implement comparisons.
            </p>
            <Button onClick={handleExport} className="shrink-0">
              <Download className="w-4 h-4 mr-2" />
              Export JSON Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">Restore Data</h3>
              <p className="text-xs text-slate-500 mt-0.5">Upload a previously exported JSON backup file. This will overwrite your current data.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-sm text-slate-600">
              Select a valid tractor backup JSON file.
            </p>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="shrink-0">
              <Upload className="w-4 h-4 mr-2" />
              Import Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">Danger Zone</h3>
              <p className="text-xs text-slate-500 mt-0.5">Permanently delete all your local storage data.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <p className="text-sm text-slate-600">
              Once you delete this data, there is no going back unless you have a backup.
            </p>
            <Button onClick={handleClear} variant="danger" className="shrink-0">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
