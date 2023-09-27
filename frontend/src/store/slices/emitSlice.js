/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as filter from 'leo-profanity';
import { trimStart } from 'lodash';
import socket from '../../context/webSoket';

const sliseName = 'emit';

export const sendMessgae = createAsyncThunk(
  `${sliseName}/sendMessage`,
  async (payload) => {
    const filterValue = filter.clean(payload.text);

    const response = await new Promise((resolve) => {
      socket.emit('newMessage', { body: filterValue, username: payload.username, channelID: payload.channelID }, (data) => {
        resolve(data.status);
      });
    });

    return response;
  },
);

export const addChannel = createAsyncThunk(
  `${sliseName}/addChannel`,
  async (payload) => {
    const response = await new Promise((resolve) => {
      socket.emit('newChannel', { name: payload }, (data) => {
        resolve(data.status);
      });
    });

    return response;
  },
);

export const removeChannel = createAsyncThunk(
  `${sliseName}/removeChannel`,
  async (id) => {
    const response = await new Promise((resolve) => {
      socket.emit('removeChannel', { id }, (data) => {
        resolve(data.status);
      });
    });

    return response;
  },
);

export const renameChannel = createAsyncThunk(
  `${sliseName}/renameChannel`,
  async ({ id, name }) => {
    const response = await new Promise((resolve) => {
      socket.emit('renameChannel', { id, name }, (data) => {
        resolve(data.status);
      });
    });

    return response;
  },
);

const loadingTypesRegExp = /(\/pending|\/fulfilled|\/rejected)$/;

const emitSlice = createSlice({
  name: sliseName,
  initialState: {
    sendMessgae: null,
    addChannel: null,
    removeChannel: null,
    renameChannel: null,
  },
  reducers: {
    clearStatus(state) {
      Object.keys(state).forEach((key) => { state[key] = null; });
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => loadingTypesRegExp.test(action.type) && action.type.includes(sliseName),
        (state, action) => {
          const [match] = action.type.match(loadingTypesRegExp);
          const fetchingStatus = trimStart(match, '/');
          const actionType = action.type.replace(loadingTypesRegExp, '').replace(`${sliseName}/`, '');
          state[actionType] = fetchingStatus;
        },
      );
  },
});

export const getEmitStatus = (type) => (state) => state[sliseName][type];

export const { clearStatus } = emitSlice.actions;
export default emitSlice.reducer;
