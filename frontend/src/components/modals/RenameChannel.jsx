import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import _ from 'lodash';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { closeModal } from '../../store/slices/modalSlice';
import { clearStatus, renameChannel } from '../../store/slices/emitSlice';
import { selectors } from '../../store/slices/channelsSlice';

const ModalRename = () => {
  const [error, setError] = useState(null);
  const input = useRef();
  const { t } = useTranslation();
  const channel = useSelector((state) => state.modal.data);
  const channels = useSelector(selectors.selectAll);
  const dispatch = useDispatch();

  const submit = (event) => {
    event.preventDefault();

    const inputValue = event.target[0].value;
    const channelsNames = channels.map((element) => element.name);
    const isUnique = !_.includes(channelsNames, inputValue);
    if (isUnique) {
      setError(null);
      dispatch(renameChannel({ id: channel.id, name: inputValue }));
      dispatch(closeModal());
      toast.success(t('toast.success.renameChannel'));
      dispatch(clearStatus());
    } else {
      setError('error');
    }
  };

  useEffect(() => {
    input.current.select();
  }, [dispatch]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameChannel.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Control
            type="name"
            id="name"
            autoFocus
            className={error ? 'mb-2 is-invalid' : 'mb-2'}
            defaultValue={channel.name}
            ref={input}
          />
          <label className="visually-hidden" htmlFor="name">{t('modal.renameChannel.label')}</label>
          <div className="invalid-feedback">{error ? t('modal.renameChannel.error') : ''}</div>
          <div className="d-flex justify-content-end">
            <Button className="me-2 btn btn-secondary" onClick={() => dispatch(closeModal())}>
              {t('modal.cancel')}
            </Button>
            <Button className="btn btn-primary" type="submit">
              {t('modal.send')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

export default ModalRename;
