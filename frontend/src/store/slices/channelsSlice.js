/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchData } from './dataSlice';

const channelsAdapter = createEntityAdapter({
  selectId: (channel) => channel.id,
});

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
  currentChannelName: null,
  defaultId: null,
  defaultName: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel(state, { payload }) {
      channelsAdapter.addOne(state, payload);
      state.currentChannelId = payload.id;
      state.currentChannelName = payload.name;
    },
    addChannels: channelsAdapter.addMany,
    renameChannel(state, { payload }) {
      channelsAdapter.updateOne(state, payload);
      if (payload.id === state.currentChannelId) {
        state.currentChannelName = payload.changes.name;
      }
    },
    removeChannel(state, { payload }) {
      channelsAdapter.removeOne(state, payload);
      if (payload === state.currentChannelId) {
        state.currentChannelId = state.defaultId;
        state.currentChannelName = state.defaultName;
      }
    },
    changeCurrentChannelId(state, { payload }) {
      state.currentChannelId = payload.id;
      state.currentChannelName = payload.name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        channelsAdapter.addMany(state, action.payload.channels);
        const id = action.payload.currentChannelId;
        const { name } = action.payload.channels.filter((channel) =>
          channel.id === action.payload.currentChannelId
        )[0];
        state.currentChannelId = id;
        state.defaultId = id;
        state.currentChannelName = name;
        state.defaultName = name;
      });
  },
});

export const {
  addChannel, addChannels, renameChannel,
  removeChannel, changeCurrentChannelId,
} = channelsSlice.actions;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const getCurrentChannelId = (state) => state.channels.currentChannelId;
export const getCurrentChannelName = (state) => state.channels.currentChannelName;

export default channelsSlice.reducer;
