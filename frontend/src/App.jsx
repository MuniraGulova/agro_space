import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleSelectionPage from './pages/role';
import MainPage from './pages/main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/main/:role" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
