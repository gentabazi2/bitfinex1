import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    createBookBySnapshot: {
      reducer(state, action) {
        return action.payload;
      },
    },
  },
});

export const selectOrderBook = (state) => state.orderBook;

export const { createBookBySnapshot } = orderBookSlice.actions;

export default orderBookSlice.reducer;
