import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { closeModal } from '../../store/slices/modalSlice';
import { clearStatus, removeChannel } from '../../store/slices/emitSlice';

const ModalRemove = () => {
  const channelID = useSelector((state) => state.modal.data);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const submit = () => {
    dispatch(removeChannel(channelID));
    dispatch(closeModal());
    toast.success(t('toast.success.removeChannel'));
    dispatch(clearStatus());
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.deleteChannel.header')}</Modal.Title>
      </Modal.Header>
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
