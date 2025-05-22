import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetAssetData,apiGetWithdrawLimit } from "../../services/Wallet/WalletService";
import { apiGetCurrency, apiGetPriceConversion } from "../../services/Common/CommonService";
import { apiGetTotalBalance } from "../../services/dashboard.service";

export const getPriceConversion: any = createAsyncThunk(
  "wallet/data/priceconversion",
  async () => {
    const response: any = await apiGetPriceConversion();
    return response.data.result;
  }
);

export const getCurrency: any = createAsyncThunk(
  "wallet/data/currency",
  async () => {
    const response: any = await apiGetCurrency();
    return response.data.result;
  }
);

export const getAssetData: any = createAsyncThunk(
  "wallet/data/assets",
  async () => {
    const response: any = await apiGetAssetData();
    return response.data.result;
  }
);
export const getWithdrawLimit: any = createAsyncThunk(
  "wallet/data/withdrawLimit",
  async () => {
    const response: any = await apiGetWithdrawLimit();
    return response.data.result;
  }
);

const initialCurrencyState: any = []
const initialPriceCNVState: any = []
const initialAssetState: any = []

const dataSlice: any = createSlice({
  name: "wallet/data",
  initialState: {
    currency: initialCurrencyState,
    priceConversion: initialPriceCNVState,
    assets: initialAssetState,
    toastAlertStatus: false,
    loading: false,
    withdrawLimit:0
  },

  reducers: {
    updateAssetData: (state, action) => {
      state.assets = action.payload;
    }
  },
  extraReducers: {
    [getPriceConversion.fulfilled]: (state, action) => {
      state.loading = false;
      state.priceConversion = action.payload;
    },
    [getPriceConversion.pending]: (state) => {
      state.loading = true;
    },
    [getCurrency.fulfilled]: (state, action) => {
      state.loading = false;
      state.currency = action.payload;
    },
    [getCurrency.pending]: (state) => {
      state.loading = true;
    },
    [getAssetData.fulfilled]: (state, action) => {
      state.loading = false;
      // console.log(action.payload, 'action.payload')
      state.assets = action.payload;
    },
    [getAssetData.pending]: (state) => {
      state.loading = true;
    },
    [getWithdrawLimit.pending]: (state) => {
      state.loading = true;
    },
    [getWithdrawLimit.fulfilled]: (state, action) => {
      state.loading = false;
      state.withdrawLimit = action.payload;
    },
  }
});

export const {
  updateAssetData
} = dataSlice.actions;

export default dataSlice.reducer;
