import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminCommandDashboard from './AdminCommandDashboard.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminCommandDashboard />
  </React.StrictMode>
);
