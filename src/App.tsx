/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { Layout } from './components/Layout';

import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Implements from './pages/Implements';
import Settings from './pages/Settings';
import Guide from './pages/Guide';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="fuel" element={<Fuel />} />
            <Route path="implements" element={<Implements />} />
            <Route path="guide" element={<Guide />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

