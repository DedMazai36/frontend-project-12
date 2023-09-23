import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../store/slices/modalSlice';
import ModalAdd from './AddChannel';
import ModalRename from './RenameChannel';
import ModalRemove from './RemoveChannel';

const MyModal = () => {
  const modalData = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const modals = {
    add: ModalAdd,
    remove: ModalRemove,
    rename: ModalRename,
  };

  const Component = modals[modalData.type];

  return (
    <Modal show={modalData.show} onHide={() => dispatch(closeModal())} centered>
      {Component && <Component />}
    </Modal>
  );
};

export default MyModal;
