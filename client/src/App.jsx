import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/Home/HomePage';
import JobsListPage from './pages/Jobs/JobsListPage';
import LoginPage from './pages/Authentication/LoginPage';
import RegisterPage from './pages/Authentication/RegisterPage';
import ForgotPasswordPage from './pages/Authentication/ForgotPasswordPage';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import WorkerDashboard from './pages/Worker/WorkerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ComplianceDashboard from './pages/Compliance/ComplianceDashboard';
import ComplianceInfoPage from './pages/Compliance/ComplianceInfoPage';
import EmployerInfoPage from './pages/Employer/EmployerInfoPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsListPage />} />
        <Route path="for-employers" element={<EmployerInfoPage />} />
        <Route path="compliance-info" element={<ComplianceInfoPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Dashboard Portals */}
        <Route
          path="employer"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYER', 'ADMIN', 'SUPER_ADMIN']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="worker"
          element={
            <ProtectedRoute allowedRoles={['WORKER', 'ADMIN', 'SUPER_ADMIN']}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="compliance"
          element={
            <ProtectedRoute allowedRoles={['COMPLIANCE_OFFICER', 'ADMIN', 'SUPER_ADMIN']}>
              <ComplianceDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-4xl font-extrabold text-white mb-2">404</h2>
              <p className="text-slate-400 mb-6">Page not found</p>
              <a
                href="/"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-trust-500 hover:bg-trust-600 text-white shadow-glow-emerald"
              >
                Return to Home
              </a>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
