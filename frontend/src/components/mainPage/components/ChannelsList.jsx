import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { openModal } from '../../../store/slices/modalSlice';
import { changeCurrentChannelId, channelsSelectors } from '../../../store/slices/channelsSlice';
import { clearStatus, getEmitStatus } from '../../../store/slices/emitSlice';

const ChannelsList = () => {
  const channels = useSelector(channelsSelectors.adapter.selectAll);
  const currentChannelId = useSelector(channelsSelectors.selectCurrentChannelId);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const statusAdd = useSelector(getEmitStatus('addChannel'));
  const statusRemove = useSelector(getEmitStatus('removeChannel'));
  const statusRename = useSelector(getEmitStatus('renameChannel'));

  useEffect(() => {
    if (statusAdd === 'fulfilled') {
      toast.success(t('toast.success.addChannel'));
      dispatch(clearStatus());
    }
    if (statusRemove === 'fulfilled') {
      toast.success(t('toast.success.removeChannel'));
      dispatch(clearStatus());
    }
    if (statusRename === 'fulfilled') {
      toast.success(t('toast.success.renameChannel'));
      dispatch(clearStatus());
    }
    if (statusAdd === 'rejected' || statusRemove === 'rejected' || statusRename === 'rejected') {
      toast.error(t('toast.error.errorSend'));
      dispatch(clearStatus());
    }
  });

  return (
    <ul
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map((channel) => (
        <li key={channel.id} className="nav-item w-100">
          <div role="group" className="d-flex dropdown btn-group">
            <button
              type="button"
              onClick={() => {
                dispatch(changeCurrentChannelId({ id: channel.id }));
              }}
              className={clsx('w-100 rounded-0 text-start btn', currentChannelId === channel.id && 'btn-secondary')}
            >
              <span className="me-1">#</span>
              {channel.name}
            </button>
            {channel.removable ? (
              <>
                <button
                  type="button"
                  id="react-aria6940569620-1"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  className={clsx('flex-grow-0 dropdown-toggle dropdown-toggle-split btn', currentChannelId === channel.id && 'btn-secondary')}
                >
                  <span className="visually-hidden">{t('main.channels.management')}</span>
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="react-aria6940569620-1"
                  data-popper-reference-hidden="false"
                  data-popper-escaped="false"
                  data-popper-placement="bottom-start"
                  style={{
                    position: 'absolute',
                    inset: '0px auto auto 0px',
                    transform: 'translate(262px, 280px)',
                  }}
                >
                  <a
                    data-rr-ui-dropdown-item=""
                    className="dropdown-item"
                    role="button"
                    tabIndex={0}
                    href="/"
                    onClick={(e) => { e.preventDefault(); dispatch(openModal({ type: 'remove', data: channel.id })); }}
                  >
                    {t('main.channels.delete')}
                  </a>
                  <a
                    data-rr-ui-dropdown-item=""
                    className="dropdown-item"
                    role="button"
                    tabIndex={0}
                    href="/"
                    onClick={(e) => { e.preventDefault(); dispatch(openModal({ type: 'rename', data: channel })); }}
                  >
                    {t('main.channels.rename')}
                  </a>
                </div>
              </>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChannelsList;
