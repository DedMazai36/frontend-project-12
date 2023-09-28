/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { fetchData } from './dataSlice';

const channelsAdapter = createEntityAdapter({
  selectId: (channel) => channel.id,
});

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
  defaultId: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel(state, { payload }) {
      channelsAdapter.addOne(state, payload);
      state.currentChannelId = payload.id;
    },
    addChannels: channelsAdapter.addMany,
    renameChannel(state, { payload }) {
      channelsAdapter.updateOne(state, payload);
    },
    removeChannel(state, { payload }) {
      channelsAdapter.removeOne(state, payload);
      if (payload === state.currentChannelId) {
        state.currentChannelId = state.defaultId;
      }
    },
    changeCurrentChannelId(state, { payload }) {
      state.currentChannelId = payload.id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        channelsAdapter.addMany(state, action.payload.channels);
        const id = action.payload.currentChannelId;
        state.currentChannelId = id;
        state.defaultId = id;
      });
  },
});

export const {
  addChannel, addChannels, renameChannel,
  removeChannel, changeCurrentChannelId,
} = channelsSlice.actions;
export const channelsSelectors = {
  adapter: channelsAdapter.getSelectors((state) => state.channels),
  selectCurrentChannelId: (state) => state.channels.currentChannelId,
  selectCurrentChannelName: (state) => {
    const id = channelsSelectors.selectCurrentChannelId(state);
    const currentChannel = channelsSelectors.adapter.selectById(state, id);

    return currentChannel?.name || 'undefined';
  },
};
export default channelsSlice.reducer;
