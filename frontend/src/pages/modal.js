import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

const ModalAdd = ({ show, handleClose, addChannel, errors }) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addChannel.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addChannel}>
          <Form.Control
            type="name"
            id='name'
            autoFocus
            className={errors.createChannel ? 'mb-2 is-invalid' : 'mb-2'}
          />
          <label className="visually-hidden" htmlFor="name">{t('modal.addChannel.label')}</label>
          <div className="invalid-feedback">{errors.createChannel ? t('modal.addChannel.error') : ''}</div>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={handleClose}>
            {t('modal.cancel')}
            </Button>
            <Button className="btn btn-primary" type='submit'>
            {t('modal.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

const ModalRename = ({ show, handleClose, renameChannel, errors }) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameChannel.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={renameChannel}>
          <Form.Control
            type="name"
            id='name'
            autoFocus
            className={errors.renameChannel ? 'mb-2 is-invalid' : 'mb-2'}
            defaultValue={show}
          />
          <label className="visually-hidden" htmlFor="name">{t('modal.renameChannel.label')}</label>
          <div className="invalid-feedback">{errors.renameChannel ? t('modal.renameChannel.error') : ''}</div>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={handleClose}>
            {t('modal.cancel')}
            </Button>
            <Button className="btn btn-primary" type='submit'>
            {t('modal.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
};

const ModalRemove = ({ show, handleClose, removeChannel }) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.deleteChannel.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <p className="lead">{t('modal.deleteChannel.label')}</p>
        <div className="d-flex justify-content-end">
          <Button className="me-2 btn btn-secondary" onClick={handleClose}>
          {t('modal.cancel')}
          </Button>
          <Button className="btn btn-danger" onClick={() => removeChannel(show)}>
          {t('modal.delete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
};

export { ModalAdd, ModalRename, ModalRemove };
