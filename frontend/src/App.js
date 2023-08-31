import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap';
import './assets/application.scss';
import LoginPage from './pages/login.js';
import NotFound from './pages/notFound.js'

const AuthContext = React.createContext(null);

function App() {
  const [auth, setAuth] = React.useState(false);
  //localStorage.clear();
  if (localStorage.getItem('token') && auth === false) {
    setAuth(true);
  }
  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path="/" element={auth ? <div>Pidor</div> : <Navigate to="/login" />} />
          <Route path="/login" element={auth ? <Navigate to="/" /> : <LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export { App, AuthContext };
