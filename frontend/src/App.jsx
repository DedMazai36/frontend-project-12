import 'bootstrap';
import './assets/application.scss';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import { useAuthContext } from './context/AuthContext';
import './i18n';
import routes from './routes';
import LoginPage from './components/loginPage/LoginPage';
import NotFound from './components/notFoundPage/notFound';
import MainPage from './components/mainPage/MainPage';
import SignupPage from './components/signupPage/SignupPage';

const App = () => {
  const { auth } = useAuthContext();

  const rollbarConfig = {
    accessToken: '6ca2bbbfc6b14670a0cfe830f7a6e706',
    environment: 'testenv',
  };

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path={routes.chatRoute()} element={
              auth ? <MainPage /> : <Navigate to={routes.loginRoute()} />
            } />
            <Route path={routes.loginRoute()} element={
              auth ? <Navigate to={routes.chatRoute()} /> : <LoginPage />
            } />
            <Route path={routes.signupRoute()} element={
              auth ? <Navigate to={routes.chatRoute()} /> : <SignupPage />
            } />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
