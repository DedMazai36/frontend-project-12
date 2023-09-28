/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes';

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (token) => {
    const response = await axios.get(routes.dataPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.data;

    return data;
  },
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: null,
    status: null,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'resolved';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state) => {
        state.error = 'fetchData';
      });
  },
});

export const getError = (state) => state.data.error;

export const { clearError } = dataSlice.actions;
export default dataSlice.reducer;
