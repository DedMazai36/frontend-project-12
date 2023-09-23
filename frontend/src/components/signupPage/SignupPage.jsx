import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/avatar_1.jpg';
import SignupForm from './components/SignupForm';
import MyNav from '../header/Header';

const SignupPage = () => {
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
                  <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                    <div>
                      <img
                        src={logo}
                        className="rounded-circle"
                        alt={t('signup.form.header')}
                      />
                    </div>
                    <SignupForm />
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

export default SignupPage;
