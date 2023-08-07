import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
        console.log("prepare", snapshot);
        const bids = [];
        const asks = [];
        snapshot[1].forEach((item) => {
          if (item[2] > 0) {
            bids.push({ price: item[0], count: item[1], amount: item[2] });
          } else {
            asks.push({
              price: item[0],
              count: item[1],
              amount: Math.abs(item[2]),
            });
          }
        });
        return { payload: { bids, asks } };
      },
    },
    updateOrderBook: {
      reducer(state, action) {
        const object = action.payload;
        if (object.isBid) {
          let index = state.bids.findIndex(
            (element) => element.price === object.object.price
          );
          if (index < 0) {
            state.bids.push(object.object);
          } else {
            state.bids[index] = object.object;
          }
        } else {
          let index = state.asks.findIndex(
            (element) => element.price === object.object.price
          );
          if (index < 0) {
            state.asks.push(object.object);
          } else {
            state.asks[index] = object.object;
          }
        }
      },
      prepare(item) {
        let isBid = false;
        if (item[2] > 0) {
          isBid = true;
        } else {
          isBid = false;
        }
        return {
          payload: {
            isBid,
            object: {
              price: item[0],
              count: item[1],
              amount: Math.abs(item[2]),
            },
          },
        };
      },
    },
    deleteFromOrderBook: {
      reducer(state, action) {
        const object = action.payload;
        if (object.isBid) {
          let index = state.bids.findIndex(
            (element) => element.price === object.object.price
          );
          if (index < 0) {
            // state.bids.push(object.object);
            //
          } else {
            console.log("delete ,bids ", object.object);
            state.bids.splice(index, 1);
          }
        } else {
          let index = state.asks.findIndex(
            (element) => element.price === object.object.price
          );
          if (index < 0) {
            // state.bids.push(object.object);
            //
          } else {
            console.log("delete ,asks ", object.object);

            state.asks.splice(index, 1);
          }
        }
      },
      prepare(item) {
        let isBid = false;
        if (item[2] > 0) {
          isBid = true;
        } else {
          isBid = false;
        }
        return {
          payload: {
            isBid,
            object: {
              price: item[0],
              count: item[1],
              amount: item[2],
            },
          },
        };
      },
    },
  },
});

export const selectOrderBook = (state) => state.orderBook;

export const { createBookBySnapshot, updateOrderBook, deleteFromOrderBook } =
  orderBookSlice.actions;

export default orderBookSlice.reducer;
