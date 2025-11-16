// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import { Home } from './pages/Home/Home';
import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
import { RegisterPage } from './features/dashboard/pages/Register/RegisterPage';
import { MainLayout } from './layouts/MainLayout';
import { FullLayout } from './layouts/FullLayout';
import { RecoverPasswordPage } from './features/dashboard/pages/RecoverPassword/RecoverPasswordPage';

function App() {
  return (
    <Routes>
      {/* // <Header /> Todo: Crear Header */}

      {/* Layout principal (con clase container) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Layout fullscreen (sin clase container) */}
      <Route element={<FullLayout />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
      </Route>

      {/* // <Footer /> Todo: Crear Footer */}
    </Routes>
  );
}

export default App;
