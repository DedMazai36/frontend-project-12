import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../store/slices/modalSlice';
import _ from 'lodash';
import { useState } from 'react';
import { addChannel, clearStatus } from '../../store/slices/emitSlice';
import { selectors } from '../../store/slices/channelsSlice';
import { toast } from 'react-toastify';

const ModalAdd = () => {
  const { t } = useTranslation();
  const channels = useSelector(selectors.selectAll);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    const inputValue = event.target[0].value;
    const channelsNames = channels.map((channel) => channel.name);
    const isUnique = !_.includes(channelsNames, inputValue);
    if (isUnique) {
      setError(null);
      dispatch(addChannel(inputValue));
      dispatch(closeModal());
      toast.success(t('toast.success.addChannel'));
      dispatch(clearStatus());
    } else {
      setError('error');
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addChannel.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Control
            type="name"
            id='name'
            autoFocus
            className={error ? 'mb-2 is-invalid' : 'mb-2'}
          />
          <label className="visually-hidden" htmlFor="name">{t('modal.addChannel.label')}</label>
          <div className="invalid-feedback">{error ? t('modal.addChannel.error') : ''}</div>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={() => dispatch(closeModal())}>
              {t('modal.cancel')}
            </Button>
            <Button className="btn btn-primary" type='submit'>
              {t('modal.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  )
};

export default ModalAdd;
