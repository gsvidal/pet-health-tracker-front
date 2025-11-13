// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.scss';
// import { Home } from './pages/Home/Home';
// import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
import { RegisterPage } from './pages/Home/RegisterPage';
import { Home } from './pages/Home/Home';
import { Dashboard } from './features/dashboard/pages/Dashboard/Dashboard';
function App() {
  return (
    <>
      {/* // <Header /> Todo: Crear Header */}
      <main className='container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      {/* // <Footer /> Todo: Crear Footer */}
    </>
  );
}

export default App;
