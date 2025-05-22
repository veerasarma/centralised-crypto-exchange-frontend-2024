import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  apiGetP2POpenOrder,
  apiGetP2POrderDetail,
  apiGetP2POrderHistory,apiGetP2PAdsHistory,apiGetP2PUserOrder
} from "../../services/P2P/P2pService";

export const getOpenOrder: any = createAsyncThunk(
  "p2p/openOrders",
  async (Filter: any) => {
    const response = await apiGetP2POpenOrder(Filter);
    return response.data.result;
  }
);


export const getUserOrder: any = createAsyncThunk(
  "p2p/openOrders",
  async (Filter: any) => {
    const response = await apiGetP2PUserOrder(Filter);
    return response.data.result;
  }
);
export const getorderDetail: any = createAsyncThunk(
  "p2p/OrderDetail",
  async (orderId: any) => {
    const response = await apiGetP2POrderDetail(orderId);
    return response.data.result;
  }
);

export const getAdsHistory: any = createAsyncThunk(
  "p2p/AdsHistory",
  async (orderId: any) => {
    const response = await apiGetP2PAdsHistory(orderId);
    return response.data.result;
  }
);

export const getp2pHistory: any = createAsyncThunk(
  "p2p/orderHistory",
  async (filter: any) => {
    const response = await apiGetP2POrderHistory(filter);
    return response.data.result;
  }
);
const dataSlice: any = createSlice({
  name: "p2p",
  initialState: {
    openOrderLoader: true,
    orderDetailLoader: true,
    orderHistoryLoader:false,
    AdsHistoryLoader:false,
    p2pPair: [],
    openOrders: [],
    AdsHistory:[],
    OrderDetail: {
      detail:{
        status:""
      },
      chat:{}
    },
    orderHistory: [],
  },
  reducers: {
    set2pPair: (state, action) => {
      state.p2pPair = action.payload;
    },
    setChatMessage: (state, action) => {
      state.OrderDetail.chat = action.payload;
    },
    setOrderDetailStatus: (state, action) => {
      state.OrderDetail.detail.status = action.payload;
    },
    setOrderDetail: (state, action) => {
      state.OrderDetail.detail = action.payload;
    },
  },
  extraReducers: {
    [getOpenOrder.fulfilled]: (state, action) => {
      state.openOrderLoader = false;
      state.openOrders = action.payload;
    },
    [getOpenOrder.pending]: (state) => {
      state.openOrderLoader = true;
    },
    [getorderDetail.fulfilled]: (state, action) => {
      state.orderDetailLoader = false;
      state.OrderDetail = action.payload;
    },
    [getorderDetail.pending]: (state) => {
      state.orderDetailLoader = true;
    },
    [getorderDetail.rejected]: (state, action) => {
      state.orderDetailLoader = false;
    },
    [getp2pHistory.fulfilled]: (state, action) => {
      state.orderHistoryLoader = false;
      state.orderHistory = action.payload;
    },
    [getp2pHistory.pending]: (state) => {
      state.orderHistoryLoader = true;
    },
    [getAdsHistory.fulfilled]: (state, action) => {
      state.AdsHistoryLoader = false;
      state.AdsHistory = action.payload;
    },
    [getAdsHistory.pending]: (state) => {
      state.AdsHistoryLoader = true;
    },
  },
});

export const { set2pPair,setChatMessage,setOrderDetail,setOrderDetailStatus } = dataSlice.actions;

export default dataSlice.reducer;
