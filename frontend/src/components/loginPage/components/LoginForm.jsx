import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import routes from '../../../routes.js';
import { useAuthContext } from '../../../context/AuthContext.jsx';

export const LoginForm = () => {
  const { t } = useTranslation();
  const { setAuth } = useAuthContext();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={({ username, password }, { setFieldError }) => {
        axios.post(routes.loginPath(), { username, password }).then((response) => {
          const { token } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('login', username);
          setAuth(true);
        }).catch((e) => {
          if (e.code === 'ERR_BAD_REQUEST') {
            setFieldError('username', ' ');
            setFieldError('password', t('login.form.error'));
          }
        });
      }}
    >
      {({ errors, touched }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">{t('login.form.submit')}</h1>
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
};

export default LoginForm;
