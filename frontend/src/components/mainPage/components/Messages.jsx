import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { sendMessgae } from '../../../store/slices/emitSlice';
import { messagesSelectors } from '../../../store/slices/messagesSlice';
import { channelsSelectors } from '../../../store/slices/channelsSlice';
import { useAuthContext } from '../../../context/AuthContext';

const Messages = () => {
  const messages = useSelector(messagesSelectors.adapter.selectAll);
  const currentChannelId = useSelector(channelsSelectors.selectCurrentChannelId);
  const currentChannelName = useSelector(channelsSelectors.selectCurrentChannelName);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const chat = useRef();
  const inputElement = useRef();
  const { getName } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: ({ message }) => {
      formik.resetForm({ message: '' });
      return dispatch(sendMessgae({
        text: message,
        username: getName,
        channelID: currentChannelId,
      }));
    },
  });

  const currentMessages = messages.filter((message) => message.channelID === currentChannelId);

  useEffect(() => {
    inputElement.current.focus();
    chat.current.scrollTop = chat.current.scrollHeight;
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${currentChannelName}`}</b>
          </p>
          <span className="text-muted">{t('main.chat.messages', { count: currentMessages.length })}</span>
        </div>
        <div
          id="messages-box"
          className="chat-messages overflow-auto px-5"
          ref={chat}
        >
          {currentMessages.map((message) => (
            <div key={message.id} className="text-break mb-2">
              <b>{message.username}</b>
              {': '}
              {message.body}
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <form noValidate="" className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
            <div className="input-group has-validation">
              <input
                name="message"
                aria-label={t('main.chat.input.label')}
                placeholder={t('main.chat.input.placeHolder')}
                className="border-0 p-0 ps-2 form-control"
                value={formik.values.message}
                onChange={formik.handleChange}
                ref={inputElement}
              />
              <button
                type="submit"
                disabled={!formik.values.message}
                className="btn btn-group-vertical"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width={20}
                  height={20}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">{t('main.chat.input.send')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
