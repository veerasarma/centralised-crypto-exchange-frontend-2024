import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetTotalBalance,
  apiGetProfitLoss,
  apiGetGainerLooser,
  apiGetLifeTimeReward,
  apiGetAssetsAllocation,
  apiTotalBalanceChart
} from "../../services/dashboard.service";

export const getTotalBalance: any = createAsyncThunk("dashboard/totalBalance", async () => {
  const response: any = await apiGetTotalBalance();
  return response.data.result;
});

export const getProfitLoss: any = createAsyncThunk("dashboard/profitLoss", async () => {
  const response: any = await apiGetProfitLoss();
  return response.data.result;
});

export const getReward: any = createAsyncThunk("dashboard/lifetimeReward", async () => {
  const response: any = await apiGetLifeTimeReward();
  return response.data.result;
});

export const getGainerLooser: any = createAsyncThunk("dashboard/gainerLooser", async () => {
  const response: any = await apiGetGainerLooser();
  return response.data.result;
});

export const getAssetsAllocation: any = createAsyncThunk("dashboard/assetsAllocation", async () => {
  const response: any = await apiGetAssetsAllocation();
  return response.data.result;
});

const TotalBalance: any = {};
const ProfitLoss: any = {};
const GainerLosser: any = {};
const LifetimeReward: any = {};
const AssetsAllocation: any = {};

const dataSlice: any = createSlice({
  name: "dashboard/data",
  initialState: {
    totalBalance: TotalBalance,
    profitLoss: ProfitLoss,
    lifetimeReward: LifetimeReward,
    gainerLooser: GainerLosser,
    assetsAllocation: AssetsAllocation,
  },
  reducers: {},
  extraReducers: {
    [getTotalBalance.fulfilled]: (state, action) => {
      state.totalBalance.loading = false;
      state.totalBalance.data = action.payload.data;
    },
    [getTotalBalance.pending]: (state) => {
      state.totalBalance.loading = true;
    },
    [getProfitLoss.fulfilled]: (state, action) => {
      state.profitLoss.loading = false;
      state.profitLoss.data = action.payload;
    },
    [getProfitLoss.pending]: (state) => {
      state.profitLoss.loading = true;
    },
    [getReward.fulfilled]: (state, action) => {
      state.lifetimeReward.loading = false;
      state.lifetimeReward.data = action.payload;
    },
    [getReward.pending]: (state) => {
      state.lifetimeReward.loading = true;
    },
    [getGainerLooser.fulfilled]: (state, action) => {
      state.gainerLooser.loading = false;
      state.gainerLooser.data = action.payload;
    },
    [getGainerLooser.pending]: (state) => {
      state.gainerLooser.loading = true;
    },
    [getAssetsAllocation.fulfilled]: (state, action) => {
      state.assetsAllocation.loading = false;
      state.assetsAllocation.data = action.payload;
    },
    [getAssetsAllocation.pending]: (state) => {
      state.assetsAllocation.loading = true;
    }
  },
});

export const { } = dataSlice.actions;

export default dataSlice.reducer;
