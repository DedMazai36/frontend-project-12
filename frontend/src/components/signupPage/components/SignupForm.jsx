import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import routes from '../../../routes.js';
import { useAuthContext } from '../../../context/AuthContext.jsx';

const SignupForm = () => {
  const { setAuth, saveToken } = useAuthContext();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('yup.user', { count: 3 }))
      .max(20, t('yup.user', { count: 20 }))
      .required(t('yup.required')),
    password: Yup.string()
      .min(6, t('yup.pass', { count: 6 }))
      .required(t('yup.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('yup.confirmPassword')),
  });

  return (
    <Formik
      initialValues={{ username: '', password: '', confirmPassword: '' }}
      validationSchema={SignupSchema}
      onSubmit={({ username, password }, { setFieldError }) => {
        axios.post(routes.signupPath(), { username, password }).then((response) => {
          saveToken(response.data.token, username);
          setAuth(true);
        })
          .catch(() => {
            setFieldError('username', ' ');
            setFieldError('password', ' ');
            setFieldError('confirmPassword', t('signup.form.errorUsername'));
          });
      }}
    >
      {({ errors, touched }) => (
        <Form className="col-12 col-md-6 mt-3 mt-mb-0">
          <h1 className="text-center mb-4">{t('signup.form.header')}</h1>
          <div className="form-floating mb-3">
            <Field
              name="username"
              autoComplete="username"
              required
              placeholder={t('signup.form.userPlaceHolder')}
              id="username"
              className={clsx('form-control', errors.username && 'is-invalid')}
            />
            {errors.username && touched.username ? (
              <div className="invalid-tooltip">
                {errors.username}
              </div>
            ) : null}
            <label htmlFor="username">{t('signup.form.userPlaceHolder')}</label>
          </div>
          <div className="form-floating mb-4">
            <Field
              name="password"
              autoComplete="current-password"
              required
              placeholder={t('signup.form.passPlaceHolder')}
              type="password"
              id="password"
              className={clsx('form-control', errors.password && 'is-invalid')}
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
              required
              placeholder={t('signup.form.passSubmitPlaceHolder')}
              type="password"
              id="confirmPassword"
              className={clsx('form-control', errors.confirmPassword && 'is-invalid')}
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
};

export default SignupForm;
