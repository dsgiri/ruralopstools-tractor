import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Tractor, Wrench, Droplet, LayoutDashboard, Menu, Tally3, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { GDPRNotice } from './GDPRNotice';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Equipment', href: '/equipment', icon: Tractor },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Fuel Log', href: '/fuel', icon: Droplet },
  { name: 'Implements', href: '/implements', icon: Tally3 },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="w-full h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4 sm:gap-6 h-full">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-emerald-800 uppercase leading-tight">RuralOpsTools</span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none text-slate-800">TRACTOR</h1>
          </div>
          <nav className="hidden md:flex gap-6 ml-4 sm:ml-8 h-full items-end">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "text-sm pb-4 pt-1 transition-colors border-b-2",
                  isActive 
                    ? "font-semibold text-emerald-700 border-emerald-700" 
                    : "font-medium text-slate-500 hover:text-slate-800 border-transparent"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="md:hidden text-slate-500 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="w-full h-10 bg-white border-t border-slate-200 px-8 hidden sm:flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-slate-400">
          <span className="uppercase font-bold tracking-tighter">SYSTEM STATUS: OK</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>LAST SYNC: JUST NOW</span>
        </div>
        <div className="text-[10px] text-slate-400">
          &copy; {new Date().getFullYear()} RuralOpsTools. Practical, minimal equipment logging.
        </div>
      </footer>
      <GDPRNotice />
    </div>
  );
}
