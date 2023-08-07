import { configureStore } from "@reduxjs/toolkit";
import orderBookReducer from "../features/orderbook/orderBookSlice";

export const store = configureStore({
  reducer: {
    orderBook: orderBookReducer,
  },
});
