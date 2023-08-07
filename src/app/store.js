import { configureStore } from "@reduxjs/toolkit";
import orderBookReducer from "../features/orderbook/orderBookSlice";
import symbolsReducer from "../features/symbols/symbolsSlice";

export const store = configureStore({
  reducer: {
    orderBook: orderBookReducer,
    symbols: symbolsReducer,
  },
});
