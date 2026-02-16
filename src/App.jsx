
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { StudentsLayout } from './layouts/StudentsLayout';
import { RegistrationLayout } from './layouts/RegistrationLayout';
import { Showcase } from './pages/Showcase';
import { DashboardHome } from './pages/DashboardHome';
import { StudentsHome } from './pages/students/StudentsHome';
import { StudentsOrganization } from './pages/students/StudentsOrganization';
import { RegistrationOverview } from './pages/registration/RegistrationOverview';
import { RegistrationRequests } from './pages/registration/RegistrationRequests';
import { RegistrationMeetings } from './pages/registration/RegistrationMeetings';
import { RegistrationCommissions } from './pages/registration/RegistrationCommissions';
import { RegistrationFinalization } from './pages/registration/RegistrationFinalization';
import { TeachersLayout } from './layouts/TeachersLayout';
import { TeachersOverview } from './pages/teachers/TeachersOverview';
import { TeachersManagement } from './pages/teachers/TeachersManagement';
import './styles/global.scss';

// Placeholder component for pages under construction
const PlaceholderPage = ({ title }) => (
  <div style={{
    padding: '3rem',
    textAlign: 'center',
    background: 'var(--glass-bg)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)'
  }}>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h2>
    <p style={{ color: 'var(--text-secondary)' }}>هذه الصفحة قيد الإنشاء</p>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="showcase" element={<Showcase />} />

          {/* Management Units */}
          <Route path="teachers" element={<TeachersLayout />}>
            <Route index element={<TeachersOverview />} />
            <Route path="list" element={<TeachersManagement />} />
          </Route>
          <Route path="students" element={<StudentsLayout />}>
            <Route index element={<StudentsHome />} />
            <Route path="organization" element={<StudentsOrganization />} />
          </Route>
          <Route path="registration" element={<RegistrationLayout />}>
            <Route index element={<RegistrationOverview />} />
            <Route path="requests" element={<RegistrationRequests />} />
            <Route path="meetings" element={<RegistrationMeetings />} />
            <Route path="commissions" element={<RegistrationCommissions />} />
            <Route path="finalization" element={<RegistrationFinalization />} />
          </Route>
          <Route path="academic" element={<PlaceholderPage title="إدارة أكادمية" />} />
          <Route path="hub" element={<PlaceholderPage title="التقويم و الإعلانات" />} />

          {/* Fallback */}
          <Route path="*" element={<PlaceholderPage title="صفحة غير موجودة" />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;

