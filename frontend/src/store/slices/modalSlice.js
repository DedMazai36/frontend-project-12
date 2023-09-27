/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    data: null,
    type: '',
    show: false,
  },
  reducers: {
    closeModal(state) {
      state.data = null;
      state.type = '';
      state.show = false;
    },
    openModal(state, { payload }) {
      state.data = payload.data;
      state.type = payload.type;
      state.show = true;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const getModalData = (state) => state.modal.data;
export default modalSlice.reducer;
