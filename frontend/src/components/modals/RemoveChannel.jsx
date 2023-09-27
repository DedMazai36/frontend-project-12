import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { closeModal, getModalData } from '../../store/slices/modalSlice';
import { removeChannel } from '../../store/slices/emitSlice';
import MyModalHeader from './components/Header';

const ModalRemove = () => {
  const channelID = useSelector(getModalData);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const submit = () => {
    dispatch(removeChannel(channelID));
    dispatch(closeModal());
  };

  return (
    <>
      <MyModalHeader type="remove" />
      <Modal.Body>
        <p className="lead">{t('modal.deleteChannel.label')}</p>
        <div className="d-flex justify-content-end">
          <Button className="me-2 btn btn-secondary" onClick={() => dispatch(closeModal())}>
            {t('modal.cancel')}
          </Button>
          <Button className="btn btn-danger" onClick={submit}>
            {t('modal.delete')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default ModalRemove;
