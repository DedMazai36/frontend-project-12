import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal, getModalState } from '../../store/slices/modalSlice';
import ModalAdd from './AddChannel';
import ModalRename from './RenameChannel';
import ModalRemove from './RemoveChannel';

const MyModal = () => {
  const modalState = useSelector(getModalState);
  const dispatch = useDispatch();
  const modals = {
    add: ModalAdd,
    remove: ModalRemove,
    rename: ModalRename,
  };

  const Component = modals[modalState.type];

  return (
    <Modal show={modalState.show} onHide={() => dispatch(closeModal())} centered>
      {Component && <Component />}
    </Modal>
  );
};

export default MyModal;
