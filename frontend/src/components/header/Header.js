import React from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../context/AuthContext";
import routes from "../../routes";

const MyNav = () => {
  const { t } = useTranslation();
  const setAuth = useAuthContext().setAuth;
  const auth = useAuthContext().auth;

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href={routes.chatRoute()}>
          {t('header.hexlet')}
        </a>
        {
          auth ?
            <button type="button" className="btn btn-primary" onClick={() => { localStorage.clear(); setAuth(false) }}>
              {t('header.escape')}
            </button>
            :
            null
        }
      </div>
    </nav>
  )
};

export default MyNav;
