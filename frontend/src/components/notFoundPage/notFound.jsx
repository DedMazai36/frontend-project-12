import React from 'react';
import { useTranslation } from 'react-i18next';
import image from '../../assets/notFound.jpg';
import routes from '../../routes';
import MyNav from '../header/Header';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <MyNav />
          <div className="text-center">
            <img
              alt={t('notFound.error')}
              className="img-fluid h-25"
              src={image}
            />
            <h1 className="h4 text-muted">{t('notFound.error')}</h1>
            <p className="text-muted">
              {t('notFound.visit')} <a href={routes.chatRoute()}>{t('notFound.mainPage')}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;