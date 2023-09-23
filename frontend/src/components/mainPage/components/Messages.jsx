import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessgae } from '../../../store/slices/emitSlice';
import { selectors } from '../../../store/slices/messagesSlice';
import { getCurrentChannelId, getCurrentChannelName } from '../../../store/slices/channelsSlice';

const Messages = () => {
  const [input, setInput] = useState('');
  const messages = useSelector(selectors.selectAll);
  const currentChannelId = useSelector(getCurrentChannelId);
  const currentChannelName = useSelector(getCurrentChannelName);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const chat = useRef();
  const inputElement = useRef();

  function handleChangeMessage(event) {
    setInput(event.target.value);
  }

  function submit(event) {
    event.preventDefault();

    dispatch(sendMessgae({
      text: input,
      username: localStorage.getItem('login') || 'unknown',
      channelID: currentChannelId,
    }));

    setInput('');
  }

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
          <span className="text-muted">{t('main.chat.messages', { count: messages.filter((message) => message.channelID === currentChannelId).length })}</span>
        </div>
        <div
          id="messages-box"
          className="chat-messages overflow-auto px-5"
          ref={chat}
        >
          {messages.map((message) => message.channelID === currentChannelId
            ?
            <div key={message.id} className="text-break mb-2">
              <b>{message.username}</b>
              {': '}
              {message.body}
            </div>
            : null
          )}
        </div>
        <div className="mt-auto px-5 py-3">
          <form noValidate="" className="py-1 border rounded-2" onSubmit={submit}>
            <div className="input-group has-validation">
              <input
                name="body"
                aria-label={t('main.chat.input.label')}
                placeholder={t('main.chat.input.placeHolder')}
                className="border-0 p-0 ps-2 form-control"
                value={input}
                onChange={handleChangeMessage}
                ref={inputElement}
              />
              <button
                type="submit"
                disabled={!input}
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
}

export default Messages;
