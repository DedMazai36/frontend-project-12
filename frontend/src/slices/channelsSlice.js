import { createAsyncThunk, createSlice/*, createEntityAdapter*/ } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  channels: [],
  currentChannelId: 1,
  messages: [],
};

export const getData = createAsyncThunk(
  'getData', // отображается в dev tools и должно быть уникально у каждого Thunk
  async () => {
    // Здесь только логика запроса и возврата данных
    // Никакой обработки ошибок
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/v1/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

//const usersAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChanal: (state, action) => {
      state.channels.push(action);
    },
    addData: (state, action) => {
      console.log(2)
      const { channels, currentChannelId, messages } = action.payload;
      channels.map((channel) => state.channels.push(channel));
      state.currentChannelId = currentChannelId;
      messages.map((message) => state.messages.push(message));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state, action) => {
        console.log(action);
      })
  }
})

export const { addChanal, addData } = channelsSlice.actions;
export default channelsSlice.reducer;
