import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';

import Admin from './components/pages/Admin';
import Cases from './components/pages/Cases';
import ScanCenters from './components/pages/Scancenters';
import Doctors from './components/pages/Doctors';
import AdminFeatures from './components/pages/AdminFeatures';
import DoctorFeatures from './components/pages/DoctorFeatures';
import MetaData from './components/pages/MetaData';
import SuperAdminLogin from './components/SuperAdminLogin';
import DashboardLayout from './components/layoutt/DashboardLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/superadmin" element={<DashboardLayout />}>
          <Route path="/superadmin/admin" element={<Admin />} />
          <Route path="/superadmin/cases" element={<Cases />} />
          <Route path="/superadmin/scancenters" element={<ScanCenters />} />
          <Route path="/superadmin/doctors" element={<Doctors />} />
          <Route path="/superadmin/adminfeatures" element={<AdminFeatures />} />
          <Route path="/superadmin/doctorfeatures" element={<DoctorFeatures />} />
          <Route path="/superadmin/metadata" element={<MetaData />} />
        </Route>

        {/* Route outside the layout */}
        <Route path="/" element={<SuperAdminLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
