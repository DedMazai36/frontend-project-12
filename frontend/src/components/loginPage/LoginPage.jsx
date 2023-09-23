import React from 'react';
import { useTranslation } from 'react-i18next';
import MyLoginForm from './components/LoginForm';
import logo from '../../assets/avatar.jpg';
import routes from '../../routes';
import MyNav from '../header/Header';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <MyNav />
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img className="rounded-circle" alt={t('login.form.submit')} src={logo} />
                    </div>
                    <MyLoginForm />
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{t('login.footer.question')}</span>
                      <a href={routes.signupRoute()}>{t('login.footer.href')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
