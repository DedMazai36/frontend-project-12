import { configureStore } from '@reduxjs/toolkit';
import dataSlice from './slices/dataSlice.js';
import modalSlice from './slices/modalSlice.js';
import emitSlice from './slices/emitSlice.js';
import channelsSlice from './slices/channelsSlice.js';
import messagesSlice from './slices/messagesSlice.js';

export default configureStore({
  reducer: {
    data: dataSlice,
    modal: modalSlice,
    emit: emitSlice,
    channels: channelsSlice,
    messages: messagesSlice,
  },
});
