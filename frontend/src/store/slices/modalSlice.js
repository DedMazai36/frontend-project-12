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
    addModal(state) {
      state.type = 'add';
      state.show = true;
    },
    renameModal(state, { payload }) {
      state.data = payload;
      state.type = 'rename';
      state.show = true;
    },
    removeModal(state, { payload }) {
      state.data = payload;
      state.type = 'remove';
      state.show = true;
    },
    closeModal(state) {
      state.data = null;
      state.type = '';
      state.show = false;
    },
  },
});

export const {
  addModal, renameModal, removeModal, closeModal
} = modalSlice.actions;
export default modalSlice.reducer;
