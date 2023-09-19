import logo from '../assets/avatar.jpg'
import React from 'react';
import { Formik, Form, Field } from 'formik';
//import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../App.js';
import { useTranslation } from 'react-i18next';



const LoginForm = () => {
  const { setAuth } = React.useContext(AuthContext);
  const { t } = useTranslation();
  /*
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, t('yup.min', {count: 2}))
      .max(12, t('yup.max', {count: 12}))
      .required(t('yup.required')),
    password: Yup.string()
      .min(2, t('yup.min', {count: 2}))
      .max(12, t('yup.max', {count: 12}))
      .required(t('yup.required')),
  });
*/
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      //validationSchema={SignupSchema}
      onSubmit={({ username, password }, { setFieldError }) => {
        axios.post('/api/v1/login', { username, password }).then((response) => {
          //console.log(response.data); // => { token: ..., username: 'admin' }
          const token = response.data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('login', username);
          setAuth(true);
        }).catch((e) => {
          if (e.code === "ERR_BAD_REQUEST") {
            setFieldError('username', ' ');
            setFieldError('password', 'Неверные имя пользователя или пароль');
          }
        })
      }}
    >
      {({ errors, touched }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">Войти</h1>
          <div className="form-floating mb-3">
            <Field
              name="username"
              autoComplete="username"
              required=""
              placeholder={t('login.form.userPlaxeHolder')}
              id="username"
              autoFocus
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            />
            {errors.username && touched.username ? (
              <div className="invalid-tooltip">{errors.username}</div>
            ) : null}
            <label htmlFor="username">{t('login.form.userPlaceHolder')}</label>
          </div>
          <div className="form-floating mb-4">
            <Field
              name="password"
              autoComplete="current-password"
              required=""
              placeholder={t('login.form.passPlaceHolder')}
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password ? (
              <div className="invalid-tooltip">{errors.password}</div>
            ) : null}
            <label className="form-label" htmlFor="password">
            {t('login.form.passPlaceHolder')}
            </label>
          </div>
          <button
            type="submit"
            className="w-100 mb-3 btn btn-outline-primary"
          >
            {t('login.form.submit')}
          </button>
        </Form>
      )}
    </Formik>
  );
}

function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
              {t('header.hexlet')}
              </a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img className="rounded-circle" alt={t('login.form.submit')} src={logo} />
                    </div>
                    <LoginForm />
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{t('login.footer.question')}</span> <a href="/signup">{t('login.footer.href')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
}

export default LoginPage;