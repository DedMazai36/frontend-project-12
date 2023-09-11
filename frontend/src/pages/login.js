import logo from '../assets/avatar.jpg'
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AuthContext } from '../App.js';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Минимум 2 буквы')
    .max(50, 'Максимум 50 букв')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(2, 'Минимум 2 букв')
    .max(12, 'Максимум 12 букв')
    .required('Обязательное поле'),
});

function MyForm() {
  const { setAuth } = React.useContext(AuthContext);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={({ username, password }, { setFieldError }) => {
        axios.post('/api/v1/login', { username, password }).then((response) => {
          //console.log(response.data); // => { token: ..., username: 'admin' }
          const token = response.data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('login', username);
          setAuth(true);
        }).catch((e) => {
          if (e.code === "ERR_BAD_REQUEST") {
            setFieldError('validation', 'Неверные имя пользователя или пароль');
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
              placeholder="Ваш ник"
              id="username"
              className={`form-control ${errors.validation ? 'is-invalid' : ''}`}
            />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
            <label htmlFor="username">Ваш ник</label>
          </div>
          <div className="form-floating mb-4">
            <Field
              name="password"
              autoComplete="current-password"
              required=""
              placeholder="Пароль"
              type="password"
              id="password"
              className={`form-control ${errors.validation ? 'is-invalid' : ''}`}
            />
            {errors.validation ? (
              <div className="invalid-tooltip">{errors.validation}</div>
            ) : null}
            <label className="form-label" htmlFor="password">
              Пароль
            </label>
          </div>
          <button
            type="submit"
            className="w-100 mb-3 btn btn-outline-primary"
          >
            Войти
          </button>
        </Form>
      )}
    </Formik>
  );
}

function LoginPage() {
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet Chat
              </a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img className="rounded-circle" alt="Войти" src={logo} />
                    </div>
                    <MyForm />
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
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