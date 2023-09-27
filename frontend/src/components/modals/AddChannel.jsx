import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { closeModal } from '../../store/slices/modalSlice';
import { addChannel } from '../../store/slices/emitSlice';
import { channelsSelectors } from '../../store/slices/channelsSlice';
import MyFooter from './components/Footer';
import MyModalHeader from './components/Header';

const ModalAdd = () => {
  const { t } = useTranslation();
  const channels = useSelector(channelsSelectors.adapter.selectAll);
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
    } else {
      setError('error');
    }
  };

  return (
    <>
      <MyModalHeader type="add" />
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Control
            type="name"
            id="name"
            autoFocus
            className={error ? 'mb-2 is-invalid' : 'mb-2'}
          />
          <label className="visually-hidden" htmlFor="name">{t('modal.addChannel.label')}</label>
          <div className="invalid-feedback">{error ? t('modal.addChannel.error') : ''}</div>
          <MyFooter />
        </Form>
      </Modal.Body>
    </>
  );
};

export default ModalAdd;
