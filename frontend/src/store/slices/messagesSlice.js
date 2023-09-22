import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { removeChannel } from './channelsSlice';
import { fetchData } from './dataSlice';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({
  status: null,
  error: null,
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const removedChannelId = action.payload;
        const messagesIds = Object.values(state.entities)
          .filter((message) => message.channelId === removedChannelId)
          .map((message) => message.id);
        messagesAdapter.removeMany(state, messagesIds);
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        messagesAdapter.addMany(state, action.payload.messages);
      });
  },
});

export const { addMessage, addMessages } = messagesSlice.actions;

export const selectors = messagesAdapter.getSelectors((state) => state.messages);

export default messagesSlice.reducer;
