import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Channels from './components/Channels';
import Messages from './components/Messages';
import MyModal from '../modals/Modal';
import MyNav from '../header/Header';
import { clearError, fetchData, getError } from '../../store/slices/dataSlice';
import { useAuthContext } from '../../context/AuthContext';

const MainPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { token } = useAuthContext();

  const fetchError = useSelector(getError);

  if (fetchError) {
    toast.error(t('toast.error.errorGet'));
    dispatch(clearError());
  }

  useEffect(() => {
    dispatch(fetchData(token));
  }, [dispatch, token]);

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
