
//import { useSelector, useDispatch } from 'react-redux';
//import { getData } from '../slices/channelsSlice.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { date } from 'yup';
import { io } from 'socket.io-client';
import _, { every, set } from 'lodash';
//import { addData } from '../slices/channelsSlice';
import { ModalAdd, ModalRename, ModalRemove } from './modal.js';
import { AuthContext } from '../App.js';
import { useTranslation } from 'react-i18next';


const renderUl = (state, setState, setActiveModalChannel, setActiveModal, activeModal) => {
  const { t } = useTranslation();

  if (Object.entries(state).length !== 0) {
    return (
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {state.channels.map((channel) => {
          if (!channel.removable) {
            return (
              <li key={channel.id} className="nav-item w-100">
                <button
                  type="button"
                  onClick={() => { setState({ ...state, activeChannelId: channel.id, activeChannelName: channel.name }) }}
                  className={state.activeChannelId === channel.id ? "w-100 rounded-0 text-start btn btn-secondary" : "w-100 rounded-0 text-start btn"}
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
                  onClick={() => { setState({ ...state, activeChannelId: channel.id, activeChannelName: channel.name }) }}
                  className={state.activeChannelId === channel.id ? "w-100 rounded-0 text-start btn btn-secondary" : "w-100 rounded-0 text-start btn"}
                >
                  <span className="me-1">#</span>{channel.name}
                </button>
                <button
                  type="button"
                  id="react-aria6940569620-1"
                  aria-expanded="false"
                  data-bs-toggle="dropdown"
                  className={state.activeChannelId === channel.id ? "flex-grow-0 dropdown-toggle dropdown-toggle-split btn btn-secondary" : "flex-grow-0 dropdown-toggle dropdown-toggle-split btn"}
                  onClick={() => setActiveModalChannel(channel)}
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
                    href="#"
                    //data-bs-toggle="modal"
                    //data-bs-target="#removeChannelModal"
                    onClick={() => { setActiveModal({ ...activeModal, removeChannel: channel.id }) }}
                  >
                    {t('main.channels.delete')}
                  </a>
                  <a
                    data-rr-ui-dropdown-item=""
                    className="dropdown-item"
                    role="button"
                    tabIndex={0}
                    href="#"
                    //data-bs-toggle="modal"
                    //data-bs-target="#renameChannelModal"
                    onClick={() => { setActiveModal({ ...activeModal, renameChannel: channel.name }) }}
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
  }
}

const renderMessages = (state) => {
  if (Object.entries(state).length !== 0) {
    return (
      state.messages.map((message) => {
        if (message.channelID === state.activeChannelId) {
          return (
            <div key={message.id} className='text-break mb-2'>
              <b>{message.username}</b>
              {': '}
              {message.body}
            </div>
          )
        }
      })
    )
  }
}

const socket = io();

const MainPage = () => {
  const [state, setState] = useState({ channels: [], messages: [], activeChannelId: 1, activeChannelName: ''});
  const [errors, setErrors] = useState({ network: false, createChannel: false });
  const [activeModalChannel, setActiveModalChannel] = useState({});
  const [activeModal, setActiveModal] = useState({ addChannel: false, removeChannel: false, renameChannel: false });
  const [messageInput, setMessageInput] = useState('');
  const { setAuth } = React.useContext(AuthContext);
  const { t } = useTranslation();



  function getData() {
    console.log('getData')
    const token = localStorage.getItem('token');
    axios.get('/api/v1/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const { channels, currentChannelId, messages } = response.data;
        setState({ ...state, channels, messages, activeChannelId: currentChannelId, activeChannelName: channels[0].name });
        //console.log(response.data)
      })
      .catch((err) => {
        console.log(err);
        setErrors({ ...errors, network: 'Ошибка подключения к серверу при загрузке страницы' });
      });
  }

  function sendMessgae(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    console.log(event.target)
    socket.emit('newMessage', { body: inputValue, username: 'admin', channelID: state.activeChannelId }, (response) => {
      if (response.status === 'ok') {
        setMessageInput('');
        event.target[0].focus();
      } else {
        setErrors({ ...errors, network: 'Ошибка отправки сообщения' });
      }
    });
  }

  function addChannel(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;
    const channelsNames = state.channels.map((channel) => channel.name);
    const validation = _.includes(channelsNames, inputValue);
    setErrors({ ...errors, createChannel: validation });
    if (!validation) {
      socket.emit('newChannel', { name: inputValue }, (response) => {
        if (response.status === 'ok') {
          setActiveModal({ ...activeModal, addChannel: false })
          setState({ ...state, activeChannelId: response.data.id, activeChannelName: response.data.name });
          event.target.reset();
        } else {
          setErrors({ ...errors, network: 'Ошибка отправки данных на сервер' });
        }
      })
    }
  }

  function renameChannel(event) {
    event.preventDefault();
    const name = event.target[0].value;
    const channelsNames = state.channels.map((channel) => channel.name);
    const validation = _.includes(channelsNames, name);
    setErrors({ ...errors, renameChannel: validation });
    if (!validation) {
      socket.emit('renameChannel', { id: activeModalChannel.id, name }, (response) => {
        if (!(response.status === 'ok')) {
          setErrors({ ...errors, network: 'Ошибка отправки данных на сервер' });
        } else {
          setActiveModal({ ...activeModal, renameChannel: false });
        }
      })
    }
  }

  function removeChannel() {
    socket.emit('removeChannel', { id: activeModalChannel.id }, (response) => {
      if (response.status === 'ok') {
        setActiveModal({ ...activeModal, removeChannel: false });
        setState({ ...state, activeChannelId: 1, activeChannelName: 'general' });
      } else {
        setErrors({ ...errors, network: 'Ошибка отправки данных на сервер' });
      }
    })
  }

  function handleChangeMessage(event) {
    setMessageInput(event.target.value)
  }


  socket.on('newMessage', (payload) => {
    setState({ ...state, messages: [...state.messages, payload] });
  });

  socket.on('newChannel', (payload) => {
    setState({ ...state, channels: [...state.channels, payload] });
  });

  socket.on('removeChannel', (payload) => {
    const newArrOfChannels = state.channels.filter((channel) => channel.id !== payload.id);
    const newArrOfMessages = state.messages.filter((message) => message.channelId !== payload.id);
    setState({ ...state, activeChannelId: 1, activeChannelName: 'general', channels: newArrOfChannels, messages: newArrOfMessages });
  });

  socket.on('renameChannel', (payload) => {
    const newArrOfChannels = state.channels.map((channel) => {
      if (channel.id === payload.id) {
        return { ...channel, name: payload.name };
      }
      return channel;
    });
    setState({ ...state, channels: newArrOfChannels });
  });

  useEffect(getData, []);

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">
                  {t('header.hexlet')}
                </a>
                <button type="button" className="btn btn-primary" onClick={() => { localStorage.clear(); setAuth(false); }}>
                  {t('header.escape')}
                </button>
              </div>
            </nav>
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                  <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                    <b>{t('main.chat.channels')}</b>
                    <button
                      type="button"
                      className="p-0 text-primary btn btn-group-vertical"
                      //data-bs-toggle="modal"
                      //data-bs-target="#addChannelModal"
                      onClick={() => setActiveModal({ ...activeModal, addChannel: true })}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width={20}
                        height={20}
                        fill="currentColor"
                      >
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                      <span className="visually-hidden">+</span>
                    </button>
                  </div>
                  {renderUl(state, setState, setActiveModalChannel, setActiveModal, activeModal)}
                </div>
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b>{`# ${state.activeChannelName}`}</b>
                      </p>
                      <span className="text-muted">{t('main.chat.messages', {count: state.messages.filter((message) => message.channelID === state.activeChannelId).length})}</span>
                    </div>
                    <div
                      id="messages-box"
                      className="chat-messages overflow-auto px-5 "
                    >
                      {renderMessages(state)}
                    </div>
                    <div className="mt-auto px-5 py-3">
                      <form noValidate="" className="py-1 border rounded-2" onSubmit={sendMessgae}>
                        <div className="input-group has-validation">
                          <input
                            name="body"
                            aria-label={t('main.chat.input.label')}
                            placeholder={t('main.chat.input.placeHolder')}
                            className="border-0 p-0 ps-2 form-control"
                            value={messageInput}
                            onChange={handleChangeMessage}
                            autoFocus
                          />
                          <button
                            type="submit"
                            disabled={messageInput === '' ? true : false}
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
              </div>
            </div>
          </div>
          <div className="Toastify" />
        </div>
      </div>

      <ModalAdd show={activeModal.addChannel} handleClose={() => setActiveModal({ ...activeModal, addChannel: false })} addChannel={addChannel} errors={errors} />
      <ModalRename show={activeModal.renameChannel} handleClose={() => setActiveModal({ ...activeModal, renameChannel: false })} renameChannel={renameChannel} errors={errors} />
      <ModalRemove show={activeModal.removeChannel} handleClose={() => setActiveModal({ ...activeModal, removeChannel: false })} removeChannel={removeChannel} />

    </>
  )
}

export default MainPage;

