import { createSlice } from "@reduxjs/toolkit";
import {
  sortAndCalculateTotal,
  calculateUpdatedTotal,
} from "../../utils/calculateTotal";

const initialState = {
  bids: [],
  asks: [],
};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    createBookBySnapshot: {
      reducer(state, action) {
        return action.payload;
      },
      prepare(snapshot) {
        const bids = [];
        const asks = [];

        snapshot[1].forEach((item) => {
          item[3] = item[2];
          (item[2] > 0 ? bids : asks).push(item);
        });

        return {
          payload: {
            bids: sortAndCalculateTotal(true, bids),
            asks: sortAndCalculateTotal(false, asks),
          },
        };
      },
    },
    unsubscribe: () => initialState,
    updateOrderBook: {
      reducer(state, action) {
        const { isBid, values } = action.payload;
        const targetCollection = isBid ? state.bids : state.asks;
        const index = targetCollection.findIndex(
          (element) => element[0] === values[0]
        );
        if (index < 0) {
          targetCollection.push(values);
          if (isBid) {
            state.bids = sortAndCalculateTotal(true, targetCollection);
          } else {
            state.asks = sortAndCalculateTotal(false, targetCollection);
          }
        } else {
          targetCollection[index] = values;
          const element = document.getElementById(values[0]);

          if (isBid) {
            if (element) {
              element.classList.add("isBidUpdated");
              setTimeout(() => {
                element.classList.remove("isBidUpdated");
              }, 300);
            }
            state.bids = calculateUpdatedTotal(targetCollection);
          } else {
            if (element) {
              element.classList.add("isAskUpdated");
              setTimeout(() => {
                element.classList.remove("isAskUpdated");
              }, 300);
            }
            state.asks = calculateUpdatedTotal(targetCollection);
          }
        }
      },
      prepare(item) {
        return {
          payload: {
            isBid: item[2] > 0,
            values: [item[0], item[1], Math.abs(item[2])],
          },
        };
      },
    },
    deleteFromOrderBook: {
      reducer(state, action) {
        const { isBid, values } = action.payload;
        const targetCollection = isBid ? state.bids : state.asks;
        const updatedCollection = targetCollection.filter(
          (element) => element[0] !== values[0]
        );
        if (isBid) {
          state.bids = calculateUpdatedTotal(updatedCollection);
        } else {
          state.asks = calculateUpdatedTotal(updatedCollection);
        }
      },
      prepare(item) {
        return {
          payload: {
            isBid: item[2] > 0,
            values: item,
          },
        };
      },
    },
  },
});

export const selectOrderBook = (state) => state.orderBook;

export const {
  createBookBySnapshot,
  unsubscribe,
  updateOrderBook,
  deleteFromOrderBook,
} = orderBookSlice.actions;

export default orderBookSlice.reducer;
