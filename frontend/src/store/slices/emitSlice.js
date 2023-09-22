import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from 'socket.io-client';
import * as filter from 'leo-profanity';

export const socket = io();

filter.list();
filter.clearList();
filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('ru'));

export const sendMessgae = createAsyncThunk(
  'data/sendMessgae',
  async function (payload) {
    const filterValue = filter.clean(payload.text);

    const response = await new Promise((resolve) => {
      socket.emit('newMessage', { body: filterValue, username: payload.username, channelID: payload.channelID }, (response) => {
        resolve(response.status);
      });
    });

    return response;
  }
);

export const addChannel = createAsyncThunk(
  'data/addChannel',
  async function (payload) {
    const response = await new Promise((resolve) => {
      socket.emit('newChannel', { name: payload }, (response) => {
        resolve(response.status);
      });
    });

    return response;
  }
);

export const removeChannel = createAsyncThunk(
  'data/removeChannel',
  async function (id) {
    const response = await new Promise((resolve) => {
      socket.emit('removeChannel', { id }, (response) => {
        resolve(response.status);
      });
    });

    return response;
  }
);

export const renameChannel = createAsyncThunk(
  'data/renameChannel',
  async function ({ id, name }) {
    const response = await new Promise((resolve) => {
      socket.emit('renameChannel', { id, name }, (response) => {
        resolve(response.status);
      });
    });

    return response;
  }
);


const emitSlice = createSlice({
  name: 'emit',
  initialState: {
    status: null,
  },
  reducers: {
    clearStatus(state) {
      state.status = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessgae.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessgae.fulfilled, (state, { payload }) => {
        if (payload === 'ok') {
          state.status = 'send';
        } else {
          state.status = 'error';
        }
      })
      .addCase(addChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        if (payload === 'ok') {
          state.status = 'add';
        } else {
          state.status = 'error';
        }
      })
      .addCase(removeChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeChannel.fulfilled, (state, { payload }) => {
        if (payload === 'ok') {
          state.status = 'remove';
        } else {
          state.status = 'error';
        }
      })
      .addCase(renameChannel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(renameChannel.fulfilled, (state, { payload }) => {
        if (payload === 'ok') {
          state.status = 'rename';
        } else {
          state.status = 'error';
        }
      })
  }
});

export const { clearStatus } = emitSlice.actions;
export default emitSlice.reducer;
