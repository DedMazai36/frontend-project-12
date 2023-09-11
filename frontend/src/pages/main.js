
//import { useSelector, useDispatch } from 'react-redux';
//import { getData } from '../slices/channelsSlice.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { date } from 'yup';
import { io } from 'socket.io-client';
import _, { every, set } from 'lodash';
//import { addData } from '../slices/channelsSlice';
import { ModalAdd } from './modal.js';

function renderUl(state, setState, setActiveModalChannel, focusOnRenameModal) {
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
                  onClick={() => { setState({ ...state, activeChannelId: channel.id }) }}
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
                  onClick={() => { setState({ ...state, activeChannelId: channel.id }) }}
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
                  <span className="visually-hidden">Управление каналом</span>
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
                    data-bs-toggle="modal"
                    data-bs-target="#removeChannelModal"
                  >
                    Удалить
                  </a>
                  <a
                    data-rr-ui-dropdown-item=""
                    className="dropdown-item"
                    role="button"
                    tabIndex={0}
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#renameChannelModal"
                    onClick={focusOnRenameModal}
                  >
                    Переименовать
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

function renderMessages(state) {
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

function MainPage() {
  const [state, setState] = useState({ channels: [], messages: [], activeChannelId: 1 });
  const [errors, setErrors] = useState({ network: '', createChannel: '' });
  const [activeModalChannel, setActiveModalChannel] = useState({});
  const [activeModal, setActiveModal] = useState({ addChannel: false, removeChannel: false, renameChannel: false });
  const [messageInput, setMessageInput] = useState('');

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
        setState({ ...state, channels, messages, activeChannelId: currentChannelId });
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
    if (!_.includes(channelsNames, inputValue)) {
      setErrors({...errors, createChannel: ''});
      socket.emit('newChannel', { name: inputValue }, (response) => {
        if (response.status === 'ok') {
          setState({ ...state, activeChannelId: response.data.id });
          event.target.reset();
        } else {
          setErrors({ ...errors, network: 'Ошибка отправки данных на сервер' });
        }
      })
    } else {
      setErrors({ ...errors, createChannel: 'Имя канала уже существует' });
    }
  }

  function removeChannel(event) {
    event.preventDefault();
    socket.emit('removeChannel', { id: activeModalChannel.id }, (response) => {
      if (response.status === 'ok') {
        setState({ ...state, activeChannelId: 1 });
      } else {
        setErrors({ ...errors, network: 'Ошибка отправки данных на сервер' });
      }
    })
  }

  function renameChannel(event) {
    event.preventDefault();
    const name = event.target[0].value;
    socket.emit('renameChannel', { id: activeModalChannel.id, name }, (response) => {
      if (!(response.status === 'ok')) {
        setErrors({ ...errors, network: 'Ошибка отправки данных на сервер' });
      }
    })
  }

  function handleChangeMessage(event) {
    setMessageInput(event.target.value)
  }

  const inputRef = React.useRef(null);

  function focusOnRenameModal() {
    inputRef.current.value = activeModalChannel.name;
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
    setState({ ...state, channels: newArrOfChannels, messages: newArrOfMessages });
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
                  Hexlet Chat
                </a>
                <button type="button" className="btn btn-primary">
                  Выйти
                </button>
              </div>
            </nav>
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                  <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                    <b>Каналы</b>
                    <button
                      type="button"
                      className="p-0 text-primary btn btn-group-vertical"
                      data-bs-toggle="modal"
                      data-bs-target="#addChannelModal"
                      //onClick={() => setActiveModal({...activeModal, addChannel: true})}
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
                  {renderUl(state, setState, setActiveModalChannel, focusOnRenameModal)}
                </div>
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b># general</b>
                      </p>
                      <span className="text-muted">0 сообщений</span>
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
                            aria-label="Новое сообщение"
                            placeholder="Введите сообщение..."
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
                            <span className="visually-hidden">Отправить</span>
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

      <ModalAdd show={activeModal.addChannel} onCloseButtonClick={() => setActiveModal({...activeModal, addChannel: false})} addChannel={addChannel} />

      <div
        id='addChannelModal'
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addChannelModalLabel"
        aria-hidden="true"
        autoFocus
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Добавить канал</div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={addChannel}>
                <div>
                  <input
                    name="name"
                    id="name"
                    className={errors.createChannel ? "mb-2 form-control is-invalid" : "mb-2 form-control"}
                    defaultValue=""
                  />
                  <label className="visually-hidden" htmlFor="name">
                    Имя канала
                  </label>
                  <div className="invalid-feedback">{errors.createChannel ? 'Должно быть уникальным' : ''}</div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Отменить
                    </button>
                    <button type="submit" className="btn btn-primary" data-bs-dismiss={errors.createChannel ? "" : "modal"}>
                      Отправить
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>








      <div
        id='renameChannelModal'
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="renameChannelModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Переименовать канал</div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={renameChannel}>
                <div>
                  <input
                    name="name"
                    id="name"
                    className="mb-2 form-control"
                    ref={inputRef}
                  />
                  <label className="visually-hidden" htmlFor="name">
                    Имя канала
                  </label>
                  <div className="invalid-feedback" />
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Отменить
                    </button>
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                      Отправить
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>





      <div
        id='removeChannelModal'
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="removeChannelModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">Удалить канал</div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <p className="lead">Уверены?</p>
              <div className="d-flex justify-content-end">
                <button type="button" className="me-2 btn btn-secondary" data-bs-dismiss="modal">
                  Отменить
                </button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={removeChannel}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default MainPage;

