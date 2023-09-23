import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Channels from './components/Channels';
import Messages from './components/Messages';
import MyModal from '../modals/Modal';
import MyNav from '../header/Header';
import { clearError, fetchData } from '../../store/slices/dataSlice';
import { clearStatus, socket } from '../../store/slices/emitSlice';
import { addMessage } from '../../store/slices/messagesSlice';
import { addChannel, removeChannel, renameChannel } from '../../store/slices/channelsSlice';

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const fetchError = useSelector((state) => state.data.error);
  const sendStatus = useSelector((state) => state.emit.status);
  if (fetchError) {
    toast.error(t('toast.error.errorGet'));
    dispatch(clearError());
  }
  if (sendStatus === 'error') {
    toast.error(t('toast.error.errorSend'));
    dispatch(clearStatus());
  }

  useEffect(() => {
    dispatch(fetchData());

    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });
    socket.on('newChannel', (payload) => {
      dispatch(addChannel(payload));
    });
    socket.on('removeChannel', (payload) => {
      dispatch(removeChannel(payload.id));
    });
    socket.on('renameChannel', (payload) => {
      dispatch(renameChannel({ id: payload.id, changes: payload }));
    });
  }, [dispatch]);

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <MyNav />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <Channels />
                <Messages />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MyModal />
    </>
  );
};

export default MainPage;
