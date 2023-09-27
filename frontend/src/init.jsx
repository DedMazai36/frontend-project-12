import React from 'react';
import { Provider as ReactProvider } from 'react-redux';
import { Provider, ErrorBoundary } from '@rollbar/react';
import * as filter from 'leo-profanity';
import MyAuthContextProvider from './context/AuthContext';
import { addMessage } from './store/slices/messagesSlice';
import { addChannel, removeChannel, renameChannel } from './store/slices/channelsSlice';
import App from './App';
import store from './store';
import './i18n';
import socket from './context/webSoket';

const init = () => {
  filter.list();
  filter.clearList();
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('ru'));

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR,
    environment: 'testenv',
  };

  socket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel(payload.id));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel({ id: payload.id, changes: payload }));
  });

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <ReactProvider store={store}>
          <MyAuthContextProvider>
            <App />
          </MyAuthContextProvider>
        </ReactProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default init;
