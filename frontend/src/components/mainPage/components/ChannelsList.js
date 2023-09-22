import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { renameModal, removeModal } from '../../../store/slices/modalSlice';
import { changeCurrentChannelId, getCurrentChannelId, selectors } from '../../../store/slices/channelsSlice';

const ChannelsList = () => {
  const channels = useSelector(selectors.selectAll);
  const currentChannelId = useSelector(getCurrentChannelId);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <ul
      id="channels-box"
      className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
    >
      {channels.map((channel) => {
        if (!channel.removable) {
          return (
            <li key={channel.id} className="nav-item w-100">
              <button
                type="button"
                onClick={() => dispatch(changeCurrentChannelId({ id: channel.id, name: channel.name }))}
                className={currentChannelId === channel.id ? "w-100 rounded-0 text-start btn btn-secondary" : "w-100 rounded-0 text-start btn"}
              >
                <span className="me-1">#</span>{channel.name}
              </button>
            </li>
          )
        }
        return (
          <li key={channel.id} className="nav-item w-100">
            <div role="group" className="d-flex dropdown btn-group">
              <button
                type="button"
                onClick={() => dispatch(changeCurrentChannelId({ id: channel.id, name: channel.name }))}
                className={currentChannelId === channel.id ? "w-100 rounded-0 text-start btn btn-secondary" : "w-100 rounded-0 text-start btn"}
              >
                <span className="me-1">#</span>{channel.name}
              </button>
              <button
                type="button"
                id="react-aria6940569620-1"
                aria-expanded="false"
                data-bs-toggle="dropdown"
                className={currentChannelId === channel.id ? "flex-grow-0 dropdown-toggle dropdown-toggle-split btn btn-secondary" : "flex-grow-0 dropdown-toggle dropdown-toggle-split btn"}
              >
                <span className="visually-hidden">{t('main.channels.management')}</span>
              </button>
              <div
                className="dropdown-menu"
                x-placement="bottom-start"
                aria-labelledby="react-aria6940569620-1"
                data-popper-reference-hidden="false"
                data-popper-escaped="false"
                data-popper-placement="bottom-start"
                style={{
                  position: "absolute",
                  inset: "0px auto auto 0px",
                  transform: "translate(262px, 280px)"
                }}
              >
                <a
                  data-rr-ui-dropdown-item=""
                  className="dropdown-item"
                  role="button"
                  tabIndex={0}
                  href="/"
                  onClick={(e) => {e.preventDefault(); dispatch(removeModal(channel.id))}}
                >
                  {t('main.channels.delete')}
                </a>
                <a
                  data-rr-ui-dropdown-item=""
                  className="dropdown-item"
                  role="button"
                  tabIndex={0}
                  href="/"
                  onClick={(e) => {e.preventDefault(); dispatch(renameModal(channel))}}
                >
                  {t('main.channels.rename')}
                </a>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )

};

export default ChannelsList;
