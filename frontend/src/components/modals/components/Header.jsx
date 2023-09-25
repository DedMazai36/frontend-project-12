import Modal from 'react-bootstrap/Modal';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MyModalHeader = ({ type }) => {
  const { t } = useTranslation();
  const title = {
    add: t('modal.addChannel.header'),
    remove: t('modal.deleteChannel.header'),
    rename: t('modal.renameChannel.header'),
  };

  return (
    <Modal.Header closeButton>
      <Modal.Title>{title[type]}</Modal.Title>
    </Modal.Header>
  );
};

export default MyModalHeader;
