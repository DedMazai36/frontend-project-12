import React from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../App.js';
import logo from '../assets/avatar_1.jpg';
import { useTranslation } from 'react-i18next';


const LoginForm = () => {
  const { setAuth } = React.useContext(AuthContext);
  const { t } = useTranslation();
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('yup.min', {count: 3}))
      .max(20, t('yup.max', {count: 20}))
      .required(t('yup.required')),
    password: Yup.string()
      .min(6, t('yup.min', {count: 6}))
      .required(t('yup.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t('yup.confirmPassword')),
  });

  return (
    <Formik
      initialValues={{ username: "", password: "", confirmPassword: "" }}
      validationSchema={SignupSchema}
      onSubmit={({ username, password }, { setFieldError }) => {
        axios.post('/api/v1/signup', { username, password }).then((response) => {
          //console.log(response.data); // => { token: ..., username: 'admin' }
          const token = response.data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('login', username);
          setAuth(true);
        })
          .catch(() => {
            setFieldError('username', ' ');
            setFieldError('password', ' ');
            setFieldError('confirmPassword', t('signup.form.errorUsername'));
          })
      }}
    >
      {({ errors, touched }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">{t('signup.form.header')}</h1>
          <div className="form-floating mb-3">
            <Field
              name="username"
              autoComplete="username"
              required=""
              placeholder={t('signup.form.userPlaceHolder')}
              id="username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            />
            {errors.username && touched.username ? (
              <div className="invalid-tooltip"> {errors.username}</div>
            ) : null}
            <label htmlFor="username">{t('signup.form.userPlaceHolder')}</label>
          </div>
          <div className="form-floating mb-4">
            <Field
              name="password"
              autoComplete="current-password"
              required=""
              placeholder={t('signup.form.passPlaceHolder')}
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password ? (
              <div className="invalid-tooltip">{errors.password}</div>
            ) : null}
            <label className="form-label" htmlFor="password">
            {t('signup.form.passPlaceHolder')}
            </label>
          </div>
          <div className="form-floating mb-4">
            <Field
              name="confirmPassword"
              autoComplete="current-password"
              required=""
              placeholder={t('signup.form.passSubmitPlaceHolder')}
              type="password"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            />
            {errors.confirmPassword ? (
              <div className="invalid-tooltip">{errors.confirmPassword}</div>
            ) : null}
            <label className="form-label" htmlFor="confirmPassword">
            {t('signup.form.passSubmitPlaceHolder')}
            </label>
          </div>
          <button
            type="submit"
            className="w-100 mb-3 btn btn-outline-primary"
          >
            {t('signup.form.submit')}
          </button>
        </Form>
      )}
    </Formik>
  );
}

const SignupPage = () => {
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
                  <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                    <div>
                      <img
                        src={logo}
                        className="rounded-circle"
                        alt={t('signup.form.header')}
                      />
                    </div>
                    <LoginForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>


  )
};

export { SignupPage };
