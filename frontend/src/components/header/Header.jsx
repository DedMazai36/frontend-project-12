import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthContext';
import routes from '../../routes';

const MyNav = () => {
  const { t } = useTranslation();
  const { unlogin, isAuth } = useAuthContext();

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={routes.chatRoute()}>
          {t('header.hexlet')}
        </Link>
        {
          isAuth ? (
            <button type="button" className="btn btn-primary" onClick={unlogin}>
              {t('header.escape')}
            </button>
          ) : null
        }
      </div>
    </nav>
  );
};

export default MyNav;
