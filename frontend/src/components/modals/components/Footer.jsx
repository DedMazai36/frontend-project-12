import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../store/slices/modalSlice';

const Footer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <div className="d-flex justify-content-end">
      <Button className="me-2 btn btn-secondary" onClick={() => dispatch(closeModal())}>
        {t('modal.cancel')}
      </Button>
      <Button className="btn btn-primary" type="submit">
        {t('modal.send')}
      </Button>
    </div>
  );
};

export default Footer;
