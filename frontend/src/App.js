import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap';
import './assets/application.scss';
import LoginPage from './pages/login.js';
import NotFound from './pages/notFound.js'
import MainPage from './pages/main.js';
import { SignupPage } from './pages/signup';
import './i18n';
import { Provider, ErrorBoundary } from '@rollbar/react';

const AuthContext = React.createContext(null);
//console.log(3)

function App() {
  const [auth, setAuth] = React.useState(localStorage.getItem('token') ? true : false);
  //localStorage.clear();
  console.log(auth);

  const rollbarConfig = {
    accessToken: '6ca2bbbfc6b14670a0cfe830f7a6e706',
    environment: 'testenv',
  };

  /*
  const socket = io();
  
  socket.emit('newMessage', ['Privet'], (response) => {
    console.log(response.status)
  });
  socket.on('newMessage', function(msg) {
    console.log(msg)
  })
*/
  //socket.emit('newMessage','Hello, my name is Client');

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <BrowserRouter>
            <Routes>
              <Route path='*' element={<NotFound />} />
              <Route path="/" element={auth ? <MainPage /> : <Navigate to="/login" />} />
              <Route path="/login" element={auth ? <Navigate to="/" /> : <LoginPage />} />
              <Route path='/signup' element={auth ? <Navigate to="/" /> : <SignupPage />} />
            </Routes>
          </BrowserRouter>
        </AuthContext.Provider>
      </ErrorBoundary>
    </Provider>
  );
}

export { App, AuthContext };
