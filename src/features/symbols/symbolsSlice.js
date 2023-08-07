import axios from "axios";
import { axiosClient } from "../../app/axiosClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = [];

export const fetchSymbols = createAsyncThunk(
  "symbols/fetchSymbols",
  async () => {
    try {
      const response = await axiosClient.get("conf/pub:list:pair:exchange", {
        withCredentials: false,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      });
      console.log("resp", response);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

const symbolsSlice = createSlice({
  name: "symbols",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchSymbols.fulfilled, (state, action) => {
      //   console.log("aaa", action.payload[0]);
      return action.payload[0];
    });
  },
});

export const selectSymbols = (state) => state.symbols;
export default symbolsSlice.reducer;
