import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap';
import './assets/application.scss';
import LoginPage from './pages/login.js';
import NotFound from './pages/notFound.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
