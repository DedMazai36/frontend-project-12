import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import MyFooter from './components/Footer';
import { closeModal, getModalData } from '../../store/slices/modalSlice';
import { renameChannel } from '../../store/slices/emitSlice';
import { channelsSelectors } from '../../store/slices/channelsSlice';
import MyModalHeader from './components/Header';

const ModalRename = () => {
  const [error, setError] = useState(null);
  const input = useRef();
  const { t } = useTranslation();
  const channel = useSelector(getModalData);
  const channels = useSelector(channelsSelectors.adapter.selectAll);
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
    } else {
      setError('error');
    }
  };

  useEffect(() => {
    input.current.select();
  }, [dispatch]);

  return (
    <>
      <MyModalHeader type="rename" />
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Control
            type="name"
            id="name"
            autoFocus
            className={clsx('mb-2', error && 'is-invalid')}
            defaultValue={channel.name}
            ref={input}
          />
          <label className="visually-hidden" htmlFor="name">{t('modal.renameChannel.label')}</label>
          <div className="invalid-feedback">{error ? t('modal.renameChannel.error') : ''}</div>
          <MyFooter />
        </Form>
      </Modal.Body>
    </>
  );
};

export default ModalRename;
