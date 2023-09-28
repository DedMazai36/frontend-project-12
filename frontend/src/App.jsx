import 'bootstrap';
import './assets/application.scss';
import React from 'react';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuthContext } from './context/AuthContext';
import routes from './routes';
import LoginPage from './components/loginPage/LoginPage';
import NotFound from './components/notFoundPage/notFound';
import MainPage from './components/mainPage/MainPage';
import SignupPage from './components/signupPage/SignupPage';

const App = () => {
  const { isAuth } = useAuthContext();
  const chatRoute = routes.chatRoute();
  const loginRoute = routes.loginRoute();
  const signupRoute = routes.signupRoute();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route
          path={chatRoute}
          element={
            isAuth ? <MainPage /> : <Navigate to={loginRoute} />
          }
        />
        <Route
          path={loginRoute}
          element={
            isAuth ? <Navigate to={chatRoute} /> : <LoginPage />
          }
        />
        <Route
          path={signupRoute}
          element={
            isAuth ? <Navigate to={chatRoute} /> : <SignupPage />
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
